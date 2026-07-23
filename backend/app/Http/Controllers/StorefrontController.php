<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Category;
use Illuminate\Http\Request;

class StorefrontController extends Controller
{
    public function home()
    {
        $categories = Category::withCount('products')->get();
        $featuredProducts = Product::with('category')->latest()->take(4)->get();
        return view('store.home', compact('categories', 'featuredProducts'));
    }

    public function products(Request $request)
    {
        $query = Product::with('category');
        $categories = Category::all();
        $selectedCategory = 'all';

        if ($request->has('category') && $request->query('category') !== 'all') {
            $categorySlug = $request->query('category');
            $selectedCategory = $categorySlug;
            $query->whereHas('category', function ($q) use ($categorySlug) {
                $q->where('slug', $categorySlug);
            });
        }

        if ($request->has('q') && !empty($request->query('q'))) {
            $search = $request->query('q');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        $products = $query->latest()->get();

        return view('store.products', compact('products', 'categories', 'selectedCategory'));
    }

    public function detail($id)
    {
        $product = Product::with('category')->findOrFail($id);
        $relatedProducts = Product::with('category')
            ->where('category_id', $product->category_id)
            ->where('id', '!=', $product->id)
            ->take(4)
            ->get();

        return view('store.detail', compact('product', 'relatedProducts'));
    }
}
