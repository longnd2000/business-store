<?php

namespace App\Services\Payment;

use App\Services\Interfaces\IPaymentGateway;
use App\Models\Order;
use App\Models\PaymentTransaction;
use App\Constants\OrderConstant;
use Illuminate\Support\Facades\Log;

abstract class BasePaymentGateway
{
    /**
     * Ghi log và lưu giao dịch vào cơ sở dữ liệu.
     *
     * @param Order $order
     * @param string $gatewayName
     * @param string $status
     * @param string|null $reference
     * @param array|null $payload
     * @return void
     */
    protected function logPayment(Order $order, string $gatewayName, string $status, ?string $reference = null, ?array $payload = null): void
    {
        // 1. Ghi log ra file log hệ thống
        Log::info(sprintf(
            "[%s] Payment Transaction - Gateway: %s, Order ID: %s, Status: %s, Amount: %s VNĐ",
            now()->toDateTimeString(),
            $gatewayName,
            $order->id,
            $status,
            number_format($order->total_amount)
        ));

        // 2. Ghi nhận giao dịch chuyển khoản/tiền mặt vào bảng payment_transactions trong CSDL
        PaymentTransaction::create([
            'order_id' => $order->id,
            'gateway' => $gatewayName,
            'transaction_reference' => $reference,
            'amount' => $order->total_amount,
            'status' => $status,
            'payload' => $payload,
        ]);
    }

    /**
     * Định dạng hóa đơn phản hồi chung.
     *
     * @param Order $order
     * @return string
     */
    protected function formatReceipt(Order $order): string
    {
        return "Xin chào {$order->customer_name}. Đơn hàng #{$order->id} trị giá " . number_format($order->total_amount) . " VNĐ.";
    }

    /**
     * Xác nhận thanh toán thành công (dùng chung cho Webhook callback hoặc xác nhận thủ công).
     * Cập nhật giao dịch thành SUCCESS và chuyển trạng thái đơn hàng sang Processing.
     *
     * @param Order $order
     * @param string $reference
     * @param array $payload
     * @return void
     */
    public function confirmPayment(Order $order, string $reference, array $payload): void
    {
        $this->logPayment($order, $order->payment_method, 'SUCCESS', $reference, $payload);

        $order->update([
            'status' => OrderConstant::STATUS_PROCESSING
        ]);

        Log::info("Order #{$order->id} confirmed via IPN/Webhook. Status updated to Processing.");
    }
}
