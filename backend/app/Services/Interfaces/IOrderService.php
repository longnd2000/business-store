<?php

namespace App\Services\Interfaces;

use App\Models\Order;

interface IOrderService
{
    /**
     * Tạo đơn hàng mới từ giỏ hàng hoặc request API.
     *
     * @param array $orderData
     * @param array $items
     * @return Order
     * @throws \Exception
     */
    public function createOrder(array $orderData, array $items): Order;
}
