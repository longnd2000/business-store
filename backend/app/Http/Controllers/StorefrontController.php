<?php

namespace App\Http\Controllers;

use App\Repositories\Interfaces\IProductRepository;
use App\Repositories\Interfaces\ICategoryRepository;
use Illuminate\Http\Request;

class StorefrontController extends Controller
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
     * Inject các Repository tương ứng qua Constructor.
     */
    public function __construct(
        IProductRepository $productRepository,
        ICategoryRepository $categoryRepository
    ) {
        $this->productRepository = $productRepository;
        $this->categoryRepository = $categoryRepository;
    }

    public function home()
    {
        $categories = $this->categoryRepository->getCategoriesWithCount();
        $featuredProducts = $this->productRepository->getFeaturedProducts(4);
        return view('store.home', compact('categories', 'featuredProducts'));
    }

    public function products(Request $request)
    {
        $categories = $this->categoryRepository->all();
        $selectedCategory = 'all';

        if ($request->has('category') && $request->query('category') !== 'all') {
            $selectedCategory = $request->query('category');
        }

        $products = $this->productRepository->getFilteredProducts(
            $request->query('category'),
            $request->query('q')
        );

        return view('store.products', compact('products', 'categories', 'selectedCategory'));
    }

    public function detail($id)
    {
        $product = $this->productRepository->find($id);

        if (!$product) {
            abort(404);
        }

        $relatedProducts = $this->productRepository->getRelatedProducts($product->category_id, $product->id, 4);

        return view('store.detail', compact('product', 'relatedProducts'));
    }
}

