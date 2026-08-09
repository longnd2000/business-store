<?php

namespace App\Repositories;

use App\Repositories\Interfaces\IOrderRepository;
use App\Models\Order;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Collection;

class OrderRepository extends BaseRepository implements IOrderRepository
{
    /**
     * Định nghĩa model liên kết của Repository này là Order Model.
     *
     * @return Model
     */
    protected function resolveModel(): Model
    {
        return new Order();
    }

    /**
     * Lấy toàn bộ đơn hàng của user kèm các sản phẩm chi tiết.
     *
     * @param int $userId
     * @return Collection
     */
    public function getPurchasedOrders(int $userId): Collection
    {
        return $this->model->where('user_id', $userId)
                           ->with(['items.product', 'transactions'])
                           ->latest()
                           ->get();
    }
}

