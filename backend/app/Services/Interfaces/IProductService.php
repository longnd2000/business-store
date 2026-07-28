<?php

namespace App\Services\Interfaces;

interface IProductService
{
    public function getCatalog(): mixed;
    public function createProduct(array $data): mixed;
}
