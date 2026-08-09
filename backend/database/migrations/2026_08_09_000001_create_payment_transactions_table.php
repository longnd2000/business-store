<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('payment_transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained('orders')->onDelete('cascade');
            $table->string('gateway'); // COD, Bank Transfer, VNPay, Momo, etc.
            $table->string('transaction_reference')->nullable(); // Mã tham chiếu (mã giao dịch ngân hàng, vnp_TxnRef, v.v.)
            $table->decimal('amount', 12, 2);
            $table->string('status'); // AWAITING_DELIVERY, AWAITING_TRANSFER_CONFIRMATION, SUCCESS, FAILED
            $table->json('payload')->nullable(); // Lưu trữ dữ liệu thô (raw callback payload) nếu cần thiết
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payment_transactions');
    }
};
