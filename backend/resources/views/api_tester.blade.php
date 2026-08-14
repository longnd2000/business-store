<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>NovaStore - API Interactive Tester</title>
    <!-- Tailwind CSS v3 CDN -->
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Plus Jakarta Sans', sans-serif;
            background-color: #0b0f19;
        }
        /* Custom scrollbar */
        ::-webkit-scrollbar {
            width: 6px;
            height: 6px;
        }
        ::-webkit-scrollbar-track {
            background: #111827;
        }
        ::-webkit-scrollbar-thumb {
            background: #374151;
            border-radius: 3px;
        }
        ::-webkit-scrollbar-thumb:hover {
            background: #4b5563;
        }
    </style>
</head>
<body class="text-slate-100 min-h-screen flex flex-col">

    <!-- Top Header -->
    <header class="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 h-16 flex items-center justify-between px-6 sticky top-0 z-50">
        <div class="flex items-center gap-3">
            <span class="bg-indigo-600 text-white font-extrabold px-3 py-1.5 rounded-xl text-sm tracking-wider">NOVA</span>
            <h1 class="text-lg font-black tracking-tight text-white">API TESTER & DOCS</h1>
        </div>
        
        <!-- Auth Header token info -->
        <div class="flex items-center gap-4">
            <!-- Quick Login Button -->
            <button onclick="quickLogin()" class="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-lg shadow-indigo-650/20">
                ⚡ Đăng nhập Admin nhanh (Mặc định)
            </button>
            <div class="relative">
                <input type="text" id="global-token" placeholder="Bearer Token..." class="w-64 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-indigo-500 text-slate-350 pr-8">
                <button onclick="clearToken()" class="absolute right-2.5 top-2.5 text-slate-500 hover:text-slate-300">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
            </div>
        </div>
    </header>

    <div class="flex flex-1 overflow-hidden">
        <!-- Sidebar Navigation -->
        <aside class="w-80 bg-slate-900 border-r border-slate-800 overflow-y-auto flex flex-col justify-between">
            <div class="p-4 space-y-6">
                <!-- Group 1: Public Storefront -->
                <div>
                    <h3 class="text-xxs font-bold text-slate-400 uppercase tracking-widest px-3 mb-3">Storefront Public APIs</h3>
                    <div class="space-y-1" id="group-public"></div>
                </div>

                <!-- Group 2: Admin Operations -->
                <div>
                    <h3 class="text-xxs font-bold text-slate-400 uppercase tracking-widest px-3 mb-3">Admin Protected APIs</h3>
                    <div class="space-y-1" id="group-admin"></div>
                </div>

                <!-- Group 3: Dev Tools -->
                <div>
                    <h3 class="text-xxs font-bold text-slate-400 uppercase tracking-widest px-3 mb-3">Developer Tools</h3>
                    <div class="space-y-1" id="group-dev"></div>
                </div>
            </div>
            
            <div class="p-4 border-t border-slate-800 text-center">
                <a href="/" class="text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors flex items-center justify-center gap-1.5">
                    ← Quay lại trang chủ
                </a>
            </div>
        </aside>

        <!-- Main Test Workspace -->
        <main class="flex-1 bg-slate-950 p-8 overflow-y-auto flex flex-col gap-6 text-left">
            <!-- Dynamic Welcome / Endpoint details -->
            <div id="endpoint-panel" class="hidden flex flex-col gap-6">
                
                <!-- Endpoint Header Details -->
                <div class="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col gap-3">
                    <div class="flex items-center gap-3">
                        <span id="ep-method" class="font-extrabold text-xs px-2.5 py-1 rounded-lg uppercase tracking-wider text-white">GET</span>
                        <code id="ep-path" class="text-sm font-semibold text-slate-300 font-mono">/api/products</code>
                        <span id="ep-auth" class="hidden bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xxs font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">Requires Auth</span>
                    </div>
                    <h2 id="ep-title" class="text-xl font-bold text-white mt-1">Lấy danh sách sản phẩm</h2>
                    <p id="ep-desc" class="text-xs text-slate-400">Endpoint này dùng để truy xuất danh sách toàn bộ sản phẩm hoặc lọc theo từ khóa, danh mục.</p>
                </div>

                <!-- Request Parameters Builder -->
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
                    <!-- Left: Parameters & Send button -->
                    <div class="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col justify-between gap-6">
                        <div class="space-y-6">
                            <h3 class="text-sm font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
                                <svg class="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
                                THAM SỐ REQUEST
                            </h3>

                            <!-- Path parameters -->
                            <div id="path-params-group" class="hidden space-y-3">
                                <h4 class="text-xs font-bold text-slate-350">Path Parameters (Thay thế {parameter})</h4>
                                <div id="path-params-list" class="space-y-2"></div>
                            </div>

                            <!-- Query parameters -->
                            <div id="query-params-group" class="hidden space-y-3">
                                <h4 class="text-xs font-bold text-slate-350">Query Parameters (Chuỗi truy vấn URL)</h4>
                                <div id="query-params-list" class="space-y-2"></div>
                            </div>

                            <!-- JSON Body -->
                            <div id="body-param-group" class="hidden space-y-3">
                                <h4 class="text-xs font-bold text-slate-350">Request Body (JSON format)</h4>
                                <textarea id="body-json" rows="8" class="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs font-mono focus:outline-none focus:border-indigo-500 text-slate-300"></textarea>
                            </div>
                        </div>

                        <button onclick="sendRequest()" class="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-indigo-600/20 text-sm mt-4">
                            GỬI YÊU CẦU API 🚀
                        </button>
                    </div>

                    <!-- Right: Response Console -->
                    <div class="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col gap-4">
                        <div class="flex items-center justify-between border-b border-slate-800 pb-3">
                            <h3 class="text-sm font-bold text-white flex items-center gap-2">
                                <svg class="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                KẾT QUẢ PHẢN HỒI (RESPONSE)
                            </h3>
                            <div class="flex items-center gap-3">
                                <span id="res-status" class="hidden text-xs font-bold px-2 py-0.5 rounded">200 OK</span>
                                <span id="res-time" class="hidden text-xxs text-slate-400 font-mono">0ms</span>
                            </div>
                        </div>

                        <!-- JSON Response code-viewer -->
                        <div class="relative flex-1 min-h-[300px] bg-slate-950 rounded-xl overflow-hidden border border-slate-850">
                            <!-- Copy button -->
                            <button onclick="copyResponse()" class="absolute right-3 top-3 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-white px-2 py-1 rounded text-xxs font-bold transition-all">
                                Copy
                            </button>
                            <pre id="res-body" class="p-4 text-xs font-mono text-emerald-400 overflow-auto h-full max-h-[450px]">Vui lòng chọn một API và nhấn gửi yêu cầu...</pre>
                        </div>
                    </div>
                </div>

            </div>

            <!-- Welcome Screen when no active endpoint selected -->
            <div id="welcome-panel" class="flex-grow flex flex-col items-center justify-center text-center py-20">
                <div class="bg-slate-900 border border-slate-800 p-10 rounded-3xl max-w-lg shadow-2xl flex flex-col items-center gap-4">
                    <span class="text-5xl">⚡</span>
                    <h2 class="text-xl font-extrabold text-white">HỆ THỐNG KIỂM THỬ API TỰ ĐỘNG</h2>
                    <p class="text-xs text-slate-400 leading-relaxed">
                        Chào mừng bạn đến với trang tài liệu và chạy thử API tương tác. Chọn một endpoint ở cột bên trái, bổ sung tham số, nhấn nút gửi để gọi trực tiếp các API tới backend và nhận phản hồi tức thì.
                    </p>
                </div>
            </div>
        </main>
    </div>

    <!-- Script holding API definitions and interactive actions -->
    <script>
        const ENDPOINTS = [
            // Public Storefront APIs
            {
                id: 'get-categories',
                group: 'public',
                method: 'GET',
                path: '/api/categories',
                title: 'Lấy danh mục sản phẩm',
                desc: 'Truy xuất danh sách tất cả các danh mục sản phẩm có trên hệ thống kèm số lượng sản phẩm liên kết.',
                auth: false
            },
            {
                id: 'get-products',
                group: 'public',
                method: 'GET',
                path: '/api/products',
                title: 'Lấy danh sách sản phẩm',
                desc: 'Lấy danh sách các sản phẩm, hỗ trợ các query parameters để lọc kết quả.',
                auth: false,
                queryParams: [
                    { name: 'category', placeholder: 'Ví dụ: thiet-bi-dien-tu' },
                    { name: 'q', placeholder: 'Từ khóa tìm kiếm...' }
                ]
            },
            {
                id: 'get-product-detail',
                group: 'public',
                method: 'GET',
                path: '/api/products/{id}',
                title: 'Chi tiết sản phẩm',
                desc: 'Lấy thông tin chi tiết của một sản phẩm dựa trên khóa chính (ID).',
                auth: false,
                pathParams: [{ name: 'id', placeholder: 'ID sản phẩm (Ví dụ: 1)' }]
            },
            {
                id: 'create-order',
                group: 'public',
                method: 'POST',
                path: '/api/orders',
                title: 'Tạo đơn đặt hàng mới',
                desc: 'Tạo hóa đơn mua sắm. Cửa hàng sẽ tự động ghi nhận giao dịch thanh toán và cập nhật lại số lượng tồn kho sản phẩm.',
                auth: false,
                bodySample: {
                    customer_name: 'Nguyễn Văn Tester',
                    customer_email: 'tester@example.com',
                    customer_phone: '0901234567',
                    shipping_address: '123 Đường Láng, Hà Nội',
                    payment_method: 'COD',
                    items: [
                        { product_id: 1, quantity: 2 }
                    ]
                }
            },
            {
                id: 'get-news',
                group: 'public',
                method: 'GET',
                path: '/api/news',
                title: 'Lấy danh sách tin tức',
                desc: 'Truy xuất danh sách tin tức mới nhất, có hỗ trợ lọc theo từ khóa tìm kiếm.',
                auth: false,
                queryParams: [{ name: 'q', placeholder: 'Tìm kiếm tin tức...' }]
            },
            {
                id: 'get-news-detail',
                group: 'public',
                method: 'GET',
                path: '/api/news/{id}',
                title: 'Chi tiết tin tức',
                desc: 'Lấy thông tin đầy đủ và nội dung chi tiết dạng HTML của một bài viết cụ thể dựa trên ID.',
                auth: false,
                pathParams: [{ name: 'id', placeholder: 'ID bài viết (Ví dụ: 1)' }]
            },
            // Admin Login
            {
                id: 'admin-login',
                group: 'admin',
                method: 'POST',
                path: '/api/admin/login',
                title: 'Đăng nhập lấy Token quản trị',
                desc: 'Đăng nhập hệ thống bằng tài khoản quản lý (username & password) để lấy mã JWT Token sử dụng cho các API bảo mật.',
                auth: false,
                bodySample: {
                    username: 'admin',
                    password: 'abc123'
                }
            },
            // Admin Protected APIs
            {
                id: 'admin-me',
                group: 'admin',
                method: 'GET',
                path: '/api/admin/me',
                title: 'Thông tin Admin hiện tại',
                desc: 'Kiểm tra thông tin chi tiết và phân quyền của Admin đang đăng nhập tương ứng với Token hiện tại.',
                auth: true
            },
            {
                id: 'admin-stats',
                group: 'admin',
                method: 'GET',
                path: '/api/admin/stats',
                title: 'Thống kê tổng quan Dashboard',
                desc: 'Lấy số liệu thống kê tổng hợp về doanh thu, số lượng đơn hàng, sản phẩm và biểu đồ bán hàng 7 ngày gần nhất.',
                auth: true
            },
            {
                id: 'admin-orders',
                group: 'admin',
                method: 'GET',
                path: '/api/admin/orders',
                title: 'Danh sách đơn đặt hàng',
                desc: 'Xem toàn bộ lịch sử hóa đơn mua hàng, có thể lọc tìm kiếm theo tên hoặc SĐT khách hàng.',
                auth: true,
                queryParams: [{ name: 'search', placeholder: 'Tên hoặc SĐT...' }]
            },
            {
                id: 'admin-order-status',
                group: 'admin',
                method: 'PUT',
                path: '/api/admin/orders/{id}/status',
                title: 'Cập nhật trạng thái đơn hàng',
                desc: 'Thay đổi trạng thái đơn hàng (Pending, Processing, Completed, Cancelled). Hủy đơn sẽ tự động hoàn trả số lượng tồn kho sản phẩm.',
                auth: true,
                pathParams: [{ name: 'id', placeholder: 'ID đơn hàng' }],
                bodySample: {
                    status: 'Processing'
                }
            },
            {
                id: 'admin-get-categories',
                group: 'admin',
                method: 'GET',
                path: '/api/admin/categories',
                title: 'Xem danh mục (Admin)',
                desc: 'Xem danh sách danh mục sản phẩm nội bộ để phục vụ cho các bảng quản trị.',
                auth: true,
                queryParams: [{ name: 'search', placeholder: 'Từ khóa...' }]
            },
            {
                id: 'admin-create-category',
                group: 'admin',
                method: 'POST',
                path: '/api/admin/categories',
                title: 'Thêm danh mục mới',
                desc: 'Thêm mới một danh mục sản phẩm vào cơ sở dữ liệu.',
                auth: true,
                bodySample: {
                    name: 'Đồ Gia Dụng Thông Minh',
                    image_url: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=500&auto=format&fit=crop'
                }
            },
            {
                id: 'admin-update-category',
                group: 'admin',
                method: 'PUT',
                path: '/api/admin/categories/{id}',
                title: 'Sửa danh mục',
                desc: 'Cập nhật thông tin chi tiết một danh mục.',
                auth: true,
                pathParams: [{ name: 'id', placeholder: 'ID danh mục' }],
                bodySample: {
                    name: 'Đồ Gia Dụng Cao Cấp',
                    image_url: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=500&auto=format&fit=crop'
                }
            },
            {
                id: 'admin-delete-category',
                group: 'admin',
                method: 'DELETE',
                path: '/api/admin/categories/{id}',
                title: 'Xóa danh mục',
                desc: 'Xóa danh mục khỏi hệ thống. Lưu ý: Mọi sản phẩm thuộc danh mục này cũng sẽ bị xóa bỏ theo.',
                auth: true,
                pathParams: [{ name: 'id', placeholder: 'ID danh mục' }]
            },
            {
                id: 'admin-get-products',
                group: 'admin',
                method: 'GET',
                path: '/api/admin/products',
                title: 'Xem danh sách sản phẩm (Admin)',
                desc: 'Lấy danh mục sản phẩm quản trị kèm thông tin chi tiết danh mục.',
                auth: true,
                queryParams: [{ name: 'search', placeholder: 'Từ khóa tìm kiếm...' }]
            },
            {
                id: 'admin-create-product',
                group: 'admin',
                method: 'POST',
                path: '/api/admin/products',
                title: 'Thêm sản phẩm mới',
                desc: 'Tạo sản phẩm mới vào danh mục tương ứng.',
                auth: true,
                bodySample: {
                    name: 'Đèn Bàn Pixar Decor',
                    category_id: 3,
                    price: 250000,
                    stock: 50,
                    description: 'Thiết kế kim loại sơn tĩnh điện cổ điển, phù hợp làm việc và trang trí góc làm việc.',
                    image_url: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500&auto=format&fit=crop'
                }
            },
            {
                id: 'admin-update-product',
                group: 'admin',
                method: 'PUT',
                path: '/api/admin/products/{id}',
                title: 'Chỉnh sửa sản phẩm',
                desc: 'Thay đổi các thông tin tên, giá bán, số lượng kho hoặc ảnh đại diện sản phẩm.',
                auth: true,
                pathParams: [{ name: 'id', placeholder: 'ID sản phẩm' }],
                bodySample: {
                    name: 'Đèn Bàn Pixar Decor V2',
                    category_id: 3,
                    price: 280000,
                    stock: 45,
                    description: 'Mẫu nâng cấp đế kẹp bàn siêu tiện lợi.',
                    image_url: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500&auto=format&fit=crop'
                }
            },
            {
                id: 'admin-delete-product',
                group: 'admin',
                method: 'DELETE',
                path: '/api/admin/products/{id}',
                title: 'Xóa sản phẩm',
                desc: 'Xóa vĩnh viễn sản phẩm khỏi cơ sở dữ liệu.',
                auth: true,
                pathParams: [{ name: 'id', placeholder: 'ID sản phẩm' }]
            },
            {
                id: 'admin-buyers',
                group: 'admin',
                method: 'GET',
                path: '/api/admin/buyers',
                title: 'Xem danh sách người mua',
                desc: 'Xem thông tin khách hàng, số lượng đơn hàng đã đặt và tổng chi tiêu thực tế.',
                auth: true,
                queryParams: [{ name: 'search', placeholder: 'Tìm theo tên hoặc SĐT...' }]
            },
            {
                id: 'admin-get-news',
                group: 'admin',
                method: 'GET',
                path: '/api/admin/news',
                title: 'Xem danh sách tin tức (Admin)',
                desc: 'Danh sách tin tức phục vụ công tác quản lý biên tập.',
                auth: true,
                queryParams: [{ name: 'search', placeholder: 'Từ khóa...' }]
            },
            {
                id: 'admin-create-news',
                group: 'admin',
                method: 'POST',
                path: '/api/admin/news',
                title: 'Thêm bài viết mới',
                desc: 'Biên tập và tạo một bài viết tin tức mới.',
                auth: true,
                bodySample: {
                    title: 'Cách setup góc làm việc tối giản thời thượng',
                    summary: 'Chia sẻ từ các chuyên gia thiết kế nội thất để tối ưu hóa không gian làm việc nhỏ hẹp.',
                    content: '<h3>1. Lựa chọn tông màu</h3><p>Màu trắng và xám đen luôn mang lại sự tinh tể...</p>',
                    image_url: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=500&auto=format&fit=crop',
                    author: 'Khánh Duy'
                }
            },
            {
                id: 'admin-update-news',
                group: 'admin',
                method: 'PUT',
                path: '/api/admin/news/{id}',
                title: 'Chỉnh sửa bài viết',
                desc: 'Cập nhật lại tiêu đề, tóm tắt hoặc nội dung HTML chi tiết của bài viết.',
                auth: true,
                pathParams: [{ name: 'id', placeholder: 'ID bài viết' }],
                bodySample: {
                    title: 'Cách setup góc làm việc tối giản và hiệu quả 2026',
                    summary: 'Cập nhật xu hướng thiết kế góc làm việc thông minh năm nay.',
                    content: '<h3>1. Lựa chọn tông màu và ánh sáng</h3><p>Màu trắng giúp không gian thoáng đãng...</p>',
                    image_url: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=500&auto=format&fit=crop',
                    author: 'Khánh Duy'
                }
            },
            {
                id: 'admin-delete-news',
                group: 'admin',
                method: 'DELETE',
                path: '/api/admin/news/{id}',
                title: 'Xóa bài viết',
                desc: 'Xóa vĩnh viễn bài viết khỏi hệ thống.',
                auth: true,
                pathParams: [{ name: 'id', placeholder: 'ID bài viết' }]
            },
            // Dev helpers
            {
                id: 'dev-migrate',
                group: 'dev',
                method: 'GET',
                path: '/dev/migrate',
                title: 'Re-Migrate & Re-Seed Database',
                desc: 'DỌN SẠCH và chạy lại toàn bộ CSDL và Seeder từ đầu. Rất hữu ích khi muốn reset dữ liệu thử nghiệm.',
                auth: false
            },
            {
                id: 'dev-test-auth',
                group: 'dev',
                method: 'GET',
                path: '/dev/test-auth',
                title: 'Kiểm tra khớp mật khẩu Admin',
                desc: 'Hàm dev test kiểm tra so khớp mã Hash mật khẩu tài khoản `admin` (mật khẩu: abc123) trực tiếp.',
                auth: false
            },
            {
                id: 'dev-test-payment',
                group: 'dev',
                method: 'GET',
                path: '/dev/test-payment',
                title: 'Kiểm thử cổng thanh toán OOP',
                desc: 'Chạy thử OOP Payment Factory để tạo order và ghi nhận giao dịch bằng mẫu thiết kế Interface.',
                auth: false
            },
            {
                id: 'dev-test-redis',
                group: 'dev',
                method: 'GET',
                path: '/dev/test-redis',
                title: 'Đo lường hiệu suất Redis',
                desc: 'Mô phỏng cơ chế Caching và Distributed Lock của Redis để so sánh tốc độ cải thiện hiệu năng.',
                auth: false
            }
        ];

        let activeEndpoint = null;

        // Populate Sider lists
        window.addEventListener('DOMContentLoaded', () => {
            const publicList = document.getElementById('group-public');
            const adminList = document.getElementById('group-admin');
            const devList = document.getElementById('group-dev');

            // Load Global token if stored in localStorage
            const token = localStorage.getItem('tester_jwt_token');
            if (token) {
                document.getElementById('global-token').value = token;
            }

            ENDPOINTS.forEach(ep => {
                const btn = document.createElement('button');
                btn.className = `w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-all hover:bg-slate-800/60 group text-slate-400 hover:text-white`;
                
                let badgeColor = 'bg-slate-800 text-slate-300';
                if (ep.method === 'GET') badgeColor = 'bg-emerald-950 text-emerald-400 border border-emerald-900/30';
                else if (ep.method === 'POST') badgeColor = 'bg-indigo-950 text-indigo-400 border border-indigo-900/30';
                else if (ep.method === 'PUT') badgeColor = 'bg-amber-950 text-amber-400 border border-amber-900/30';
                else if (ep.method === 'DELETE') badgeColor = 'bg-rose-950 text-rose-400 border border-rose-900/30';

                btn.innerHTML = `
                    <div class="flex flex-col gap-0.5 max-w-[190px]">
                        <span class="truncate text-white font-medium group-hover:text-indigo-400 transition-colors">${ep.title}</span>
                        <span class="text-[10px] text-slate-500 font-mono truncate">${ep.path}</span>
                    </div>
                    <span class="text-[9px] font-bold px-1.5 py-0.5 rounded-md ${badgeColor}">${ep.method}</span>
                `;
                btn.onclick = () => selectEndpoint(ep, btn);

                if (ep.group === 'public') publicList.appendChild(btn);
                else if (ep.group === 'admin') adminList.appendChild(btn);
                else if (ep.group === 'dev') devList.appendChild(btn);
            });
        });

        function selectEndpoint(ep, element) {
            activeEndpoint = ep;

            // Highlight in sider
            document.querySelectorAll('aside button').forEach(el => el.classList.remove('bg-slate-800', 'text-white'));
            element.classList.add('bg-slate-800', 'text-white');

            // Render details panels
            document.getElementById('welcome-panel').classList.add('hidden');
            const panel = document.getElementById('endpoint-panel');
            panel.classList.remove('hidden');

            document.getElementById('ep-title').innerText = ep.title;
            document.getElementById('ep-desc').innerText = ep.desc;
            document.getElementById('ep-path').innerText = ep.path;
            
            const methodBadge = document.getElementById('ep-method');
            methodBadge.innerText = ep.method;
            methodBadge.className = 'font-extrabold text-xs px-2.5 py-1 rounded-lg uppercase tracking-wider text-white';
            if (ep.method === 'GET') methodBadge.classList.add('bg-emerald-600');
            else if (ep.method === 'POST') methodBadge.classList.add('bg-indigo-600');
            else if (ep.method === 'PUT') methodBadge.classList.add('bg-amber-600');
            else if (ep.method === 'DELETE') methodBadge.classList.add('bg-rose-600');

            const authBadge = document.getElementById('ep-auth');
            if (ep.auth) authBadge.classList.remove('hidden');
            else authBadge.classList.add('hidden');

            // Build Path Parameters Input fields
            const pathGroup = document.getElementById('path-params-group');
            const pathList = document.getElementById('path-params-list');
            pathList.innerHTML = '';
            if (ep.pathParams && ep.pathParams.length > 0) {
                pathGroup.classList.remove('hidden');
                ep.pathParams.forEach(param => {
                    const div = document.createElement('div');
                    div.className = 'flex flex-col gap-1';
                    div.innerHTML = `
                        <label class="text-[10px] font-bold text-slate-500 font-mono uppercase">${param.name}</label>
                        <input type="text" data-path-param="${param.name}" placeholder="${param.placeholder}" class="w-full bg-slate-950 border border-slate-850 rounded-xl px-3.5 py-2 text-xs text-slate-350 focus:outline-none focus:border-indigo-500">
                    `;
                    pathList.appendChild(div);
                });
            } else {
                pathGroup.classList.add('hidden');
            }

            // Build Query Parameters Input fields
            const queryGroup = document.getElementById('query-params-group');
            const queryList = document.getElementById('query-params-list');
            queryList.innerHTML = '';
            if (ep.queryParams && ep.queryParams.length > 0) {
                queryGroup.classList.remove('hidden');
                ep.queryParams.forEach(param => {
                    const div = document.createElement('div');
                    div.className = 'flex flex-col gap-1';
                    div.innerHTML = `
                        <label class="text-[10px] font-bold text-slate-500 font-mono uppercase">${param.name}</label>
                        <input type="text" data-query-param="${param.name}" placeholder="${param.placeholder}" class="w-full bg-slate-950 border border-slate-850 rounded-xl px-3.5 py-2 text-xs text-slate-350 focus:outline-none focus:border-indigo-500">
                    `;
                    queryList.appendChild(div);
                });
            } else {
                queryGroup.classList.add('hidden');
            }

            // Build JSON Body editor
            const bodyGroup = document.getElementById('body-param-group');
            const bodyJson = document.getElementById('body-json');
            if (ep.bodySample) {
                bodyGroup.classList.remove('hidden');
                bodyJson.value = JSON.stringify(ep.bodySample, null, 4);
            } else {
                bodyGroup.classList.add('hidden');
                bodyJson.value = '';
            }

            // Reset Response panel
            document.getElementById('res-status').className = 'hidden';
            document.getElementById('res-time').className = 'hidden';
            document.getElementById('res-body').innerText = 'Sẵn sàng gửi yêu cầu API...';
        }

        async function sendRequest() {
            if (!activeEndpoint) return;

            const resStatus = document.getElementById('res-status');
            const resTime = document.getElementById('res-time');
            const resBody = document.getElementById('res-body');

            resStatus.className = 'hidden';
            resTime.className = 'hidden';
            resBody.innerText = 'Đang gửi yêu cầu...';

            // 1. Build request URL by replacing path parameters
            let url = activeEndpoint.path;
            const pathInputs = document.querySelectorAll('[data-path-param]');
            pathInputs.forEach(input => {
                const name = input.getAttribute('data-path-param');
                const val = input.value || `{${name}}`;
                url = url.replace(`{${name}}`, val);
            });

            // 2. Append query parameters
            const queryInputs = document.querySelectorAll('[data-query-param]');
            const queryParts = [];
            queryInputs.forEach(input => {
                const name = input.getAttribute('data-query-param');
                const val = input.value;
                if (val) {
                    queryParts.push(`${encodeURIComponent(name)}=${encodeURIComponent(val)}`);
                }
            });
            if (queryParts.length > 0) {
                url += '?' + queryParts.join('&');
            }

            // 3. Set Headers
            const headers = {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            };
            const token = document.getElementById('global-token').value;
            if (token) {
                headers['Authorization'] = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
            }

            // 4. Set Request options
            const options = {
                method: activeEndpoint.method,
                headers: headers
            };

            // 5. Attach Request body
            if (activeEndpoint.bodySample) {
                const bodyText = document.getElementById('body-json').value;
                try {
                    // Try parsing to validate JSON structure
                    JSON.parse(bodyText);
                    options.body = bodyText;
                } catch(e) {
                    resBody.innerText = 'LỖI: Định dạng JSON của Request Body không hợp lệ!';
                    resBody.className = 'p-4 text-xs font-mono text-rose-450 overflow-auto h-full max-h-[450px]';
                    return;
                }
            }

            // 6. Execute Request & time it
            const startTime = performance.now();
            try {
                const response = await fetch(url, options);
                const duration = Math.round(performance.now() - startTime);
                const isJson = response.headers.get('content-type')?.includes('application/json');
                const data = isJson ? await response.json() : await response.text();

                // Display Status
                resStatus.className = 'text-xs font-bold px-2 py-0.5 rounded block';
                resStatus.innerText = `${response.status} ${response.statusText}`;
                if (response.ok) {
                    resStatus.classList.add('bg-emerald-950', 'text-emerald-400');
                    resStatus.classList.remove('bg-rose-950', 'text-rose-400');
                } else {
                    resStatus.classList.add('bg-rose-950', 'text-rose-400');
                    resStatus.classList.remove('bg-emerald-950', 'text-emerald-400');
                }

                // Display response duration
                resTime.className = 'text-xxs text-slate-400 font-mono block';
                resTime.innerText = `${duration}ms`;

                // Display body
                resBody.innerText = typeof data === 'object' ? JSON.stringify(data, null, 4) : data;
                resBody.className = `p-4 text-xs font-mono overflow-auto h-full max-h-[450px] ${response.ok ? 'text-emerald-400' : 'text-rose-400'}`;

                // If this request was a login attempt, save the token automatically!
                if (activeEndpoint.id === 'admin-login' && response.ok && data.token) {
                    document.getElementById('global-token').value = data.token;
                    localStorage.setItem('tester_jwt_token', data.token);
                }

            } catch (err) {
                const duration = Math.round(performance.now() - startTime);
                resTime.className = 'text-xxs text-slate-400 font-mono block';
                resTime.innerText = `${duration}ms`;
                resBody.innerText = `Lỗi kết nối hoặc CORS block:\n${err.message}`;
                resBody.className = 'p-4 text-xs font-mono text-rose-450 overflow-auto h-full max-h-[450px]';
            }
        }

        async function quickLogin() {
            try {
                const response = await fetch('/api/admin/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                    body: JSON.stringify({ username: 'admin', password: 'abc123' })
                });
                const data = await response.json();
                if (response.ok && data.token) {
                    document.getElementById('global-token').value = data.token;
                    localStorage.setItem('tester_jwt_token', data.token);
                    alert('Đăng nhập thành công và nạp Token tự động!');
                } else {
                    alert('Đăng nhập thất bại: ' + (data.message || 'Lỗi không xác định'));
                }
            } catch(e) {
                alert('Lỗi kết nối API đăng nhập: ' + e.message);
            }
        }

        function clearToken() {
            document.getElementById('global-token').value = '';
            localStorage.removeItem('tester_jwt_token');
        }

        function copyResponse() {
            const body = document.getElementById('res-body').innerText;
            navigator.clipboard.writeText(body);
            alert('Đã sao chép phản hồi vào bộ nhớ đệm!');
        }
    </script>
</body>
</html>
