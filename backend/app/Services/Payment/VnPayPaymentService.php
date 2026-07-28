<?php

namespace App\Services\Payment;

use App\Constants\PaymentConstant;
use App\Models\Order;

class VnPayPaymentService extends BasePaymentService
{
    protected function executePayment(Order $order): array
    {
        $vnpUrl = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?vnp_Amount=" . ($order->total_amount * 100) . "&vnp_TxnRef=" . $order->id;

        return [
            'success' => true,
            'transaction_id' => 'VNPAY-' . $order->id . '-' . time(),
            'payment_url' => $vnpUrl,
            'message' => 'Đang chuyển hướng sang cổng thanh toán VNPay...'
        ];
    }
}
