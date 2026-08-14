<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Artisan;

// Root API Endpoint
Route::get('/', function () {
    return response()->json([
        'name' => config('app.name', 'Laravel'),
        'status' => 'online',
        'message' => 'Welcome to the Business Store API backend.'
    ]);
});

// API Interactive Tester Route
Route::get('/api-tester', function () {
    return view('api_tester');
});

// Dev Tools (Migrations & Seeding helper)
Route::get('/dev/migrate', function () {
    try {
        Artisan::call('migrate:fresh', ['--seed' => true]);
        $output = Artisan::output();
        return response()->json([
            'status' => 'success',
            'message' => 'Migration and seeding completed successfully!',
            'output' => $output
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'status' => 'error',
            'message' => $e->getMessage()
        ], 500);
    }
});

Route::get('/dev/test-auth', function() {
    try {
        $user = \App\Models\User::where('email', 'admin')->first();
        if (!$user) {
            return response()->json([
                'status' => 'error',
                'message' => 'Admin user not found in database. Did you run /dev/migrate?'
            ]);
        }
        $check = \Illuminate\Support\Facades\Hash::check('abc123', $user->password);
        return response()->json([
            'status' => 'success',
            'user' => $user,
            'password_match' => $check
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'status' => 'error',
            'message' => $e->getMessage(),
            'trace' => $e->getTraceAsString()
        ], 500);
    }
});

Route::get('/dev/test-token/{token}', function($token) {
    try {
        $decoded = base64_decode($token);
        if (!$decoded) {
            return response()->json(['status' => 'error', 'message' => 'base64_decode returned false']);
        }
        $parts = explode(':', $decoded);
        if (count($parts) < 2) {
            return response()->json(['status' => 'error', 'message' => 'explode by colon returned less than 2 parts', 'decoded' => $decoded]);
        }
        $username = $parts[0];
        $timestamp = intval($parts[1]);
        $timeDiff = time() - $timestamp;
        $user = \App\Models\User::where('email', $username)->first();
        return response()->json([
            'status' => 'success',
            'decoded' => $decoded,
            'username' => $username,
            'timestamp' => $timestamp,
            'time_difference_seconds' => $timeDiff,
            'user_found' => !is_null($user),
            'user' => $user
        ]);
    } catch (\Exception $e) {
        return response()->json(['status' => 'error', 'message' => $e->getMessage()]);
    }
});

Route::get('/dev/test-headers', function() {
    return response()->json([
        'all_headers' => request()->headers->all(),
        'auth_header' => request()->header('Authorization')
    ]);
});

Route::get('/dev/test-payment', function() {
    try {
        // Tạo một order thực tế trong CSDL để tránh lỗi khóa ngoại (Foreign Key Constraint)
        $order = \App\Models\Order::create([
            'user_id' => null,
            'customer_name' => 'Nguyễn Văn Khách Hàng',
            'customer_email' => 'khachhang@example.com',
            'customer_phone' => '0987654321',
            'shipping_address' => 'Hà Nội, Việt Nam',
            'payment_method' => 'COD',
            'total_amount' => 2500000,
            'status' => \App\Constants\OrderConstant::STATUS_PENDING
        ]);
        
        $results = [];
        
        // 1. Chạy thử cổng COD qua Factory
        $gatewayCod = \App\Services\Payment\PaymentFactory::make('COD');
        $gatewayCod->process($order);
        
        $results['COD'] = [
            'class' => get_class($gatewayCod),
            'is_interface_implementation' => ($gatewayCod instanceof \App\Services\Interfaces\IPaymentGateway),
            'is_abstract_class_subclass' => ($gatewayCod instanceof \App\Services\Payment\BasePaymentGateway),
        ];
        
        // 2. Chạy thử cổng Bank Transfer qua Factory
        $gatewayBank = \App\Services\Payment\PaymentFactory::make('Bank Transfer');
        $gatewayBank->process($order);
        
        $results['Bank_Transfer'] = [
            'class' => get_class($gatewayBank),
            'is_interface_implementation' => ($gatewayBank instanceof \App\Services\Interfaces\IPaymentGateway),
            'is_abstract_class_subclass' => ($gatewayBank instanceof \App\Services\Payment\BasePaymentGateway),
        ];

        // Lấy lịch sử giao dịch vừa ghi nhận từ DB để hiển thị kết quả xác minh
        $transactions = \App\Models\PaymentTransaction::where('order_id', $order->id)->get();
        
        return response()->json([
            'status' => 'success',
            'message' => 'Abstract & Interface OOP design pattern test verified with Database Transactions!',
            'created_order' => $order,
            'payment_gateways_check' => $results,
            'logged_transactions_in_db' => $transactions
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'status' => 'error',
            'message' => $e->getMessage()
        ], 500);
    }
});

Route::get('/dev/test-orders', [\App\Http\Controllers\OrderController::class, 'purchasedOrders']);

Route::get('/dev/test-redis', function() {
    try {
        // 1. THÍ NGHIỆM 1: CACHING (Bộ nhớ đệm)
        $cacheKey = 'product_details_101';
        
        // Xóa cache cũ trước để mô phỏng chính xác
        cache()->forget($cacheKey);
        
        $startTime = microtime(true);
        
        // Lần đầu tiên: Giả lập lấy từ Database (mất 0.5s để truy vấn)
        $product = cache()->remember($cacheKey, 60, function() {
            usleep(500000); // 0.5 giây
            return [
                'id' => 101,
                'name' => 'MacBook M3 Pro Max 2026',
                'price' => 65000000,
                'stock' => 15,
                'source' => 'Lấy dữ liệu từ Database (MySQL/SQLite)'
            ];
        });
        $durationFirstCall = microtime(true) - $startTime;
        
        $startTime = microtime(true);
        // Lần thứ hai: Lấy trực tiếp từ Cache (Redis/RAM)
        $productFromCache = cache($cacheKey);
        $durationSecondCall = microtime(true) - $startTime;
        
        // 2. THÍ NGHIỆM 2: DISTRIBUTED LOCK (Khóa phân tán)
        // Mục đích: Tránh race condition, chỉ cho phép 1 tiến trình xử lý đơn hàng tại 1 thời điểm.
        $lockKey = 'lock_checkout_order_999';
        $lock = cache()->lock($lockKey, 5); // Khóa trong 5 giây
        
        $lockResults = [];
        if ($lock->get()) {
            $lockResults['attempt_1'] = 'Lấy khóa THÀNH CÔNG -> Đang xử lý trừ tiền & trừ kho đơn #999...';
            
            // Thử lấy khóa lần 2 khi chưa release (giả lập 1 request khác nhảy vào đồng thời)
            $anotherRequestLock = cache()->lock($lockKey, 5);
            if (!$anotherRequestLock->get()) {
                $lockResults['attempt_2_concurrent'] = 'Lấy khóa THẤT BẠI -> Hệ thống từ chối xử lý trùng lặp!';
            }
            
            // Xử lý xong -> Giải phóng khóa
            $lock->release();
            $lockResults['release'] = 'Đã giải phóng khóa!';
        }
        
        return response()->json([
            'status' => 'success',
            'redis_techniques' => [
                '1_caching_demo' => [
                    'first_call_duration_seconds' => round($durationFirstCall, 4) . 's (Truy vấn DB)',
                    'second_call_duration_seconds' => round($durationSecondCall, 4) . 's (Lấy từ RAM/Redis)',
                    'speed_improvement' => round(($durationFirstCall / max($durationSecondCall, 0.0001)), 1) . ' lần nhanh hơn!',
                    'data' => $productFromCache
                ],
                '2_distributed_lock_demo' => [
                    'lock_key' => $lockKey,
                    'scenario_simulation' => $lockResults
                ]
            ]
        ]);
        
    } catch (\Exception $e) {
        return response()->json([
            'status' => 'error',
            'message' => 'Lỗi kết nối Redis: ' . $e->getMessage() . ' (Vui lòng kiểm tra dịch vụ Redis đã được bật chưa)'
        ], 500);
    }
});

