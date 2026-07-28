<?php

namespace App\Services\Payment;

use App\Constants\PaymentConstant;
use App\Models\Order;

class CodPaymentService extends BasePaymentService
{
    protected function executePayment(Order $order): array
    {
        $order->update(['status' => PaymentConstant::STATUS_PENDING]);

        return [
            'success' => true,
            'transaction_id' => 'COD-' . $order->id . '-' . time(),
            'message' => 'Đơn hàng đã được ghi nhận. Quý khách vui lòng thanh toán tiền mặt khi nhận hàng.'
        ];
    }
}
