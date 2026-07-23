@extends('layouts.store')

@section('title')
    {{ $product->name }} - LX Store
@endsection

@section('content')
<div class="py-4 space-y-5 text-start">
    <!-- Back button -->
    <div class="mb-4">
        <a href="{{ route('products.index') }}" class="btn btn-link text-decoration-none text-secondary hover-text-violet p-0 fw-semibold d-inline-flex align-items-center gap-1">
            <i class="bi bi-arrow-left"></i> Quay lại danh sách
        </a>
    </div>

    <!-- Main product info -->
    <div class="row g-5 align-items-start mb-5">
        <!-- Left: Image -->
        <div class="col-md-6">
            <div class="card border-0 rounded-4 overflow-hidden shadow-sm position-relative aspect-ratio-1x1 bg-white" style="height: 500px;">
                <img src="{{ $product->image_url }}" alt="{{ $product->name }}" class="w-100 h-100 object-fit-cover" style="object-fit: cover; height: 100%;">
                @if($product->stock <= 0)
                    <div class="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-75">
                        <span class="badge bg-danger text-uppercase px-4 py-2.5 rounded-pill fs-6">
                            Hết hàng
                        </span>
                    </div>
                @endif
            </div>
        </div>

        <!-- Right: Info -->
        <div class="col-md-6 space-y-4">
            <div class="mb-3 text-start">
                <span class="badge text-uppercase tracking-wider font-semibold rounded-3 px-3 py-1.5" style="color: #7c3aed; background-color: #f5f3ff;">
                    {{ $product->category->name ?? 'Sản phẩm' }}
                </span>
                <h1 class="display-6 fw-bold text-dark mt-2 mb-0">
                    {{ $product->name }}
                </h1>
            </div>

            <div class="h3 fw-black text-slate-900 mb-4" style="font-weight: 800;">
                {{ number_format($product->price, 0, ',', '.') }} ₫
            </div>

            <div class="border-top border-bottom py-4 my-4">
                <h5 class="text-uppercase fw-bold text-secondary mb-2" style="font-size: 0.85rem; letter-spacing: 0.05em;">Mô tả sản phẩm</h5>
                <p class="text-muted leading-relaxed whitespace-pre-line m-0" style="line-height: 1.6; font-size: 0.95rem;">
                    {{ $product->description }}
                </p>
            </div>

            <!-- Stock info & Add to Cart Form -->
            @if($product->stock > 0)
                <form action="{{ route('cart.add', $product->id) }}" method="POST" class="space-y-4">
                    @csrf
                    <div class="d-flex align-items-center gap-2 mb-3">
                        <span class="text-secondary small">Trạng thái:</span>
                        <span class="badge px-2.5 py-1.5 rounded-pill font-bold" style="color: #065f46 !important; background-color: #d1fae5 !important;">
                            Còn hàng ({{ $product->stock }} sản phẩm)
                        </span>
                    </div>

                    <div class="d-flex align-items-center gap-3 mb-4">
                        <span class="text-secondary small">Số lượng:</span>
                        <div class="input-group border border-secondary border-opacity-25 rounded-3 overflow-hidden bg-white" style="width: 130px;">
                            <button type="button" id="btn-minus" class="btn btn-light border-0 fw-bold">-</button>
                            <input type="number" id="qty-input" name="quantity" value="1" min="1" max="{{ $product->stock }}" class="form-control text-center bg-transparent border-0 text-sm font-semibold text-slate-800" style="pointer-events: none; outline: none; box-shadow: none;" readonly />
                            <button type="button" id="btn-plus" class="btn btn-light border-0 fw-bold">+</button>
                        </div>
                    </div>

                    <!-- Add to Cart button -->
                    <button type="submit" class="btn btn-primary btn-lg rounded-3 w-100 w-md-auto px-5 py-3 fs-6 d-inline-flex align-items-center justify-content-center gap-2 shadow-sm" style="background-color: #7c3aed; border-color: #7c3aed;">
                        <i class="bi bi-bag-plus fs-5"></i> Thêm vào giỏ hàng
                    </button>
                </form>
            @else
                <div class="d-flex align-items-center gap-2">
                    <span class="text-secondary small">Trạng thái:</span>
                    <span class="badge px-2.5 py-1.5 rounded-pill font-bold" style="color: #991b1b !important; background-color: #fee2e2 !important;">
                        Tạm hết hàng
                    </span>
                </div>
            @endif
        </div>
    </div>

    <!-- Related Products -->
    @if(!$relatedProducts->isEmpty())
        <div class="border-top pt-5 mt-5">
            <h2 class="h3 fw-bold text-slate-800 mb-4 text-start">Sản Phẩm Tương Tự</h2>
            <div class="row g-4">
                @foreach($relatedProducts as $p)
                    <div class="col-12 col-sm-6 col-md-3">
                        <div class="card h-100 border-0 rounded-4 shadow-sm hover-shadow transition-all duration-300">
                            <div class="position-relative overflow-hidden bg-light rounded-top-4" style="height: 200px;">
                                <a href="{{ route('products.detail', $p->id) }}">
                                    <img src="{{ $p->image_url }}" alt="{{ $p->name }}" class="h-100 w-100 object-fit-cover" style="object-fit: cover;">
                                </a>
                                @if($p->stock <= 0)
                                    <div class="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-75">
                                        <span class="badge bg-danger text-uppercase px-2.5 py-1.5 rounded-pill">
                                            Hết hàng
                                        </span>
                                    </div>
                                @endif
                            </div>
                            <div class="card-body d-flex flex-column text-start p-4">
                                <div class="mb-2">
                                    <span class="badge text-uppercase tracking-wider font-semibold rounded-3 px-2 py-0.5" style="color: #7c3aed; background-color: #f5f3ff; font-size: 0.7rem;">
                                        {{ $p->category->name ?? 'Sản phẩm' }}
                                    </span>
                                </div>
                                <h6 class="card-title fw-bold text-dark mb-3 text-truncate">
                                    <a href="{{ route('products.detail', $p->id) }}" class="text-decoration-none text-dark hover-text-violet" style="color: #1e293b;">{{ $p->name }}</a>
                                </h6>
                                <div class="d-flex align-items-center justify-content-between mt-auto pt-2 border-top border-light">
                                    <span class="fw-bold text-slate-900">
                                        {{ number_format($p->price, 0, ',', '.') }} ₫
                                    </span>
                                    <form action="{{ route('cart.add', $p->id) }}" method="POST">
                                        @csrf
                                        <button type="submit" {{ $p->stock <= 0 ? 'disabled' : '' }} class="btn btn-primary d-flex align-items-center justify-content-center p-2 rounded-3 transition-colors {{ $p->stock <= 0 ? 'btn-light border text-muted cursor-not-allowed' : '' }}" style="{{ $p->stock <= 0 ? '' : 'background-color: #7c3aed; border-color: #7c3aed;' }}">
                                            <i class="bi bi-plus-lg"></i>
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                @endforeach
            </div>
        </div>
    @endif
</div>

<script>
    $(document).ready(function() {
        $('#btn-plus').click(function() {
            let input = $('#qty-input');
            let max = parseInt(input.attr('max'));
            let val = parseInt(input.val());
            if (val < max) {
                input.val(val + 1);
            }
        });
        
        $('#btn-minus').click(function() {
            let input = $('#qty-input');
            let val = parseInt(input.val());
            if (val > 1) {
                input.val(val - 1);
            }
        });
    });
</script>
@endsection
