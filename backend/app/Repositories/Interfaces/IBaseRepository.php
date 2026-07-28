<?php

namespace App\Repositories\Interfaces;

/**
 * INTERFACE: Chỉ quy định các class Repository PHẢI CÓ những phương thức nào.
 */
interface IBaseRepository
{
    public function all(): mixed;
    public function find(int $id): mixed;
    public function create(array $data): mixed;
    public function update(int $id, array $data): bool;
    public function delete(int $id): bool;
}
