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
