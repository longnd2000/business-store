<?php

namespace App\Http\Controllers;

use App\Services\Interfaces\IOrderService;
use App\Http\Requests\StoreWebOrderRequest;
use App\Services\Payment\PaymentFactory;
use App\Jobs\ProcessOrderReceiptJob;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

class WebOrderController extends Controller
{
    /**
     * @var IOrderService
     */
    protected $orderService;

    /**
     * Inject IOrderService qua constructor.
     */
    public function __construct(IOrderService $orderService)
    {
        $this->orderService = $orderService;
    }

    public function checkout()
    {
        $cart = session()->get('cart', []);
        if (empty($cart)) {
            return redirect()->route('cart.index')->with('error', 'Giỏ hàng của bạn đang trống.');
        }
        $cartTotal = 0;
        foreach ($cart as $item) {
            $cartTotal += $item['price'] * $item['quantity'];
        }
        return view('store.checkout', compact('cart', 'cartTotal'));
    }

    public function store(StoreWebOrderRequest $request)
    {
        $cart = session()->get('cart', []);
        if (empty($cart)) {
            return redirect()->route('cart.index')->with('error', 'Giỏ hàng của bạn đang trống.');
        }

        try {
            // Định dạng giỏ hàng thành danh sách chi tiết sản phẩm cho service xử lý
            $items = [];
            foreach ($cart as $id => $item) {
                $items[] = [
                    'product_id' => $id,
                    'quantity' => $item['quantity']
                ];
            }

            // Gọi OrderService để xử lý logic nghiệp vụ đặt hàng phức tạp
            $order = $this->orderService->createOrder([
                'customer_name' => $request->customer_name,
                'customer_phone' => $request->customer_phone,
                'shipping_address' => $request->shipping_address,
                'payment_method' => $request->payment_method,
            ], $items);

            // Clear session cart
            session()->forget('cart');

            // Xử lý thanh toán thông qua Payment Gateway sử dụng Abstract & Interface (Factory Pattern)
            try {
                $gateway = PaymentFactory::make($order->payment_method);
                $gateway->process($order);
            } catch (\Exception $paymentException) {
                // Ghi log lỗi nhưng vẫn cho phép chuyển tiếp đến trang thành công để không làm gián đoạn trải nghiệm người dùng
                Log::error("Payment Error for Order #{$order->id}: " . $paymentException->getMessage());
            }

            // Đẩy công việc gửi hóa đơn/email chạy ngầm bất đồng bộ qua Redis Queue
            ProcessOrderReceiptJob::dispatch($order);

            return redirect()->route('checkout.success', $order->id);

        } catch (\Exception $e) {
            return redirect()->back()->withInput()->with('error', $e->getMessage());
        }
    }

    public function success($id)
    {
        $order = Order::with('items.product')->findOrFail($id);
        return view('store.success', compact('order'));
    }
}
