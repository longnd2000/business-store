<?php

namespace App\Constants;

class PaymentConstant
{
    // Danh sách các phương thức thanh toán (Payment Methods)
    public const METHOD_COD = 'COD';
    public const METHOD_BANK_TRANSFER = 'BANK_TRANSFER';
    public const METHOD_VNPAY = 'VNPAY';

    // Danh sách trạng thái đơn hàng (Order / Payment Statuses)
    public const STATUS_PENDING = 'Pending';
    public const STATUS_COMPLETED = 'Completed';
    public const STATUS_FAILED = 'Failed';
}
