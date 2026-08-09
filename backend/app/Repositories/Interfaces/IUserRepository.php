<?php

namespace App\Repositories\Interfaces;

use App\Models\User;

interface IUserRepository extends IBaseRepository
{
    /**
     * Tìm người dùng bằng email/số điện thoại (ở đây là cột email).
     *
     * @param string $email
     * @return User|null
     */
    public function findByEmail(string $email): ?User;

    /**
     * Tạo người dùng mới với mật khẩu được mã hóa.
     *
     * @param array $data
     * @return User
     */
    public function createWithPassword(array $data): User;
}
