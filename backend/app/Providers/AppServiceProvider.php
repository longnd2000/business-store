<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

// Repositories & Interfaces
use App\Repositories\Interfaces\IProductRepository;
use App\Repositories\ProductRepository;
use App\Repositories\Interfaces\IOrderRepository;
use App\Repositories\OrderRepository;

// Services & Interfaces
use App\Services\Interfaces\IProductService;
use App\Services\ProductService;
use App\Services\Interfaces\IOrderService;
use App\Services\OrderService;
use App\Services\Interfaces\IAuthService;
use App\Services\AuthService;
use App\Services\Interfaces\IExportService;
use App\Services\Export\CsvExportService;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // 1. Bind Repositories
        $this->app->bind(IProductRepository::class, ProductRepository::class);
        $this->app->bind(IOrderRepository::class, OrderRepository::class);

        // 2. Bind Services
        $this->app->bind(IProductService::class, ProductService::class);
        $this->app->bind(IOrderService::class, OrderService::class);
        $this->app->bind(IAuthService::class, AuthService::class);
        $this->app->bind(IExportService::class, CsvExportService::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
