<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>@yield('title', 'LX Store - Cửa Hàng Mua Sắm Cao Cấp')</title>
    <!-- Bootstrap 5 CSS CDN -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Bootstrap Icons CDN -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Inter', sans-serif;
            background-color: #f8f9fa;
        }
        .navbar-brand {
            font-weight: 800;
            background: linear-gradient(to right, #7c3aed, #4f46e5);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        .nav-link.active-custom {
            color: #7c3aed !important;
            border-bottom: 2px solid #7c3aed;
        }
        footer {
            background-color: #0b0f19;
        }
    </style>
</head>
<body class="min-h-screen d-flex flex-column">

    <!-- Header / Navbar -->
    <nav class="navbar navbar-expand-lg navbar-light bg-white sticky-top border-bottom shadow-sm py-3">
        <div class="container">
            <!-- Logo -->
            <a class="navbar-brand fs-3" href="{{ route('home') }}">LX Store</a>
            
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            
            <div class="collapse navbar-collapse" id="navbarNav">
                <!-- Navigation Links -->
                <ul class="navbar-nav mx-auto mb-2 mb-lg-0 gap-lg-3">
                    <li class="nav-item">
                        <a class="nav-link py-1 px-2 {{ request()->routeIs('home') ? 'active-custom' : 'text-secondary' }}" href="{{ route('home') }}">Trang Chủ</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link py-1 px-2 {{ request()->routeIs('products.*') ? 'active-custom' : 'text-secondary' }}" href="{{ route('products.index') }}">Sản Phẩm</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link py-1 px-2 text-secondary" href="http://localhost:5173" target="_blank">
                            Quản Trị (Admin) <i class="bi bi-box-arrow-up-right ms-0.5" style="font-size: 0.75rem;"></i>
                        </a>
                    </li>
                </ul>
                
                <!-- Cart Icon -->
                @php
                    $cartCount = array_sum(array_column(session('cart', []), 'quantity'));
                @endphp
                <div class="d-flex align-items-center">
                    <a href="{{ route('cart.index') }}" class="btn btn-light position-relative p-2 rounded-circle border text-secondary shadow-sm" aria-label="Giỏ hàng">
                        <i class="bi bi-bag fs-5"></i>
                        @if($cartCount > 0)
                            <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill" style="background-color: #7c3aed !important; color: #fff;">
                                {{ $cartCount }}
                            </span>
                        @endif
                    </a>
                </div>
            </div>
        </div>
    </nav>

    <!-- Main Content Area -->
    <main class="flex-grow-1 py-5">
        <div class="container">
            <!-- Toast Notification Alerts -->
            @if(session('success'))
                <div class="alert alert-success alert-dismissible fade show rounded-4 shadow-sm mb-4 border-0 p-3" role="alert" style="background-color: #ecfdf5; border-left: 5px solid #10b981 !important; color: #065f46;">
                    <div class="d-flex align-items-center gap-2">
                        <i class="bi bi-check-circle-fill fs-5 text-success"></i>
                        <div>{{ session('success') }}</div>
                    </div>
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
            @endif

            @if(session('error'))
                <div class="alert alert-danger alert-dismissible fade show rounded-4 shadow-sm mb-4 border-0 p-3" role="alert" style="background-color: #fef2f2; border-left: 5px solid #ef4444 !important; color: #991b1b;">
                    <div class="d-flex align-items-center gap-2">
                        <i class="bi bi-exclamation-triangle-fill fs-5 text-danger"></i>
                        <div>{{ session('error') }}</div>
                    </div>
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
            @endif

            @yield('content')
        </div>
    </main>

    <!-- Footer -->
    <footer class="text-secondary py-5 mt-auto border-top border-dark">
        <div class="container py-3">
            <div class="row g-4">
                <!-- Logo & Slogan -->
                <div class="col-lg-6 col-md-12 text-start">
                    <span class="text-white h3 fw-bold">
                        LX Store
                    </span>
                    <p class="text-sm max-w-xs text-secondary mt-3">
                        Cửa hàng cung cấp các sản phẩm thiết bị điện tử, thời trang, nội thất và sách chất lượng cao, mang lại trải nghiệm mua sắm hoàn hảo cho bạn.
                    </p>
                </div>

                <!-- Quick links -->
                <div class="col-lg-3 col-md-6 text-start">
                    <h5 class="text-white mb-3">Khám phá</h5>
                    <ul class="list-unstyled space-y-2 text-sm p-0 m-0">
                        <li class="mb-2">
                            <a href="{{ route('home') }}" class="text-secondary text-decoration-none hover-text-white transition-colors">
                                Trang Chủ
                            </a>
                        </li>
                        <li class="mb-2">
                            <a href="{{ route('products.index') }}" class="text-secondary text-decoration-none hover-text-white transition-colors">
                                Sản Phẩm
                            </a>
                        </li>
                        <li class="mb-2">
                            <a href="http://localhost:5173" target="_blank" class="text-secondary text-decoration-none hover-text-white transition-colors">
                                Trang Admin
                            </a>
                        </li>
                    </ul>
                </div>

                <!-- Contact Info -->
                <div class="col-lg-3 col-md-6 text-start">
                    <h5 class="text-white mb-3">Liên hệ</h5>
                    <ul class="list-unstyled space-y-2 text-sm text-secondary p-0 m-0">
                        <li class="mb-2">Địa chỉ: Laragon Local Host, Việt Nam</li>
                        <li class="mb-2">Điện thoại: +84 987 654 321</li>
                        <li class="mb-2">Email: contact@lxstore.test</li>
                    </ul>
                </div>
            </div>

            <div class="mt-5 border-top border-secondary pt-4 d-flex flex-column flex-md-row align-items-center justify-content-between text-xs text-secondary">
                <p class="m-0 text-secondary">&copy; {{ date('Y') }} LX Store. Môi trường Laragon Local Dev.</p>
                <div class="flex space-x-4 mt-2 mt-md-0">
                    <span class="text-secondary">Powered by Laravel (Blade) & Bootstrap 5</span>
                </div>
            </div>
        </div>
    </footer>

    <!-- jQuery CDN -->
    <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
    <!-- Bootstrap Bundle with Popper JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
