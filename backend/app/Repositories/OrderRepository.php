<?php

namespace App\Repositories;

use App\Models\Order;
use App\Repositories\Interfaces\IOrderRepository;

class OrderRepository extends BaseRepository implements IOrderRepository
{
    public function setModel(): void
    {
        $this->model = app(Order::class);
    }

    public function getOrdersByCustomerEmail(string $email): mixed
    {
        return $this->model->where('customer_email', $email)->with('items.product')->get();
    }
}
