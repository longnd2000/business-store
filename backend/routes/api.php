<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\AdminController;

// Public APIs
Route::get('/categories', [ProductController::class, 'categories']);
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{id}', [ProductController::class, 'show']);
Route::post('/orders', [OrderController::class, 'store']);

// Public API Auth: Đăng nhập lấy JWT Token
Route::post('/admin/login', [AdminController::class, 'login']);

// Protected APIs (Yêu cầu phải có Header Authorization: Bearer <jwt_token>)
Route::middleware('jwt.auth')->prefix('admin')->group(function () {
    Route::get('/me', [AdminController::class, 'me']);
    Route::get('/orders', [AdminController::class, 'orders']);
    Route::put('/orders/{id}/status', [AdminController::class, 'updateStatus']);
    Route::get('/stats', [AdminController::class, 'stats']);

    Route::get('/categories', [AdminController::class, 'categories']);
    Route::post('/categories', [AdminController::class, 'storeCategory']);
    Route::put('/categories/{id}', [AdminController::class, 'updateCategory']);
    Route::delete('/categories/{id}', [AdminController::class, 'deleteCategory']);

    Route::get('/products', [AdminController::class, 'products']);
    Route::post('/products', [AdminController::class, 'storeProduct']);
    Route::put('/products/{id}', [AdminController::class, 'updateProduct']);
    Route::delete('/products/{id}', [AdminController::class, 'deleteProduct']);

    Route::get('/buyers', [AdminController::class, 'buyers']);
});
