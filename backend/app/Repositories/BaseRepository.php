<?php

namespace App\Repositories;

use Illuminate\Database\Eloquent\Model;

abstract class BaseRepository
{
    /**
     * Đối tượng Model hiện tại.
     *
     * @var Model
     */
    protected Model $model;

    /**
     * BaseRepository constructor.
     */
    public function __construct()
    {
        $this->model = $this->resolveModel();
    }

    /**
     * Phương thức trừu tượng buộc lớp con định nghĩa Model tương ứng.
     *
     * @return Model
     */
    abstract protected function resolveModel(): Model;

    /**
     * Tìm kiếm một bản ghi theo ID dùng chung cho tất cả các bảng.
     *
     * @param int $id
     * @return Model|null
     */
    public function find(int $id): ?Model
    {
        return $this->model->find($id);
    }

    /**
     * Lấy toàn bộ danh sách bản ghi dùng chung.
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function all()
    {
        return $this->model->all();
    }

    /**
     * Tạo mới một bản ghi dùng chung.
     *
     * @param array $data
     * @return Model
     */
    public function create(array $data): Model
    {
        return $this->model->create($data);
    }
}

