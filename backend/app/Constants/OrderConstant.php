<?php

namespace App\Constants;

class OrderConstant
{
    // Trạng thái đơn hàng (Order status)
    public const STATUS_PENDING = 'Pending';
    public const STATUS_PROCESSING = 'Processing';
    public const STATUS_COMPLETED = 'Completed';
    public const STATUS_CANCELLED = 'Cancelled';

    // Phương thức thanh toán (Payment methods)
    public const PAYMENT_METHOD_COD = 'COD';
    public const PAYMENT_METHOD_BANK_TRANSFER = 'Bank Transfer';

    // Trạng thái giao dịch cổng thanh toán (Payment transaction statuses)
    public const LOG_AWAITING_DELIVERY = 'AWAITING_DELIVERY';
    public const LOG_AWAITING_TRANSFER_CONFIRMATION = 'AWAITING_TRANSFER_CONFIRMATION';
}
