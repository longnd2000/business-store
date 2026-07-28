<?php

namespace App\Repositories;

use App\Models\Product;
use App\Repositories\Interfaces\IProductRepository;

/**
 * CONCRETE CLASS: 
 * - Kế thừa BaseRepository -> Tự động có sẵn các hàm all(), find(), create(), update(), delete() (Không phải viết lại code)
 * - Implements IProductRepository -> Triển khai các hàm riêng của Product
 */
class ProductRepository extends BaseRepository implements IProductRepository
{
    // Chỉ định Model sử dụng
    public function setModel(): void
    {
        $this->model = app(Product::class);
    }

    // --- LOGIC RIÊNG CỦA PRODUCT ---

    public function getInStockProducts(): mixed
    {
        return $this->model->where('stock', '>', 0)->get();
    }

    public function updateStock(int $productId, int $quantity): bool
    {
        $product = $this->find($productId);
        if (!$product || $product->stock < $quantity) {
            return false;
        }

        return $product->decrement('stock', $quantity);
    }
}
