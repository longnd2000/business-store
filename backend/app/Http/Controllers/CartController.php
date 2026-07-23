<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;

class CartController extends Controller
{
    public function index()
    {
        $cart = session()->get('cart', []);
        $cartTotal = 0;
        foreach ($cart as $item) {
            $cartTotal += $item['price'] * $item['quantity'];
        }
        return view('store.cart', compact('cart', 'cartTotal'));
    }

    public function add(Request $request, $id)
    {
        $product = Product::findOrFail($id);
        $quantity = intval($request->input('quantity', 1));

        if ($product->stock < $quantity) {
            return redirect()->back()->with('error', "Sản phẩm {$product->name} không đủ số lượng trong kho.");
        }

        $cart = session()->get('cart', []);

        if (isset($cart[$id])) {
            $newQty = $cart[$id]['quantity'] + $quantity;
            if ($newQty > $product->stock) {
                return redirect()->back()->with('error', "Không thể thêm số lượng vượt quá hàng tồn kho ({$product->stock} sản phẩm).");
            }
            $cart[$id]['quantity'] = $newQty;
        } else {
            $cart[$id] = [
                'id' => $product->id,
                'name' => $product->name,
                'price' => $product->price,
                'quantity' => $quantity,
                'image_url' => $product->image_url,
                'stock' => $product->stock,
                'category_name' => $product->category->name ?? 'Sản phẩm'
            ];
        }

        session()->put('cart', $cart);

        return redirect()->route('cart.index')->with('success', 'Đã thêm sản phẩm vào giỏ hàng!');
    }

    public function update(Request $request, $id)
    {
        $quantity = intval($request->input('quantity'));
        $product = Product::findOrFail($id);

        if ($quantity <= 0) {
            return $this->remove($id);
        }

        if ($product->stock < $quantity) {
            return redirect()->back()->with('error', "Không thể chọn quá hàng tồn kho ({$product->stock} sản phẩm).");
        }

        $cart = session()->get('cart', []);

        if (isset($cart[$id])) {
            $cart[$id]['quantity'] = $quantity;
            session()->put('cart', $cart);
        }

        return redirect()->back()->with('success', 'Đã cập nhật số lượng!');
    }

    public function remove($id)
    {
        $cart = session()->get('cart', []);

        if (isset($cart[$id])) {
            unset($cart[$id]);
            session()->put('cart', $cart);
        }

        return redirect()->back()->with('success', 'Đã xóa sản phẩm khỏi giỏ hàng.');
    }
}
