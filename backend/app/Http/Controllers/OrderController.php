<?php

namespace App\Http\Controllers;

use App\Repositories\Interfaces\IOrderRepository;
use App\Services\Interfaces\IOrderService;
use App\Http\Requests\StoreOrderRequest;
use App\Services\Payment\PaymentFactory;
use App\Jobs\ProcessOrderReceiptJob;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

class OrderController extends Controller
{
    /**
     * @var IOrderRepository
     */
    protected $orderRepository;

    /**
     * @var IOrderService
     */
    protected $orderService;

    /**
     * Inject Repository và Service qua constructor (Laravel Container tự xử lý).
     */
    public function __construct(
        IOrderRepository $orderRepository,
        IOrderService $orderService
    ) {
        $this->orderRepository = $orderRepository;
        $this->orderService = $orderService;
    }

    /**
     * Chức năng: Lấy đơn hàng đã mua sử dụng Repository Interface
     */
    public function purchasedOrders(Request $request)
    {
        // Lấy ID user hiện tại (Mặc định là 1 để chạy thử nếu chưa đăng nhập)
        $userId = auth()->id() ?? 1;

        // Gọi hàm từ Interface
        $orders = $this->orderRepository->getPurchasedOrders($userId);

        // Chạy thử hàm find() được kế thừa từ BaseRepository
        $sampleOrder = null;
        if ($orders->isNotEmpty()) {
            $sampleOrder = $this->orderRepository->find($orders->first()->id);
        }

        return response()->json([
            'status' => 'success',
            'user_id_resolved' => $userId,
            'orders_count' => $orders->count(),
            'orders' => $orders,
            'inherited_find_method_test' => $sampleOrder ? [
                'id' => $sampleOrder->id,
                'customer_name' => $sampleOrder->customer_name,
                'total_amount' => $sampleOrder->total_amount
            ] : 'No orders found'
        ]);
    }

    public function store(StoreOrderRequest $request)
    {
        try {
            $order = $this->orderService->createOrder(
                $request->only([
                    'customer_name',
                    'customer_email',
                    'customer_phone',
                    'shipping_address',
                    'payment_method'
                ]),
                $request->items
            );

            // Xử lý thanh toán thông qua Payment Gateway sử dụng Abstract & Interface (Factory Pattern)
            try {
                $gateway = PaymentFactory::make($order->payment_method);
                $gateway->process($order);
            } catch (\Exception $paymentException) {
                Log::error("Payment Error for API Order #{$order->id}: " . $paymentException->getMessage());
            }

            // Đẩy công việc gửi hóa đơn/email chạy ngầm bất đồng bộ qua Redis Queue
            ProcessOrderReceiptJob::dispatch($order);

            return response()->json([
                'message' => 'Đặt hàng thành công!',
                'order' => $order->load(['items.product', 'transactions'])
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage()
            ], 400);
        }
    }
}
