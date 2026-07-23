<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\AdminController;

Route::get('/categories', [ProductController::class, 'categories']);
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{id}', [ProductController::class, 'show']);

Route::post('/orders', [OrderController::class, 'store']);

Route::get('/admin/orders', [AdminController::class, 'orders']);
Route::put('/admin/orders/{id}/status', [AdminController::class, 'updateStatus']);
Route::get('/admin/stats', [AdminController::class, 'stats']);
Route::post('/admin/login', [AdminController::class, 'login']);

// Admin Categories Management
Route::get('/admin/categories', [AdminController::class, 'categories']);
Route::post('/admin/categories', [AdminController::class, 'storeCategory']);
Route::put('/admin/categories/{id}', [AdminController::class, 'updateCategory']);
Route::delete('/admin/categories/{id}', [AdminController::class, 'deleteCategory']);

// Admin Products Management
Route::get('/admin/products', [AdminController::class, 'products']);
Route::post('/admin/products', [AdminController::class, 'storeProduct']);
Route::put('/admin/products/{id}', [AdminController::class, 'updateProduct']);
Route::delete('/admin/products/{id}', [AdminController::class, 'deleteProduct']);

// Admin Buyers Management
Route::get('/admin/buyers', [AdminController::class, 'buyers']);
