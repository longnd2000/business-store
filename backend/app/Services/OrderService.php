<?php

namespace App\Services;

use App\Constants\PaymentConstant;
use App\Models\Product;
use App\Repositories\Interfaces\IOrderRepository;
use App\Repositories\Interfaces\IProductRepository;
use App\Services\Interfaces\IOrderService;
use App\Services\Payment\PaymentManagerService;
use Illuminate\Support\Facades\DB;
use Exception;

class OrderService implements IOrderService
{
    public function __construct(
        protected IOrderRepository $orderRepository,
        protected IProductRepository $productRepository,
        protected PaymentManagerService $paymentManager
    ) {}

    public function placeOrder(array $orderData): array
    {
        $order = DB::transaction(function () use ($orderData) {
            $totalAmount = 0;
            $itemsToCreate = [];

            foreach ($orderData['items'] as $itemData) {
                /** @var Product $product */
                $product = Product::lockForUpdate()->find($itemData['product_id']);

                if (!$product || $product->stock < $itemData['quantity']) {
                    throw new Exception("Sản phẩm " . ($product->name ?? 'không xác định') . " không đủ số lượng trong kho.");
                }

                // Trừ tồn kho qua ProductRepository
                $this->productRepository->updateStock($product->id, $itemData['quantity']);

                $subtotal = $product->price * $itemData['quantity'];
                $totalAmount += $subtotal;

                $itemsToCreate[] = [
                    'product_id' => $product->id,
                    'quantity' => $itemData['quantity'],
                    'price' => $product->price
                ];
            }

            // Tạo đơn hàng qua OrderRepository
            $newOrder = $this->orderRepository->create([
                'customer_name' => $orderData['customer_name'],
                'customer_email' => $orderData['customer_email'],
                'customer_phone' => $orderData['customer_phone'],
                'shipping_address' => $orderData['shipping_address'],
                'payment_method' => $orderData['payment_method'],
                'total_amount' => $totalAmount,
                'status' => PaymentConstant::STATUS_PENDING
            ]);

            foreach ($itemsToCreate as $item) {
                $newOrder->items()->create($item);
            }

            return $newOrder;
        });

        // Xử lý thanh toán qua Payment Service tương ứng
        $paymentGateway = $this->paymentManager->make($orderData['payment_method']);
        $paymentResult = $paymentGateway->processPayment($order);

        return [
            'order' => $order->load('items.product'),
            'payment' => $paymentResult
        ];
    }
}
