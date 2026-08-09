<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'customer_name',
        'customer_email',
        'customer_phone',
        'shipping_address',
        'payment_method',
        'total_amount',
        'status'
    ];

    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    /**
     * Một đơn hàng có thể có nhiều lịch sử giao dịch thanh toán (ví dụ: giao dịch nháp, giao dịch thành công).
     */
    public function transactions(): HasMany
    {
        return $this->hasMany(PaymentTransaction::class);
    }
}
