<?php

namespace App\Repositories;

use App\Repositories\Interfaces\IUserRepository;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Hash;

class UserRepository extends BaseRepository implements IUserRepository
{
    /**
     * Định nghĩa model liên kết của Repository này là User Model.
     *
     * @return Model
     */
    protected function resolveModel(): Model
    {
        return new User();
    }

    /**
     * Tìm người dùng bằng email/số điện thoại (ở đây là cột email).
     *
     * @param string $email
     * @return User|null
     */
    public function findByEmail(string $email): ?User
    {
        return $this->model->where('email', $email)->first();
    }

    /**
     * Tạo người dùng mới với mật khẩu được mã hóa.
     *
     * @param array $data
     * @return User
     */
    public function createWithPassword(array $data): User
    {
        return $this->model->create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
        ]);
    }
}
