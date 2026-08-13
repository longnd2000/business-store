<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class OrderController extends Controller
{
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'customer_name' => 'required|string|max:255',
            'customer_email' => 'required|email|max:255',
            'customer_phone' => 'required|string|max:20',
            'shipping_address' => 'required|string',
            'payment_method' => 'required|string|in:COD,Bank Transfer',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            $order = DB::transaction(function () use ($request) {
                $totalAmount = 0;
                $itemsToCreate = [];

                foreach ($request->items as $itemData) {
                    $product = Product::lockForUpdate()->find($itemData['product_id']);

                    if ($product->stock < $itemData['quantity']) {
                        throw new \Exception("Sản phẩm {$product->name} không đủ số lượng trong kho.");
                    }

                    // Deduct stock
                    $product->decrement('stock', $itemData['quantity']);

                    $subtotal = $product->price * $itemData['quantity'];
                    $totalAmount += $subtotal;

                    $itemsToCreate[] = [
                        'product_id' => $product->id,
                        'quantity' => $itemData['quantity'],
                        'price' => $product->price
                    ];
                }

                $order = Order::create([
                    'customer_name' => $request->customer_name,
                    'customer_email' => $request->customer_email,
                    'customer_phone' => $request->customer_phone,
                    'shipping_address' => $request->shipping_address,
                    'payment_method' => $request->payment_method,
                    'total_amount' => $totalAmount,
                    'status' => 'Pending'
                ]);

                foreach ($itemsToCreate as $item) {
                    $order->items()->create($item);
                }

                return $order;
            });

            return response()->json([
                'message' => 'Đặt hàng thành công!',
                'order' => $order->load('items.product')
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage()
            ], 400);
        }
    }
}
