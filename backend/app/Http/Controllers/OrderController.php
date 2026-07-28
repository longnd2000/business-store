<?php

namespace App\Http\Controllers;

use App\Constants\PaymentConstant;
use App\Services\Interfaces\IOrderService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Exception;

class OrderController extends Controller
{
    /**
     * Dependency Injection: Inject IOrderService qua Constructor
     */
    public function __construct(
        protected IOrderService $orderService
    ) {}

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'customer_name' => 'required|string|max:255',
            'customer_email' => 'required|email|max:255',
            'customer_phone' => 'required|string|max:20',
            'shipping_address' => 'required|string',
            'payment_method' => 'required|string|in:' . implode(',', [
                PaymentConstant::METHOD_COD,
                PaymentConstant::METHOD_BANK_TRANSFER,
                PaymentConstant::METHOD_VNPAY
            ]),
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            // Controller chỉ việc gọi OrderService xử lý toàn bộ logic nghiệp vụ
            $result = $this->orderService->placeOrder($request->all());

            return response()->json([
                'message' => 'Đặt hàng thành công!',
                'order' => $result['order'],
                'payment' => $result['payment']
            ], 201);

        } catch (Exception $e) {
            return response()->json([
                'message' => $e->getMessage()
            ], 400);
        }
    }
}
