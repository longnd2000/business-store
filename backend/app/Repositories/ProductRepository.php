<?php

namespace App\Repositories;

use App\Repositories\Interfaces\IProductRepository;
use App\Models\Product;
use Illuminate\Database\Eloquent\Model;

class ProductRepository extends BaseRepository implements IProductRepository
{
    /**
     * Định nghĩa model liên kết của Repository này là Product Model.
     *
     * @return Model
     */
    protected function resolveModel(): Model
    {
        return new Product();
    }

    /**
     * Tìm một sản phẩm theo ID kèm theo danh mục của nó.
     *
     * @param int $id
     * @return Model|null
     */
    public function find(int $id): ?Model
    {
        return $this->model->with('category')->find($id);
    }

    /**
     * Lấy danh sách sản phẩm theo tìm kiếm và danh mục.
     *
     * @param string|null $categorySlug
     * @param string|null $searchQuery
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getFilteredProducts(?string $categorySlug, ?string $searchQuery)
    {
        $query = $this->model->with('category');

        if ($categorySlug && $categorySlug !== 'all') {
            $query->whereHas('category', function ($q) use ($categorySlug) {
                $q->where('slug', $categorySlug);
            });
        }

        if ($searchQuery) {
            $query->where(function ($q) use ($searchQuery) {
                $q->where('name', 'like', "%{$searchQuery}%")
                  ->orWhere('description', 'like', "%{$searchQuery}%");
            });
        }

        return $query->latest()->get();
    }

    /**
     * Lấy các sản phẩm mới nhất nổi bật.
     *
     * @param int $limit
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getFeaturedProducts(int $limit = 4)
    {
        return $this->model->with('category')->latest()->take($limit)->get();
    }

    /**
     * Lấy sản phẩm liên quan (cùng danh mục, loại trừ chính nó).
     *
     * @param int $categoryId
     * @param int $excludeId
     * @param int $limit
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getRelatedProducts(int $categoryId, int $excludeId, int $limit = 4)
    {
        return $this->model->with('category')
            ->where('category_id', $categoryId)
            ->where('id', '!=', $excludeId)
            ->take($limit)
            ->get();
    }
}
