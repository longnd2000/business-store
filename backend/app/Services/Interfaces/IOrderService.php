<?php

namespace App\Services\Interfaces;

interface IOrderService
{
    public function placeOrder(array $orderData): array;
}
