<?php

namespace App\Services\Payment;

use App\Services\Interfaces\IPaymentService;
use App\Constants\PaymentConstant;
use App\Models\Order;
use Illuminate\Support\Facades\Log;

abstract class BasePaymentService implements IPaymentService
{
    /**
     * Luồng chung xử lý thanh toán
     */
    public function processPayment(Order $order): array
    {
        // 1. Validate đơn hàng bằng Constant
        if (!$this->validateOrder($order)) {
            return [
                'success' => false,
                'transaction_id' => null,
                'message' => 'Đơn hàng không hợp lệ hoặc đã hoàn tất.'
            ];
        }

        // 2. Ghi log khởi tạo
        $this->logTransaction($order, 'INITIATED');

        // 3. Chạy hàm thanh toán riêng của từng con (Abstract Method)
        $result = $this->executePayment($order);

        // 4. Ghi log kết quả
        $status = $result['success'] ? PaymentConstant::STATUS_COMPLETED : PaymentConstant::STATUS_FAILED;
        $this->logTransaction($order, $status, $result['message']);

        return $result;
    }

    protected function validateOrder(Order $order): bool
    {
        return $order->total_amount > 0 && $order->status !== PaymentConstant::STATUS_COMPLETED;
    }

    protected function logTransaction(Order $order, string $status, string $note = ''): void
    {
        Log::info("[Payment - " . static::class . "] Order #{$order->id} Status: {$status}. Note: {$note}");
    }

    /**
     * Logic thanh toán chi tiết do các Service con cài đặt
     */
    abstract protected function executePayment(Order $order): array;
}
