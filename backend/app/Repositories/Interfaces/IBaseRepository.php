<?php

namespace App\Repositories\Interfaces;

use Illuminate\Database\Eloquent\Model;

interface IBaseRepository
{
    /**
     * Tìm một bản ghi theo ID.
     *
     * @param int $id
     * @return Model|null
     */
    public function find(int $id): ?Model;

    /**
     * Lấy toàn bộ danh sách bản ghi.
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function all();

    /**
     * Tạo mới một bản ghi.
     *
     * @param array $data
     * @return Model
     */
    public function create(array $data): Model;
}
