<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // Bindings for Repositories
        $this->app->bind(
            \App\Repositories\Interfaces\IOrderRepository::class,
            \App\Repositories\OrderRepository::class
        );

        $this->app->bind(
            \App\Repositories\Interfaces\IProductRepository::class,
            \App\Repositories\ProductRepository::class
        );

        $this->app->bind(
            \App\Repositories\Interfaces\ICategoryRepository::class,
            \App\Repositories\CategoryRepository::class
        );

        $this->app->bind(
            \App\Repositories\Interfaces\IUserRepository::class,
            \App\Repositories\UserRepository::class
        );

        // Bindings for Services
        $this->app->bind(
            \App\Services\Interfaces\IOrderService::class,
            \App\Services\OrderService::class
        );

        $this->app->bind(
            \App\Services\Interfaces\IAuthService::class,
            \App\Services\AuthService::class
        );
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
