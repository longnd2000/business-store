<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PaymentTransaction extends Model
{
    /**
     * @var array
     */
    protected $fillable = [
        'order_id',
        'gateway',
        'transaction_reference',
        'amount',
        'status',
        'payload',
    ];

    /**
     * @var array
     */
    protected $casts = [
        'payload' => 'array',
    ];

    /**
     * Mỗi giao dịch sẽ thuộc về một Đơn hàng (Order).
     */
    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }
}
