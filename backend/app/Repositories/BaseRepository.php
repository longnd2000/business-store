<?php

namespace App\Repositories;

use App\Repositories\Interfaces\IBaseRepository;
use Illuminate\Database\Eloquent\Model;

/**
 * ABSTRACT CLASS: Nơi tập trung LOGIC DÙNG CHUNG cho tất cả Repository.
 * Nhờ có class này, các class con (ProductRepository, UserRepository...) 
 * KHÔNG CẦN VIẾT LAỊ logic CRUD cơ bản.
 */
abstract class BaseRepository implements IBaseRepository
{
    protected Model $model;

    public function __construct()
    {
        $this->setModel();
    }

    /**
     * Mỗi Repository con bắt buộc phải chỉ định Model tương ứng
     */
    abstract public function setModel(): void;

    // --- CÁC LOGIC DÙNG CHUNG (COMMON LOGIC) ---

    public function all(): mixed
    {
        return $this->model->all();
    }

    public function find(int $id): mixed
    {
        return $this->model->find($id);
    }

    public function create(array $data): mixed
    {
        return $this->model->create($data);
    }

    public function update(int $id, array $data): bool
    {
        $record = $this->find($id);
        return $record ? $record->update($data) : false;
    }

    public function delete(int $id): bool
    {
        $record = $this->find($id);
        return $record ? $record->delete() : false;
    }
}
