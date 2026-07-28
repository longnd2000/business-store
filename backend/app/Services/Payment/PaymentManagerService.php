<?php

namespace App\Services\Payment;

use App\Services\Interfaces\IPaymentService;
use App\Constants\PaymentConstant;
use InvalidArgumentException;

class PaymentManagerService
{
    /**
     * Khởi tạo Service tương ứng dựa trên Constant định nghĩa sẵn
     */
    public function make(string $method): IPaymentService
    {
        $methodFormatted = strtoupper(trim($method));

        return match ($methodFormatted) {
            PaymentConstant::METHOD_COD           => app(CodPaymentService::class),
            PaymentConstant::METHOD_BANK_TRANSFER => app(BankTransferPaymentService::class),
            PaymentConstant::METHOD_VNPAY         => app(VnPayPaymentService::class),
            default                               => throw new InvalidArgumentException("Phương thức thanh toán [{$method}] không hợp lệ.")
        };
    }
}
