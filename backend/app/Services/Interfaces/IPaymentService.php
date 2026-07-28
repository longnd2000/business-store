<?php

namespace App\Services\Interfaces;

use App\Models\Order;

interface IPaymentService
{
    /**
     * Khai báo hàm xử lý thanh toán bắt buộc cho các Service thanh toán
     *
     * @param Order $order
     * @return array
     */
    public function processPayment(Order $order): array;
}
