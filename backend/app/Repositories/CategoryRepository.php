<?php

namespace App\Repositories;

use App\Repositories\Interfaces\ICategoryRepository;
use App\Models\Category;
use Illuminate\Database\Eloquent\Model;

class CategoryRepository extends BaseRepository implements ICategoryRepository
{
    /**
     * Định nghĩa model liên kết của Repository này là Category Model.
     *
     * @return Model
     */
    protected function resolveModel(): Model
    {
        return new Category();
    }

    /**
     * Lấy toàn bộ danh mục kèm số lượng sản phẩm liên kết.
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getCategoriesWithCount()
    {
        return $this->model->withCount('products')->get();
    }
}
