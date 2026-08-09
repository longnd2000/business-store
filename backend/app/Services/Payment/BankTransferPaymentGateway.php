<?php

namespace App\Services\Payment;

use App\Models\Order;
use App\Constants\OrderConstant;
use App\Services\Interfaces\IPaymentGateway;
use Illuminate\Support\Str;

class BankTransferPaymentGateway extends BasePaymentGateway implements IPaymentGateway
{
    /**
     * Xử lý thanh toán Chuyển khoản ngân hàng.
     *
     * @param Order $order
     * @return bool
     */
    public function process(Order $order): bool
    {
        // Giả lập tạo mã tham chiếu giao dịch chuyển khoản ngân hàng ngẫu nhiên (ví dụ từ Napas247, VietQR)
        $bankReference = 'BT-' . strtoupper(Str::random(10));

        // Ghi log giao dịch qua hàm chung của lớp cha BasePaymentGateway
        $this->logPayment($order, OrderConstant::PAYMENT_METHOD_BANK_TRANSFER, OrderConstant::LOG_AWAITING_TRANSFER_CONFIRMATION, $bankReference);

        // Cập nhật trạng thái đơn hàng trong DB
        $order->update([
            'status' => OrderConstant::STATUS_PENDING,
        ]);

        return true;
    }
}
