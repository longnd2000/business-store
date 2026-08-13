<?php

namespace App\Repositories\Interfaces;

interface ICategoryRepository extends IBaseRepository
{
    /**
     * Lấy toàn bộ danh mục kèm số lượng sản phẩm liên kết.
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getCategoriesWithCount();
}
