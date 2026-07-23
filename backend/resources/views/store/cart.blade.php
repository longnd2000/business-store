@extends('layouts.store')

@section('title', 'LX Store - Giỏ Hàng Của Bạn')

@section('content')
<div class="py-4 space-y-4 text-start">
    <div class="mb-4 text-start">
        <h1 class="h2 fw-extrabold text-slate-900 m-0">Giỏ Hàng Của Bạn</h1>
        <p class="text-muted small mt-1 mb-0">Kiểm tra lại danh sách các sản phẩm đã chọn</p>
    </div>

    @if(empty($cart))
        <div class="mx-auto text-center py-5 px-4" style="max-width: 450px;">
            <div class="bg-white rounded-4 p-5 border shadow-sm">
                <div class="bg-light text-primary rounded-circle d-flex align-items-center justify-content-center mx-auto mb-4" style="width: 70px; height: 70px;">
                    <i class="bi bi-cart-x fs-1 text-secondary" style="color: #7c3aed !important;"></i>
                </div>
                <div class="mb-4">
                    <h4 class="fw-bold text-slate-800 m-0">Giỏ hàng của bạn đang trống</h4>
                    <p class="text-muted small mt-1 mb-0">Hãy quay lại cửa hàng và chọn các sản phẩm ưng ý nhất nhé!</p>
                </div>
                <a href="{{ route('products.index') }}" class="btn btn-primary rounded-3 shadow-lg px-4 py-2.5 text-sm" style="background-color: #7c3aed; border-color: #7c3aed;">
                    Khám phá sản phẩm
                </a>
            </div>
        </div>
    @else
        <div class="row g-4 align-items-start">
            <!-- Left: Cart Items List -->
            <div class="col-lg-8">
                @foreach($cart as $id => $item)
                    <div class="card border-0 rounded-4 shadow-sm mb-3 overflow-hidden">
                        <div class="row g-0 align-items-center">
                            <!-- Product Image -->
                            <div class="col-3 col-md-2 bg-light">
                                <a href="{{ route('products.detail', $id) }}">
                                    <img src="{{ $item['image_url'] }}" alt="{{ $item['name'] }}" class="img-fluid w-100 object-fit-cover" style="object-fit: cover; height: 90px; width: 100%;">
                                </a>
                            </div>

                            <!-- Product Info -->
                            <div class="col-5 col-md-6 p-3 text-start">
                                <h6 class="fw-bold text-dark mb-1 text-truncate">
                                    <a href="{{ route('products.detail', $id) }}" class="text-decoration-none text-dark hover-text-violet">{{ $item['name'] }}</a>
                                </h6>
                                <p class="text-muted small m-0">
                                    Đơn giá: {{ number_format($item['price'], 0, ',', '.') }} ₫
                                </p>
                                <p class="small fw-bold mt-1 mb-0" style="color: #7c3aed;">
                                    Tổng: {{ number_format($item['price'] * $item['quantity'], 0, ',', '.') }} ₫
                                </p>
                            </div>

                            <!-- Quantity Controls & Remove Form -->
                            <div class="col-4 col-md-4 p-3 d-flex align-items-center justify-content-end gap-3">
                                <!-- Update quantity form -->
                                <form action="{{ route('cart.update', $id) }}" method="POST" class="d-flex align-items-center border rounded-3 overflow-hidden bg-light" style="width: 100px;">
                                    @csrf
                                    <button type="submit" name="quantity" value="{{ $item['quantity'] - 1 }}" class="btn btn-sm btn-light border-0 fw-bold">-</button>
                                    <span class="small font-semibold text-slate-800 flex-grow-1 text-center">
                                        {{ $item['quantity'] }}
                                    </span>
                                    <button type="submit" name="quantity" value="{{ $item['quantity'] + 1 }}" class="btn btn-sm btn-light border-0 fw-bold">+</button>
                                </form>

                                <!-- Remove item form -->
                                <form action="{{ route('cart.remove', $id) }}" method="POST" class="m-0">
                                    @csrf
                                    <button type="submit" class="btn btn-link text-muted hover-text-danger p-1 border-0" title="Xóa sản phẩm" style="box-shadow: none;">
                                        <i class="bi bi-trash fs-5"></i>
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                @endforeach
            </div>

            <!-- Right: Summary panel -->
            <div class="col-lg-4">
                <div class="card border-0 rounded-4 p-4 shadow-sm bg-white text-start">
                    <h5 class="fw-bold text-dark border-bottom pb-3 mb-4">Tổng đơn hàng</h5>
                    
                    <div class="mb-4">
                        <div class="d-flex justify-content-between text-sm text-secondary mb-2">
                            <span>Tạm tính ({{ array_sum(array_column($cart, 'quantity')) }} món)</span>
                            <span class="text-dark fw-semibold">{{ number_format($cartTotal, 0, ',', '.') }} ₫</span>
                        </div>
                        <div class="d-flex justify-content-between text-sm text-secondary mb-2">
                            <span>Phí vận chuyển</span>
                            <span class="text-success font-medium fw-bold">Miễn phí</span>
                        </div>
                        <hr class="my-3">
                        <div class="d-flex justify-content-between fw-bold text-dark fs-5">
                            <span>Tổng thanh toán</span>
                            <span style="color: #7c3aed;">{{ number_format($cartTotal, 0, ',', '.') }} ₫</span>
                        </div>
                    </div>

                    <a href="{{ route('checkout.index') }}" class="btn btn-primary btn-lg rounded-3 w-100 py-3 fs-6 d-flex align-items-center justify-content-center gap-2 shadow-sm" style="background-color: #7c3aed; border-color: #7c3aed;">
                        Tiến hành thanh toán <i class="bi bi-arrow-right"></i>
                    </a>
                </div>
            </div>
        </div>
    @endif
</div>

<style>
    .hover-text-violet:hover {
        color: #7c3aed !important;
    }
</style>
@endsection
