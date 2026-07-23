@extends('layouts.store')

@section('title', 'LX Store - Thanh Toán')

@section('content')
<div class="py-4 space-y-4 text-start">
    <div class="mb-4 text-start">
        <h1 class="h2 fw-extrabold text-slate-900 m-0">Thanh Toán</h1>
        <p class="text-muted small mt-1 mb-0">Hoàn thành thông tin giao hàng của bạn</p>
    </div>

    <div class="row g-4 align-items-start">
        <!-- Left: Billing Form -->
        <div class="col-lg-8">
            <form action="{{ route('checkout.store') }}" method="POST" class="bg-white border shadow-sm rounded-4 p-4 p-md-5">
                @csrf
                <h4 class="fw-bold text-slate-800 border-bottom pb-3 mb-4 text-start">Thông tin giao hàng</h4>

                @if(session('error'))
                    <div class="alert alert-danger rounded-3 text-xs mb-4">
                        {{ session('error') }}
                    </div>
                @endif

                @if($errors->any())
                    <div class="alert alert-danger rounded-3 text-xs mb-4">
                        <p class="fw-bold mb-1">Vui lòng kiểm tra lại các trường sau:</p>
                        <ul class="mb-0 ps-3">
                            @foreach($errors->all() as $error)
                                <li>{{ $error }}</li>
                            @endforeach
                        </ul>
                    </div>
                @endif

                <div class="row g-3 mb-4">
                    <div class="col-md-6 text-start">
                        <label class="form-label text-xs fw-bold text-secondary uppercase">Họ và tên</label>
                        <input
                            type="text"
                            name="customer_name"
                            required
                            value="{{ old('customer_name') }}"
                            class="form-control py-2.5 rounded-3 text-sm"
                            placeholder="Nguyễn Văn A"
                        />
                    </div>
                    <div class="col-md-6 text-start">
                        <label class="form-label text-xs fw-bold text-secondary uppercase">Số điện thoại</label>
                        <input
                            type="tel"
                            name="customer_phone"
                            required
                            value="{{ old('customer_phone') }}"
                            class="form-control py-2.5 rounded-3 text-sm"
                            placeholder="0987654321"
                        />
                    </div>
                </div>



                <div class="mb-4 text-start">
                    <label class="form-label text-xs fw-bold text-secondary uppercase">Địa chỉ nhận hàng</label>
                    <textarea
                        name="shipping_address"
                        required
                        rows="3"
                        class="form-control py-2.5 rounded-3 text-sm"
                        placeholder="Số nhà, Tên đường, Phường/Xã, Quận/Huyện, Tỉnh/Thành phố..."
                    >{{ old('shipping_address') }}</textarea>
                </div>

                <!-- Payment Options -->
                <div class="mb-4 text-start">
                    <label class="form-label text-xs fw-bold text-secondary uppercase mb-3">Phương thức thanh toán</label>
                    <div class="row g-3">
                        <div class="col-md-6">
                            <div id="payment-cod" class="border border-primary bg-light bg-opacity-25 rounded-4 p-3 d-flex align-items-start gap-3 cursor-pointer">
                                <div class="form-check m-0">
                                    <input
                                        type="radio"
                                        name="payment_method"
                                        id="radio-cod"
                                        value="COD"
                                        checked
                                        class="form-check-input"
                                    />
                                    <label class="form-check-label ms-2 cursor-pointer" for="radio-cod">
                                        <p class="fw-bold text-dark mb-0">Thanh toán khi nhận hàng (COD)</p>
                                        <p class="text-muted small mb-0 mt-0.5" style="font-size: 0.75rem;">Trả tiền mặt khi nhận hàng</p>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div class="col-md-6">
                            <div id="payment-bank" class="border border-light-subtle bg-white rounded-4 p-3 d-flex align-items-start gap-3 cursor-pointer">
                                <div class="form-check m-0">
                                    <input
                                        type="radio"
                                        name="payment_method"
                                        id="radio-bank"
                                        value="Bank Transfer"
                                        class="form-check-input"
                                    />
                                    <label class="form-check-label ms-2 cursor-pointer" for="radio-bank">
                                        <p class="fw-bold text-dark mb-0">Chuyển khoản ngân hàng</p>
                                        <p class="text-muted small mb-0 mt-0.5" style="font-size: 0.75rem;">Nhận thông tin STK sau khi đặt hàng</p>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- VietQR Code Container -->
                <div id="vietqr-container" class="mt-4 p-4 border border-primary rounded-4 bg-light bg-opacity-25 text-center d-none" style="border-style: dashed !important; border-color: #7c3aed !important; background-color: #f5f3ff !important;">
                    <p class="fw-bold mb-2 text-dark" style="font-size: 0.95rem;">Quét mã VietQR chuyển khoản thanh toán nhanh:</p>
                    <img src="https://img.vietqr.io/image/TCB-19031234567890-compact.png?amount={{ $cartTotal }}&addInfo=Thanh%20toan%20don%20hang%2520LX%2520Store&accountName=NGUYEN%20VAN%20A" alt="VietQR Code" class="img-fluid rounded shadow-sm mb-3" style="max-width: 250px;">
                    <div class="text-secondary" style="font-size: 0.85rem; line-height: 1.5;">
                        <p class="m-0"><span class="fw-semibold">Ngân hàng:</span> Techcombank</p>
                        <p class="m-0"><span class="fw-semibold">Số tài khoản:</span> 1903 1234 5678 90</p>
                        <p class="m-0"><span class="fw-semibold">Chủ tài khoản:</span> NGUYEN VAN A</p>
                    </div>
                </div>

                <button type="submit" class="btn btn-primary btn-lg rounded-3 w-100 py-3.5 fs-6 fw-bold shadow-sm" style="background-color: #7c3aed; border-color: #7c3aed;">
                    Xác nhận đặt hàng
                </button>
            </form>
        </div>

        <!-- Right: Cart Summary Panel -->
        <div class="col-lg-4">
            <div class="card border-0 rounded-4 p-4 shadow-sm bg-white text-start">
                <h5 class="fw-bold text-dark border-bottom pb-3 mb-4">Đơn hàng của bạn</h5>

                <div class="mb-4 overflow-auto max-h-60 pr-1">
                    @foreach($cart as $id => $item)
                        <div class="d-flex justify-content-between align-items-center py-2 border-bottom border-light">
                            <div class="min-w-0 pr-3">
                                <p class="fw-semibold text-dark mb-0 text-truncate" style="font-size: 0.85rem;">{{ $item['name'] }}</p>
                                <p class="text-muted small mb-0 mt-0.5">Số lượng: {{ $item['quantity'] }}</p>
                            </div>
                            <span class="fw-bold text-dark flex-shrink-0" style="font-size: 0.85rem;">{{ number_format($item['price'] * $item['quantity'], 0, ',', '.') }} ₫</span>
                        </div>
                    @endforeach
                </div>

                <div class="mb-2">
                    <div class="d-flex justify-content-between text-xs text-secondary mb-2">
                        <span>Tạm tính:</span>
                        <span class="text-dark fw-bold">{{ number_format($cartTotal, 0, ',', '.') }} ₫</span>
                    </div>
                    <div class="d-flex justify-content-between text-xs text-secondary mb-2">
                        <span>Phí vận chuyển:</span>
                        <span class="text-success fw-bold">Miễn phí</span>
                    </div>
                    <hr class="my-3">
                    <div class="d-flex justify-content-between fw-bold text-dark fs-5">
                        <span>Tổng cộng:</span>
                        <span style="color: #7c3aed;">{{ number_format($cartTotal, 0, ',', '.') }} ₫</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<script>
    $(document).ready(function() {
        // Function to toggle border classes
        function updatePaymentUI(method) {
            if (method === 'COD') {
                $('#payment-cod').addClass('border-primary bg-light bg-opacity-25').removeClass('border-light-subtle bg-white');
                $('#payment-bank').addClass('border-light-subtle bg-white').removeClass('border-primary bg-light bg-opacity-25');
                $('#vietqr-container').addClass('d-none');
            } else {
                $('#payment-bank').addClass('border-primary bg-light bg-opacity-25').removeClass('border-light-subtle bg-white');
                $('#payment-cod').addClass('border-light-subtle bg-white').removeClass('border-primary bg-light bg-opacity-25');
                $('#vietqr-container').removeClass('d-none');
            }
        }

        // Click event for the container divs
        $('#payment-cod').click(function() {
            $('#radio-cod').prop('checked', true);
            updatePaymentUI('COD');
        });

        $('#payment-bank').click(function() {
            $('#radio-bank').prop('checked', true);
            updatePaymentUI('Bank Transfer');
        });

        // Trigger change on radio buttons directly
        $('input[name="payment_method"]').change(function() {
            updatePaymentUI($(this).val());
        });
    });
</script>
@endsection
