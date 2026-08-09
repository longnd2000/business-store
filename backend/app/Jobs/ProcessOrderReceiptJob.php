<?php

namespace App\Jobs;

use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class ProcessOrderReceiptJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * @var Order
     */
    public $order;

    /**
     * Khởi tạo Job với thông tin Đơn hàng.
     */
    public function __construct(Order $order)
    {
        $this->order = $order;
    }

    /**
     * Thực hiện xử lý tác vụ ngầm bất đồng bộ.
     */
    public function handle(): void
    {
        Log::info("[ProcessOrderReceiptJob] BẮT ĐẦU xử lý hóa đơn bất đồng bộ cho Đơn hàng #{$this->order->id}. Khách hàng: {$this->order->customer_name}");

        // Giả lập một tác vụ tốn thời gian chạy nền (ví dụ: tạo PDF hóa đơn, gọi dịch vụ hóa đơn điện tử, gửi email)
        // Việc sleep 3 giây này sẽ chạy ngầm bởi Queue Worker, không làm chậm phản hồi của Web Browser/API
        sleep(3);

        Log::info("[ProcessOrderReceiptJob] HOÀN THÀNH xử lý hóa đơn cho Đơn hàng #{$this->order->id}. Giao dịch trị giá: " . number_format($this->order->total_amount) . " VNĐ. Đã gửi email thành công!");
    }
}
