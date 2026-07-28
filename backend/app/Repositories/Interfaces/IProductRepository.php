<?php

namespace App\Repositories\Interfaces;

/**
 * INTERFACE riêng cho Product: Thêm các phương thức đặc thù của Sản phẩm.
 */
interface IProductRepository extends IBaseRepository
{
    public function getInStockProducts(): mixed;
    public function updateStock(int $productId, int $quantity): bool;
}
