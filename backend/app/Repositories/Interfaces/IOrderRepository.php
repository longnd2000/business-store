<?php

namespace App\Repositories\Interfaces;

interface IOrderRepository extends IBaseRepository
{
    public function getOrdersByCustomerEmail(string $email): mixed;
}
