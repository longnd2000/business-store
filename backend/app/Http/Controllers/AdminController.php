<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Product;
use App\Models\Category;
use App\Models\User;
use App\Constants\OrderConstant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class AdminController extends Controller
{
    private function validateAdmin(Request $request)
    {
        // Try custom header first to bypass Apache/Windows PHP server header stripping bugs
        $token = $request->header('X-Admin-Token');
        
        if (!$token) {
            // Fallback to standard Authorization Bearer header
            $authHeader = $request->header('Authorization');
            if ($authHeader && str_starts_with($authHeader, 'Bearer ')) {
                $token = str_replace('Bearer ', '', $authHeader);
            }
        }

        if (!$token) {
            return false;
        }

        $decoded = base64_decode($token);
        
        if (!$decoded) {
            return false;
        }

        $parts = explode(':', $decoded);
        if (count($parts) < 2) {
            return false;
        }

        $username = $parts[0];
        $timestamp = intval($parts[1]);

        // Token valid for 24 hours (86400 seconds)
        if (time() - $timestamp > 86400) {
            return false;
        }

        // Search for user in database to validate
        $user = User::where('email', $username)->first();
        if (!$user) {
            return false;
        }

        return true;
    }

    public function login(Request $request)
    {
        $request->validate([
            'username' => 'required|string',
            'password' => 'required|string',
        ]);

        // Query database for admin user
        $user = User::where('email', $request->username)->first();

        if ($user && Hash::check($request->password, $user->password)) {
            $token = base64_encode($user->email . ':' . time());
            return response()->json([
                'status' => 'success',
                'token' => $token,
                'message' => 'Đăng nhập thành công!'
            ]);
        }

        return response()->json([
            'status' => 'error',
            'message' => 'Tài khoản hoặc mật khẩu không chính xác.'
        ], 401);
    }

    public function orders(Request $request)
    {
        if (!$this->validateAdmin($request)) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $query = Order::with('items.product')->latest();

        if ($request->has('search') && $request->search !== '') {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('customer_name', 'LIKE', "%{$search}%")
                  ->orWhere('customer_phone', 'LIKE', "%{$search}%")
                  ->orWhere('id', $search);
            });
        }

        $orders = $query->get();
        return response()->json($orders);
    }

    public function updateStatus(Request $request, $id)
    {
        if (!$this->validateAdmin($request)) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $request->validate([
            'status' => 'required|string|in:' . OrderConstant::STATUS_PENDING . ',' . OrderConstant::STATUS_PROCESSING . ',' . OrderConstant::STATUS_COMPLETED . ',' . OrderConstant::STATUS_CANCELLED
        ]);

        $order = Order::find($id);

        if (!$order) {
            return response()->json(['message' => 'Order not found'], 404);
        }

        $oldStatus = $order->status;
        $order->status = $request->status;
        $order->save();

        // If status changes to Cancelled, return stock back to products
        if ($request->status === OrderConstant::STATUS_CANCELLED && $oldStatus !== OrderConstant::STATUS_CANCELLED) {
            foreach ($order->items as $item) {
                $product = Product::find($item->product_id);
                if ($product) {
                    $product->increment('stock', $item->quantity);
                }
            }
        }

        // If status reverts from Cancelled back to something else, deduct stock again
        if ($oldStatus === OrderConstant::STATUS_CANCELLED && $request->status !== OrderConstant::STATUS_CANCELLED) {
            foreach ($order->items as $item) {
                $product = Product::find($item->product_id);
                if ($product) {
                    $product->decrement('stock', $item->quantity);
                }
            }
        }

        return response()->json([
            'message' => 'Cập nhật trạng thái đơn hàng thành công!',
            'order' => $order->load('items.product')
        ]);
    }

    public function stats(Request $request)
    {
        if (!$this->validateAdmin($request)) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $totalRevenue = Order::where('status', '!=', OrderConstant::STATUS_CANCELLED)->sum('total_amount');
        $totalOrders = Order::count();
        $totalProducts = Product::count();
        $pendingOrders = Order::where('status', OrderConstant::STATUS_PENDING)->count();

        // Recent sales chart data (last 7 days)
        $salesData = Order::where('status', '!=', OrderConstant::STATUS_CANCELLED)
            ->selectRaw('DATE(created_at) as date, SUM(total_amount) as total')
            ->groupBy('date')
            ->orderBy('date', 'asc')
            ->take(7)
            ->get();

        return response()->json([
            'total_revenue' => floatval($totalRevenue),
            'total_orders' => $totalOrders,
            'total_products' => $totalProducts,
            'pending_orders' => $pendingOrders,
            'sales_data' => $salesData
        ]);
    }

    // ==========================================
    // ADMIN CATEGORIES MANAGEMENT
    // ==========================================

    public function categories(Request $request)
    {
        if (!$this->validateAdmin($request)) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $query = Category::withCount('products');

        if ($request->has('search') && $request->search !== '') {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'LIKE', "%{$search}%")
                  ->orWhere('slug', 'LIKE', "%{$search}%");
            });
        }

        $categories = $query->get();
        return response()->json($categories);
    }

    public function storeCategory(Request $request)
    {
        if (!$this->validateAdmin($request)) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $request->validate([
            'name' => 'required|string|max:255|unique:categories,name',
            'image_url' => 'nullable|string|url'
        ]);

        $category = Category::create([
            'name' => $request->name,
            'slug' => Str::slug($request->name),
            'image_url' => $request->image_url ?? 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&auto=format&fit=crop'
        ]);

        return response()->json([
            'message' => 'Tạo danh mục mới thành công!',
            'category' => $category
        ], 201);
    }

    public function deleteCategory(Request $request, $id)
    {
        if (!$this->validateAdmin($request)) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $category = Category::find($id);
        if (!$category) {
            return response()->json(['message' => 'Danh mục không tồn tại'], 404);
        }

        $category->delete();

        return response()->json([
            'message' => 'Xóa danh mục thành công (Tất cả sản phẩm thuộc danh mục này đã bị xóa)!'
        ]);
    }

    public function updateCategory(Request $request, $id)
    {
        if (!$this->validateAdmin($request)) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $category = Category::find($id);
        if (!$category) {
            return response()->json(['message' => 'Danh mục không tồn tại'], 404);
        }

        $request->validate([
            'name' => 'required|string|max:255|unique:categories,name,' . $id,
            'image_url' => 'nullable|string|url'
        ]);

        $category->update([
            'name' => $request->name,
            'slug' => Str::slug($request->name),
            'image_url' => $request->image_url ?? $category->image_url
        ]);

        return response()->json([
            'message' => 'Cập nhật danh mục thành công!',
            'category' => $category
        ]);
    }

    // ==========================================
    // ADMIN PRODUCTS MANAGEMENT
    // ==========================================

    public function products(Request $request)
    {
        if (!$this->validateAdmin($request)) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $query = Product::with('category')->latest();

        if ($request->has('search') && $request->search !== '') {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'LIKE', "%{$search}%")
                  ->orWhere('description', 'LIKE', "%{$search}%")
                  ->orWhereHas('category', function ($catQ) use ($search) {
                      $catQ->where('name', 'LIKE', "%{$search}%");
                  });
            });
        }

        $products = $query->get();
        return response()->json($products);
    }

    public function storeProduct(Request $request)
    {
        if (!$this->validateAdmin($request)) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $request->validate([
            'name' => 'required|string|max:255|unique:products,name',
            'category_id' => 'required|exists:categories,id',
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'description' => 'nullable|string',
            'image_url' => 'nullable|string|url'
        ]);

        $product = Product::create([
            'name' => $request->name,
            'slug' => Str::slug($request->name),
            'category_id' => $request->category_id,
            'price' => $request->price,
            'stock' => $request->stock,
            'description' => $request->description,
            'image_url' => $request->image_url ?? 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop'
        ]);

        return response()->json([
            'message' => 'Têm sản phẩm mới thành công!',
            'product' => $product->load('category')
        ], 201);
    }

    public function updateProduct(Request $request, $id)
    {
        if (!$this->validateAdmin($request)) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $product = Product::find($id);
        if (!$product) {
            return response()->json(['message' => 'Sản phẩm không tồn tại'], 404);
        }

        $request->validate([
            'name' => 'required|string|max:255|unique:products,name,' . $id,
            'category_id' => 'required|exists:categories,id',
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'description' => 'nullable|string',
            'image_url' => 'nullable|string|url'
        ]);

        $product->update([
            'name' => $request->name,
            'slug' => Str::slug($request->name),
            'category_id' => $request->category_id,
            'price' => $request->price,
            'stock' => $request->stock,
            'description' => $request->description,
            'image_url' => $request->image_url ?? $product->image_url
        ]);

        return response()->json([
            'message' => 'Cập nhật sản phẩm thành công!',
            'product' => $product->load('category')
        ]);
    }

    public function deleteProduct(Request $request, $id)
    {
        if (!$this->validateAdmin($request)) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $product = Product::find($id);
        if (!$product) {
            return response()->json(['message' => 'Sản phẩm không tồn tại'], 404);
        }

        $product->delete();

        return response()->json([
            'message' => 'Xóa sản phẩm thành công!'
        ]);
    }

    // ==========================================
    // ADMIN BUYERS MANAGEMENT
    // ==========================================

    public function buyers(Request $request)
    {
        if (!$this->validateAdmin($request)) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $query = User::where('email', '!=', 'admin')->latest();

        if ($request->has('search') && $request->search !== '') {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'LIKE', "%{$search}%")
                  ->orWhere('email', 'LIKE', "%{$search}%");
            })->where('email', '!=', 'admin');
        }

        $buyers = $query->get()->map(function ($user) {
            // Calculate stats
            $orders = Order::where('user_id', $user->id)->get();
            return [
                'id' => $user->id,
                'name' => $user->name,
                'phone' => $user->email, // email acts as the phone number
                'created_at' => $user->created_at,
                'orders_count' => $orders->count(),
                'total_spent' => floatval($orders->where('status', '!=', OrderConstant::STATUS_CANCELLED)->sum('total_amount'))
            ];
        });

        return response()->json($buyers);
    }
}
