<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Models\User;
use Symfony\Component\HttpFoundation\Response;

class AdminAuthMiddleware
{
    /**
     * Handle an incoming request (Xác thực quyền Admin trước khi vào Controller).
     */
    public function handle(Request $request, Closure $next): Response
    {
        // 1. Kiểm tra header X-Admin-Token hoặc Authorization Bearer
        $token = $request->header('X-Admin-Token');
        
        if (!$token) {
            $authHeader = $request->header('Authorization');
            if ($authHeader && str_starts_with($authHeader, 'Bearer ')) {
                $token = str_replace('Bearer ', '', $authHeader);
            }
        }

        if (!$token) {
            return response()->json(['message' => 'Unauthorized - Token không tồn tại'], 401);
        }

        // 2. Giải mã Token
        $decoded = base64_decode($token);
        if (!$decoded) {
            return response()->json(['message' => 'Unauthorized - Token không hợp lệ'], 401);
        }

        $parts = explode(':', $decoded);
        if (count($parts) < 2) {
            return response()->json(['message' => 'Unauthorized - Định dạng token sai'], 401);
        }

        $username = $parts[0];
        $timestamp = intval($parts[1]);

        // Token hết hạn sau 24 giờ (86400 giây)
        if (time() - $timestamp > 86400) {
            return response()->json(['message' => 'Unauthorized - Token đã hết hạn'], 401);
        }

        // Kiểm tra User Admin trong DB
        $user = User::where('email', $username)->first();
        if (!$user) {
            return response()->json(['message' => 'Unauthorized - Tài khoản không tồn tại'], 401);
        }

        // Đạt tất cả yêu cầu -> Cho phép Request đi tiếp vào Controller!
        return $next($request);
    }
}
