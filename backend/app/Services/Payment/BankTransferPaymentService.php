<?php

namespace App\Services\Payment;

use App\Constants\PaymentConstant;
use App\Models\Order;

class BankTransferPaymentService extends BasePaymentService
{
    protected function executePayment(Order $order): array
    {
        $bankAccount = "MBBANK - 0987654321 - CTY BUSINESS STORE";
        $content = "CHUYEN KHOAN DON HANG #" . $order->id;

        return [
            'success' => true,
            'transaction_id' => 'BANK-' . $order->id . '-' . time(),
            'message' => "Vui lòng chuyển khoản số tiền " . number_format($order->total_amount) . " VNĐ đến tài khoản {$bankAccount} với nội dung: {$content}"
        ];
    }
}
