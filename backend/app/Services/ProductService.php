<?php

namespace App\Services;

use App\Repositories\Interfaces\IProductRepository;
use App\Services\Interfaces\IProductService;

class ProductService implements IProductService
{
    protected IProductRepository $productRepository;

    // Inject ProductRepository thông qua Interface của nó
    public function __construct(IProductRepository $productRepository)
    {
        $this->productRepository = $productRepository;
    }

    public function getCatalog(): mixed
    {
        // Gọi hàm getInStockProducts riêng của ProductRepository
        return $this->productRepository->getInStockProducts();
    }

    public function createProduct(array $data): mixed
    {
        // Gọi hàm create() được KẾ THỪA TỪ BaseRepository (Logic dùng chung)
        return $this->productRepository->create($data);
    }
}
