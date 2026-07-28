<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Models\User;
use Exception;

class JwtAuthMiddleware
{
    private string $secretKey = 'BUSINESS_STORE_JWT_SECRET_KEY_2026';

    public function handle(Request $request, Closure $next): Response
    {
        // STEP 1: Lấy Bearer Token từ Header "Authorization: Bearer <token>"
        $authHeader = $request->header('Authorization');
        
        if (!$authHeader || !str_starts_with($authHeader, 'Bearer ')) {
            return response()->json(['message' => 'Unauthorized - Thiếu Bearer Token trong Header'], 401);
        }

        $jwtToken = str_replace('Bearer ', '', $authHeader);

        try {
            // STEP 2: Decode & Verify chữ ký JWT Signature
            $payload = $this->verifyJwtToken($jwtToken);

            // STEP 3: Kiểm tra hạn sử dụng (exp)
            if (isset($payload['exp']) && time() > $payload['exp']) {
                return response()->json(['message' => 'Unauthorized - JWT Token đã hết hạn'], 401);
            }

            // STEP 4: Tìm User trong Database từ ID (sub)
            $user = User::find($payload['sub'] ?? null);
            if (!$user) {
                return response()->json(['message' => 'Unauthorized - Tài khoản không tồn tại'], 401);
            }

            // STEP 5: Đưa đối tượng User vào Request để Controller dùng ($request->user())
            $request->setUserResolver(fn () => $user);

            // Cho phép đi tiếp vào Controller!
            return $next($request);

        } catch (Exception $e) {
            return response()->json([
                'message' => 'Unauthorized - Token không hợp lệ: ' . $e->getMessage()
            ], 401);
        }
    }

    private function verifyJwtToken(string $jwt): array
    {
        $parts = explode('.', $jwt);
        if (count($parts) !== 3) {
            throw new Exception("Token không đúng định dạng 3 phần của JWT.");
        }

        [$headerB64, $payloadB64, $signatureB64] = $parts;

        // Tính lại chữ ký Signature với SecretKey của Server
        $expectedSignature = hash_hmac('sha256', $headerB64 . "." . $payloadB64, $this->secretKey, true);
        $expectedSignatureB64 = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($expectedSignature));

        // So sánh chữ ký của Client gửi lên với chữ ký Server tự tính
        if (!hash_equals($expectedSignatureB64, $signatureB64)) {
            throw new Exception("Chữ ký Token đã bị can thiệp hoặc thay đổi!");
        }

        $payloadJson = base64_decode(str_replace(['-', '_'], ['+', '/'], $payloadB64));
        return json_decode($payloadJson, true) ?? [];
    }
}
