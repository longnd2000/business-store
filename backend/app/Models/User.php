<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Thuộc tính JWTSubject: Trả về khóa chính của User (ID)
     */
    public function getJWTIdentifier(): mixed
    {
        return $this->getKey();
    }

    /**
     * Thuộc tính JWTSubject: Đính kèm dữ liệu tùy chỉnh vào Payload của Token
     */
    public function getJWTCustomClaims(): array
    {
        return [
            'email' => $this->email,
            'name'  => $this->name,
        ];
    }
}
