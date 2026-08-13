<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\Constants\OrderConstant;

class StoreWebOrderRequest extends FormRequest
{
    /**
     * Xác định xem người dùng có quyền thực hiện request này hay không.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Khai báo các quy tắc validate cho web checkout.
     *
     * @return array
     */
    public function rules(): array
    {
        return [
            'customer_name' => 'required|string|max:255',
            'customer_phone' => ['required', 'regex:/^(03|05|07|08|09)\d{8}$/'],
            'shipping_address' => 'required|string',
            'payment_method' => 'required|string|in:' . OrderConstant::PAYMENT_METHOD_COD . ',' . OrderConstant::PAYMENT_METHOD_BANK_TRANSFER,
        ];
    }

    /**
     * Tự định nghĩa tin nhắn thông báo lỗi validate tiếng Việt.
     *
     * @return array
     */
    public function messages(): array
    {
        return [
            'customer_phone.regex' => 'Số điện thoại không hợp lệ. Vui lòng nhập số điện thoại Việt Nam (10 chữ số, bắt đầu bằng 03, 05, 07, 08 hoặc 09).'
        ];
    }
}
