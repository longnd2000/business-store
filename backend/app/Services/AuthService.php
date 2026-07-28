<?php

namespace App\Services;

use App\Models\User;
use App\Services\Interfaces\IAuthService;
use Illuminate\Support\Facades\Hash;
use Exception;

class AuthService implements IAuthService
{
    private string $secretKey = 'BUSINESS_STORE_JWT_SECRET_KEY_2026';

    public function login(string $username, string $password): array
    {
        // 1. Tìm user trong DB
        $user = User::where('email', $username)->first();

        // 2. Kiểm tra mật khẩu mã hóa Hash
        if (!$user || !Hash::check($password, $user->password)) {
            throw new Exception("Tài khoản hoặc mật khẩu không chính xác.");
        }

        // 3. Tạo JWT Token (Header.Payload.Signature)
        $token = $this->createJwtToken($user);

        return [
            'access_token' => $token,
            'token_type'   => 'Bearer',
            'expires_in'   => 86400, // Token hết hạn sau 24 giờ (86400 giây)
            'user'         => [
                'id'    => $user->id,
                'name'  => $user->name,
                'email' => $user->email,
            ]
        ];
    }

    /**
     * Hàm sinh JWT Token chuẩn thuật toán HMAC-SHA256
     */
    private function createJwtToken(User $user): string
    {
        // Part 1: Header
        $header = json_encode(['alg' => 'HS256', 'typ' => 'JWT']);
        $base64UrlHeader = $this->base64UrlEncode($header);

        // Part 2: Payload (Thông tin đính kèm)
        $payload = json_encode([
            'sub'   => $user->getJWTIdentifier(),
            'claims'=> $user->getJWTCustomClaims(),
            'iat'   => time(),
            'exp'   => time() + 86400, // Hạn dùng 24 tiếng
        ]);
        $base64UrlPayload = $this->base64UrlEncode($payload);

        // Part 3: Signature (Chữ ký điện tử bảo mật)
        $signature = hash_hmac('sha256', $base64UrlHeader . "." . $base64UrlPayload, $this->secretKey, true);
        $base64UrlSignature = $this->base64UrlEncode($signature);

        // Chuỗi JWT Token hoàn chỉnh
        return $base64UrlHeader . "." . $base64UrlPayload . "." . $base64UrlSignature;
    }

    private function base64UrlEncode(string $data): string
    {
        return str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($data));
    }
}
