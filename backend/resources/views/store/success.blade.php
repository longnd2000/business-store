@extends('layouts.store')

@section('title', 'LX Store - Đặt Hàng Thành Công')

@section('content')
<div class="mx-auto text-center py-5 px-4" style="max-width: 500px;">
    <div class="bg-white rounded-4 p-5 border shadow-lg">
        <div class="bg-success-subtle text-success rounded-circle d-flex align-items-center justify-content-center mx-auto mb-4" style="width: 70px; height: 70px; background-color: #d1fae5 !important;">
            <i class="bi bi-check-circle-fill fs-1" style="color: #10b981 !important;"></i>
        </div>
        <div class="mb-4">
            <h3 class="fw-bold text-slate-800 my-0">Đặt hàng thành công!</h3>
            <p class="text-muted small mt-1 mb-0">Cảm ơn bạn đã mua sắm tại LX Store.</p>
        </div>

        <div class="bg-light rounded-3 p-4 text-start border mb-4">
            <div class="d-flex justify-content-between small text-muted mb-2">
                <span>Mã đơn hàng:</span>
                <span class="font-bold text-dark">#ORD-{{ $order->id }}</span>
            </div>
            <div class="d-flex justify-content-between small text-muted mb-2">
                <span>Người nhận:</span>
                <span class="font-bold text-dark">{{ $order->customer_name }}</span>
            </div>
            <div class="d-flex justify-content-between small text-muted mb-2">
                <span>Số điện thoại:</span>
                <span class="font-bold text-dark">{{ $order->customer_phone }}</span>
            </div>
            <div class="d-flex justify-content-between small text-muted mb-2">
                <span>Hình thức:</span>
                <span class="font-bold text-dark">{{ $order->payment_method }}</span>
            </div>
            <hr class="my-2">
            <div class="d-flex justify-content-between text-sm font-bold text-dark pt-1">
                <span>Tổng cộng:</span>
                <span style="color: #7c3aed;">{{ number_format($order->total_amount, 0, ',', '.') }} ₫</span>
            </div>
        </div>

        @if($order->payment_method === 'Bank Transfer')
            <div class="alert alert-primary rounded-3 text-start text-xs mb-4" style="border-left: 4px solid #0d6efd !important;">
                <p class="fw-bold mb-2 text-dark">Thông tin chuyển khoản ngân hàng:</p>
                <div class="ps-1 text-secondary" style="font-size: 0.85rem; line-height: 1.5;">
                    <p class="m-0"><span class="fw-semibold">Ngân hàng:</span> Techcombank</p>
                    <p class="m-0"><span class="fw-semibold">Số tài khoản:</span> 1903 1234 5678 90</p>
                    <p class="m-0"><span class="fw-semibold">Chủ tài khoản:</span> NGUYEN VAN A</p>
                    <p class="m-0"><span class="fw-semibold">Nội dung CK:</span> <span class="fw-bold text-dark">ORD {{ $order->id }}</span></p>
                </div>
                <p class="text-muted small mt-2 mb-0">Hệ thống sẽ duyệt đơn hàng sau khi nhận được thanh toán.</p>
            </div>
        @endif

        <a href="{{ route('products.index') }}" class="btn btn-primary btn-lg rounded-3 w-100 py-3 fs-6" style="background-color: #7c3aed; border-color: #7c3aed;">
            Tiếp tục mua sắm
        </a>
    </div>
</div>
@endsection
