<?php

namespace App\Services;

use App\Services\Interfaces\IOrderService;
use App\Repositories\Interfaces\IOrderRepository;
use App\Repositories\Interfaces\IProductRepository;
use App\Repositories\Interfaces\IUserRepository;
use App\Constants\OrderConstant;
use App\Models\Order;
use Illuminate\Support\Facades\DB;

class OrderService implements IOrderService
{
    /**
     * @var IOrderRepository
     */
    protected $orderRepository;

    /**
     * @var IProductRepository
     */
    protected $productRepository;

    /**
     * @var IUserRepository
     */
    protected $userRepository;

    /**
     * Inject các Repository tương ứng thông qua Constructor.
     */
    public function __construct(
        IOrderRepository $orderRepository,
        IProductRepository $productRepository,
        IUserRepository $userRepository
    ) {
        $this->orderRepository = $orderRepository;
        $this->productRepository = $productRepository;
        $this->userRepository = $userRepository;
    }

    /**
     * Tạo đơn hàng mới từ giỏ hàng hoặc request API.
     *
     * @param array $orderData
     * @param array $items
     * @return Order
     * @throws \Exception
     */
    public function createOrder(array $orderData, array $items): Order
    {
        return DB::transaction(function () use ($orderData, $items) {
            $totalAmount = 0;
            $itemsToCreate = [];

            // 1. Kiểm tra tồn kho và chuẩn bị danh sách sản phẩm cần mua
            foreach ($items as $item) {
                $productId = $item['product_id'];
                $quantity = $item['quantity'];

                $product = $this->productRepository->find($productId);

                if (!$product || $product->stock < $quantity) {
                    throw new \Exception("Sản phẩm " . ($product->name ?? 'không xác định') . " không đủ số lượng trong kho.");
                }

                // Trừ kho
                $product->decrement('stock', $quantity);

                $subtotal = $product->price * $quantity;
                $totalAmount += $subtotal;

                $itemsToCreate[] = [
                    'product_id' => $product->id,
                    'quantity' => $quantity,
                    'price' => $product->price
                ];
            }

            // 2. Kiểm tra/Tạo người dùng dựa trên số điện thoại (dành cho Web checkout)
            $userId = auth()->id();
            if (!$userId && isset($orderData['customer_phone'])) {
                $user = $this->userRepository->findByEmail($orderData['customer_phone']);
                if (!$user) {
                    $user = $this->userRepository->createWithPassword([
                        'name' => $orderData['customer_name'],
                        'email' => $orderData['customer_phone'],
                        'password' => 'a12345',
                    ]);
                }
                $userId = $user->id;
            }

            // 3. Tạo Đơn hàng thông qua OrderRepository
            $order = $this->orderRepository->create([
                'user_id' => $userId,
                'customer_name' => $orderData['customer_name'],
                'customer_email' => $orderData['customer_email'] ?? null,
                'customer_phone' => $orderData['customer_phone'],
                'shipping_address' => $orderData['shipping_address'],
                'payment_method' => $orderData['payment_method'],
                'total_amount' => $totalAmount,
                'status' => OrderConstant::STATUS_PENDING
            ]);

            // 4. Tạo chi tiết đơn hàng
            foreach ($itemsToCreate as $orderItem) {
                $order->items()->create($orderItem);
            }

            return $order;
        });
    }
}
