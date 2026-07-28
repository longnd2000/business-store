<?php

namespace App\Services\Interfaces;

interface IAuthService
{
    public function login(string $username, string $password): array;
}
