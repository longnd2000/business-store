<?php

namespace App\Repositories\Interfaces;

use Illuminate\Support\Collection;

interface IOrderRepository extends IBaseRepository
{
    /**
     * Lấy danh sách đơn hàng đã mua của người dùng.
     *
     * @param int $userId
     * @return Collection
     */
    public function getPurchasedOrders(int $userId): Collection;
}
