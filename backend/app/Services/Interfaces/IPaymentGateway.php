<?php

namespace App\Services\Interfaces;

use App\Models\Order;

interface IPaymentGateway
{
    /**
     * Phương thức bắt buộc mọi cổng thanh toán phải có để thực hiện giao dịch.
     *
     * @param Order $order
     * @return bool
     */
    public function process(Order $order): bool;
}
