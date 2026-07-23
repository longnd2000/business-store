@extends('layouts.store')

@section('title', 'LX Store - Trang Chủ')

@section('content')
<div class="space-y-5 pb-5">
    <!-- Hero Banner -->
    <div class="p-5 mb-5 text-white rounded-5 shadow-lg position-relative overflow-hidden" style="background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%);">
        <div class="position-absolute top-0 end-0 p-5 opacity-10">
            <i class="bi bi-rocket-takeoff" style="font-size: 15rem;"></i>
        </div>
        <div class="position-relative py-4 col-lg-8 text-start">
            <span class="badge rounded-pill bg-primary border border-primary border-opacity-25 mb-3 px-3 py-2 text-xs" style="background-color: rgba(99, 102, 241, 0.2) !important; color: #a5b4fc;">
                ✨ Chào mừng đến với LX Store
            </span>
            <h1 class="display-4 fw-black text-white mb-3" style="font-weight: 900;">
                Khám phá Không gian <span style="color: #a78bfa !important;">Công nghệ & Đời sống</span> Của Bạn
            </h1>
            <p class="lead mb-4" style="color: #cbd5e1 !important;">
                LX Store cung cấp các thiết bị điện tử tối tân, đồ dùng văn phòng, nội thất hiện đại và phụ kiện phong cách giúp nâng tầm cuộc sống của bạn.
            </p>
            <a href="{{ route('products.index') }}" class="btn btn-primary btn-lg rounded-3 shadow-lg px-4 py-2.5 fs-6" style="background-color: #7c3aed; border-color: #7c3aed;">
                Mua sắm ngay
            </a>
        </div>
    </div>

    <!-- Categories Section -->
    <section class="mb-5">
        <div class="text-center max-w-md mx-auto mb-4">
            <h2 class="fw-bold text-slate-800">Danh Mục Nổi Bật</h2>
            <p class="text-muted small mt-1">Duyệt nhanh qua các nhóm sản phẩm chất lượng cao của chúng tôi</p>
        </div>

        <div class="row g-4 justify-content-center">
            @foreach($categories as $category)
                <div class="col-6 col-md-3">
                    <a href="{{ route('products.index', ['category' => $category->slug]) }}" class="text-decoration-none group-hover-scale">
                        <div class="card border-0 rounded-4 overflow-hidden shadow-sm position-relative" style="height: 160px !important;">
                            <img src="{{ $category->image_url }}" alt="{{ $category->name }}" class="card-img h-100 w-100 object-fit-cover" style="object-fit: cover;">
                            <div class="card-img-overlay d-flex flex-column justify-content-end p-3 text-start" style="background: linear-gradient(to top, rgba(15, 23, 42, 0.9) 0%, rgba(15, 23, 42, 0.2) 70%, transparent 100%);">
                                <h5 class="card-title text-white fw-bold m-0 fs-6">
                                    {{ $category->name }}
                                </h5>
                                <span class="small" style="font-size: 0.75rem; color: #a5b4fc !important;">
                                    {{ $category->products_count }} sản phẩm
                                </span>
                            </div>
                        </div>
                    </a>
                </div>
            @endforeach
        </div>
    </section>

    <!-- Featured Products Section -->
    <section class="mb-5">
        <div class="d-flex align-items-center justify-content-between mb-4">
            <div class="text-start">
                <h2 class="fw-bold text-slate-800 m-0">Sản Phẩm Mới Nhất</h2>
                <p class="text-muted small m-0 mt-1">Lựa chọn hàng đầu dành riêng cho phong cách của bạn</p>
            </div>
            <a href="{{ route('products.index') }}" class="btn btn-link text-decoration-none fw-semibold text-end" style="color: #7c3aed;">
                Xem tất cả <i class="bi bi-arrow-right"></i>
            </a>
        </div>

        <div class="row g-4">
            @foreach($featuredProducts as $product)
                <div class="col-12 col-sm-6 col-md-3">
                    <div class="card h-100 border-0 rounded-4 shadow-sm hover-shadow transition-all duration-300">
                        <!-- Product Image -->
                        <div class="position-relative overflow-hidden bg-light rounded-top-4" style="height: 250px;">
                            <a href="{{ route('products.detail', $product->id) }}">
                                <img src="{{ $product->image_url }}" alt="{{ $product->name }}" class="h-100 w-100 object-fit-cover" style="object-fit: cover;">
                            </a>
                            @if($product->stock <= 0)
                                <div class="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-75">
                                    <span class="badge bg-danger text-uppercase px-3 py-2 rounded-pill fs-7">
                                        Hết hàng
                                    </span>
                                </div>
                            @elseif($product->stock <= 5)
                                <span class="position-absolute badge bg-warning text-dark text-[10px] font-bold uppercase" style="top: 15px; left: 15px;">
                                    Chỉ còn {{ $product->stock }}
                                </span>
                            @endif
                        </div>

                        <!-- Product Details -->
                        <div class="card-body d-flex flex-column text-start p-4">
                            <div class="mb-2">
                                <span class="badge text-uppercase tracking-wider font-semibold rounded-3 px-2.5 py-1" style="color: #7c3aed; background-color: #f5f3ff;">
                                    {{ $product->category->name ?? 'Sản phẩm' }}
                                </span>
                            </div>

                            <h5 class="card-title fw-bold text-dark mb-1 fs-6" title="{{ $product->name }}">
                                <a href="{{ route('products.detail', $product->id) }}" class="text-decoration-none text-dark hover-text-violet" style="color: #1e293b;">{{ $product->name }}</a>
                            </h5>

                            <p class="card-text text-muted small flex-grow-1 mb-3" style="display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; height: 36px; line-height: 18px;">
                                {{ $product->description }}
                            </p>

                            <div class="d-flex align-items-center justify-content-between mt-auto pt-2 border-top border-light">
                                <span class="fs-5 fw-bold text-slate-900">
                                    {{ number_format($product->price, 0, ',', '.') }} ₫
                                </span>

                                <form action="{{ route('cart.add', $product->id) }}" method="POST">
                                    @csrf
                                    <button type="submit" {{ $product->stock <= 0 ? 'disabled' : '' }} class="btn btn-primary d-flex align-items-center justify-content-center p-2 rounded-3 transition-colors {{ $product->stock <= 0 ? 'btn-light border text-muted cursor-not-allowed' : '' }}" style="{{ $product->stock <= 0 ? '' : 'background-color: #7c3aed; border-color: #7c3aed;' }}" title="Thêm vào giỏ">
                                        <i class="bi bi-plus-lg fs-5"></i>
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            @endforeach
        </div>
    </section>
</div>

<style>
    .hover-shadow:hover {
        transform: translateY(-5px);
        box-shadow: 0 1rem 3rem rgba(0,0,0,.1) !important;
    }
    .group-hover-scale img {
        transition: transform 0.5s ease;
    }
    .group-hover-scale:hover img {
        transform: scale(1.05);
    }
    .hover-text-violet:hover {
        color: #7c3aed !important;
    }
</style>
@endsection
