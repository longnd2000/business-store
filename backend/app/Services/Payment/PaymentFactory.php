<?php

namespace App\Services\Payment;

use App\Services\Interfaces\IPaymentGateway;
use App\Constants\OrderConstant;

class PaymentFactory
{
    /**
     * Tạo và trả về đối tượng xử lý thanh toán tương ứng dựa trên tên phương thức.
     * Sử dụng Container helper app() của Laravel để tự động phân giải các dependency của Class.
     *
     * @param string $method
     * @return IPaymentGateway
     * @throws \InvalidArgumentException
     */
    public static function make(string $method): IPaymentGateway
    {
        return match ($method) {
            OrderConstant::PAYMENT_METHOD_COD => app(CodPaymentGateway::class),
            OrderConstant::PAYMENT_METHOD_BANK_TRANSFER => app(BankTransferPaymentGateway::class),
            default => throw new \InvalidArgumentException("Phương thức thanh toán '{$method}' không được hỗ trợ."),
        };
    }
}
