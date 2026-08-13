<?php

namespace App\Http\Controllers;

use App\Repositories\Interfaces\IProductRepository;
use App\Repositories\Interfaces\ICategoryRepository;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    /**
     * @var IProductRepository
     */
    protected $productRepository;

    /**
     * @var ICategoryRepository
     */
    protected $categoryRepository;

    /**
     * Inject các Repository vào Constructor.
     */
    public function __construct(
        IProductRepository $productRepository,
        ICategoryRepository $categoryRepository
    ) {
        $this->productRepository = $productRepository;
        $this->categoryRepository = $categoryRepository;
    }

    public function index(Request $request)
    {
        $products = $this->productRepository->getFilteredProducts(
            $request->query('category'),
            $request->query('q')
        );

        return response()->json($products);
    }

    public function show($id)
    {
        $product = $this->productRepository->find($id);

        if (!$product) {
            return response()->json(['message' => 'Product not found'], 404);
        }

        return response()->json($product);
    }

    public function categories()
    {
        $categories = $this->categoryRepository->getCategoriesWithCount();
        return response()->json($categories);
    }
}

