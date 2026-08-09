<?php

namespace App\Repositories\Interfaces;

interface IProductRepository extends IBaseRepository
{
    /**
     * Lấy danh sách sản phẩm theo tìm kiếm và danh mục.
     *
     * @param string|null $categorySlug
     * @param string|null $searchQuery
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getFilteredProducts(?string $categorySlug, ?string $searchQuery);

    /**
     * Lấy các sản phẩm mới nhất nổi bật.
     *
     * @param int $limit
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getFeaturedProducts(int $limit = 4);

    /**
     * Lấy sản phẩm liên quan (cùng danh mục, loại trừ chính nó).
     *
     * @param int $categoryId
     * @param int $excludeId
     * @param int $limit
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getRelatedProducts(int $categoryId, int $excludeId, int $limit = 4);
}
