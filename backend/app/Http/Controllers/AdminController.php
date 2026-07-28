<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Product;
use App\Models\Category;
use App\Models\User;
use App\Services\Interfaces\IAuthService;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Exception;

class AdminController extends Controller
{
    /**
     * Inject IAuthService qua Constructor
     */
    public function __construct(
        protected IAuthService $authService
    ) {}

    /**
     * API 1: Đăng nhập -> Gọi AuthService tạo ra JWT Token
     */
    public function login(Request $request)
    {
        $request->validate([
            'username' => 'required|string',
            'password' => 'required|string',
        ]);

        try {
            // AuthService kiểm tra mật khẩu và tự sinh JWT Token
            $result = $this->authService->login($request->username, $request->password);

            return response()->json([
                'status'  => 'success',
                'message' => 'Đăng nhập JWT thành công!',
                'data'    => $result
            ]);

        } catch (Exception $e) {
            return response()->json([
                'status'  => 'error',
                'message' => $e->getMessage()
            ], 401);
        }
    }

    /**
     * API 2: Lấy thông tin Admin đang đăng nhập từ JWT Token
     */
    public function me(Request $request)
    {
        // $request->user() đã được JwtAuthMiddleware tự nạp vào!
        return response()->json([
            'status' => 'success',
            'user'   => $request->user()
        ]);
    }

    public function orders(Request $request)
    {
        $query = Order::with('items.product')->latest();

        if ($request->has('search') && $request->search !== '') {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('customer_name', 'LIKE', "%{$search}%")
                  ->orWhere('customer_phone', 'LIKE', "%{$search}%")
                  ->orWhere('id', $search);
            });
        }

        return response()->json($query->get());
    }

    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|string|in:Pending,Processing,Completed,Cancelled'
        ]);

        $order = Order::find($id);

        if (!$order) {
            return response()->json(['message' => 'Order not found'], 404);
        }

        $oldStatus = $order->status;
        $order->status = $request->status;
        $order->save();

        if ($request->status === 'Cancelled' && $oldStatus !== 'Cancelled') {
            foreach ($order->items as $item) {
                $product = Product::find($item->product_id);
                if ($product) {
                    $product->increment('stock', $item->quantity);
                }
            }
        }

        return response()->json([
            'message' => 'Cập nhật trạng thái thành công!',
            'order'   => $order->load('items.product')
        ]);
    }

    public function stats(Request $request)
    {
        $totalRevenue = Order::where('status', '!=', 'Cancelled')->sum('total_amount');
        $totalOrders = Order::count();
        $totalProducts = Product::count();

        return response()->json([
            'total_revenue'  => floatval($totalRevenue),
            'total_orders'   => $totalOrders,
            'total_products' => $totalProducts,
        ]);
    }

    // ==========================================
    // ADMIN CATEGORIES & PRODUCTS
    // ==========================================

    public function categories()
    {
        return response()->json(Category::withCount('products')->get());
    }

    public function products()
    {
        return response()->json(Product::with('category')->latest()->get());
    }

    public function buyers()
    {
        $buyers = User::where('email', '!=', 'admin')->latest()->get();
        return response()->json($buyers);
    }
}
