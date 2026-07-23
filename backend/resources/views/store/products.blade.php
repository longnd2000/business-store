@extends('layouts.store')

@section('title', 'LX Store - Sản Phẩm')

@section('content')
<div class="py-4 space-y-4 text-start">
    <!-- Title and Search -->
    <div class="row g-4 align-items-center justify-content-between border-bottom pb-4 mb-4">
        <div class="col-md-6 text-start">
            <h1 class="h2 fw-extrabold text-slate-900 m-0">Cửa hàng Sản phẩm</h1>
            <p class="text-muted small mt-1 mb-0 font-medium">Duyệt qua bộ sưu tập đầy đủ của chúng tôi</p>
        </div>

        <!-- Search Box Form -->
        <div class="col-md-5">
            <form action="{{ route('products.index') }}" method="GET">
                @if(request('category'))
                    <input type="hidden" name="category" value="{{ request('category') }}">
                @endif
                <div class="input-group rounded-3 shadow-sm overflow-hidden">
                    <span class="input-group-text bg-white border-end-0 text-muted">
                        <i class="bi bi-search"></i>
                    </span>
                    <input
                        type="text"
                        name="q"
                        placeholder="Tìm kiếm sản phẩm..."
                        value="{{ request('q') }}"
                        class="form-control border-start-0 py-2.5 text-sm"
                        style="box-shadow: none;"
                    />
                </div>
            </form>
        </div>
    </div>

    <!-- Category Filter Pills -->
    <div class="d-flex flex-wrap gap-2 mb-4">
        <a href="{{ route('products.index', ['q' => request('q')]) }}" class="btn btn-sm rounded-pill px-4 py-2 text-uppercase fw-semibold tracking-wide border shadow-sm {{ $selectedCategory === 'all' ? 'btn-primary text-white border-primary' : 'btn-white bg-white hover-bg-light text-secondary border-light' }}" style="{{ $selectedCategory === 'all' ? 'background-color: #7c3aed !important; border-color: #7c3aed !important;' : '' }}">
            Tất cả
        </a>
        @foreach($categories as $category)
            <a href="{{ route('products.index', ['category' => $category->slug, 'q' => request('q')]) }}" class="btn btn-sm rounded-pill px-4 py-2 text-uppercase fw-semibold tracking-wide border shadow-sm {{ $selectedCategory === $category->slug ? 'btn-primary text-white border-primary' : 'btn-white bg-white hover-bg-light text-secondary border-light' }}" style="{{ $selectedCategory === $category->slug ? 'background-color: #7c3aed !important; border-color: #7c3aed !important;' : '' }}">
                {{ $category->name }}
            </a>
        @endforeach
    </div>

    <!-- Products Grid -->
    @if($products->isEmpty())
        <div class="text-center py-5 bg-white border border-light shadow-sm rounded-4 w-100">
            <i class="bi bi-inbox text-muted display-3 d-block mb-3"></i>
            <h3 class="text-slate-800 font-bold text-lg my-0">Không tìm thấy sản phẩm</h3>
            <p class="text-slate-400 text-sm mt-1 mb-0">Hãy thử sử dụng bộ lọc khác hoặc nhập từ khóa khác.</p>
        </div>
    @else
        <div class="row g-4">
            @foreach($products as $product)
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
    @endif
</div>

<style>
    .hover-shadow:hover {
        transform: translateY(-5px);
        box-shadow: 0 1rem 3rem rgba(0,0,0,.1) !important;
    }
    .hover-text-violet:hover {
        color: #7c3aed !important;
    }
    .btn-white {
        background-color: #fff;
    }
    .btn-white:hover {
        background-color: #f1f5f9;
    }
</style>
@endsection
