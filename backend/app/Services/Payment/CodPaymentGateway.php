<?php

namespace App\Services\Payment;

use App\Models\Order;
use App\Constants\OrderConstant;
use App\Services\Interfaces\IPaymentGateway;

class CodPaymentGateway extends BasePaymentGateway implements IPaymentGateway
{
    /**
     * Xử lý thanh toán khi nhận hàng (COD).
     *
     * @param Order $order
     * @return bool
     */
    public function process(Order $order): bool
    {
        // Ghi log giao dịch qua hàm chung của lớp cha BasePaymentGateway
        $this->logPayment($order, OrderConstant::PAYMENT_METHOD_COD, OrderConstant::LOG_AWAITING_DELIVERY);

        // Cập nhật trạng thái đơn hàng trong DB
        $order->update([
            'status' => OrderConstant::STATUS_PENDING,
        ]);

        return true;
    }
}
