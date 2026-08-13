<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class WebOrderController extends Controller
{
    public function checkout()
    {
        $cart = session()->get('cart', []);
        if (empty($cart)) {
            return redirect()->route('cart.index')->with('error', 'Giỏ hàng của bạn đang trống.');
        }
        $cartTotal = 0;
        foreach ($cart as $item) {
            $cartTotal += $item['price'] * $item['quantity'];
        }
        return view('store.checkout', compact('cart', 'cartTotal'));
    }

    public function store(Request $request)
    {
        $cart = session()->get('cart', []);
        if (empty($cart)) {
            return redirect()->route('cart.index')->with('error', 'Giỏ hàng của bạn đang trống.');
        }

        $request->validate([
            'customer_name' => 'required|string|max:255',
            'customer_phone' => ['required', 'regex:/^(03|05|07|08|09)\d{8}$/'],
            'shipping_address' => 'required|string',
            'payment_method' => 'required|string|in:COD,Bank Transfer',
        ], [
            'customer_phone.regex' => 'Số điện thoại không hợp lệ. Vui lòng nhập số điện thoại Việt Nam (10 chữ số, bắt đầu bằng 03, 05, 07, 08 hoặc 09).'
        ]);

        try {
            $order = DB::transaction(function () use ($request, $cart) {
                $totalAmount = 0;
                $itemsToCreate = [];

                foreach ($cart as $id => $item) {
                    $product = Product::lockForUpdate()->find($id);

                    if (!$product || $product->stock < $item['quantity']) {
                        throw new \Exception("Sản phẩm " . ($product->name ?? 'không xác định') . " không đủ số lượng trong kho.");
                    }

                    // Deduct stock
                    $product->decrement('stock', $item['quantity']);

                    $subtotal = $product->price * $item['quantity'];
                    $totalAmount += $subtotal;

                    $itemsToCreate[] = [
                        'product_id' => $product->id,
                        'quantity' => $item['quantity'],
                        'price' => $product->price
                    ];
                }

                // Check or create user based on phone number
                $user = \App\Models\User::where('email', $request->customer_phone)->first();
                if (!$user) {
                    $user = \App\Models\User::create([
                        'name' => $request->customer_name,
                        'email' => $request->customer_phone,
                        'password' => \Illuminate\Support\Facades\Hash::make('a12345'),
                    ]);
                }

                $order = Order::create([
                    'user_id' => $user->id,
                    'customer_name' => $request->customer_name,
                    'customer_email' => null,
                    'customer_phone' => $request->customer_phone,
                    'shipping_address' => $request->shipping_address,
                    'payment_method' => $request->payment_method,
                    'total_amount' => $totalAmount,
                    'status' => 'Pending'
                ]);

                foreach ($itemsToCreate as $orderItem) {
                    $order->items()->create($orderItem);
                }

                return $order;
            });

            // Clear session cart
            session()->forget('cart');

            return redirect()->route('checkout.success', $order->id);

        } catch (\Exception $e) {
            return redirect()->back()->withInput()->with('error', $e->getMessage());
        }
    }

    public function success($id)
    {
        $order = Order::with('items.product')->findOrFail($id);
        return view('store.success', compact('order'));
    }
}
