<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 0. Seed Roles and Permissions
        $permissions = [
            'view_stats',
            'view_products',
            'create_products',
            'edit_products',
            'delete_products',
            'view_categories',
            'manage_categories',
            'view_buyers',
            'manage_orders',
            'manage_news',
        ];

        $permissionModels = [];
        foreach ($permissions as $permName) {
            $permissionModels[$permName] = \App\Models\Permission::create([
                'name' => $permName
            ]);
        }

        $adminRole = \App\Models\Role::create(['name' => 'admin']);
        $editorRole = \App\Models\Role::create(['name' => 'editor']);
        $buyerRole = \App\Models\Role::create(['name' => 'buyer']);

        // Admin gets all permissions
        $adminRole->permissions()->attach(array_map(fn($m) => $m->id, $permissionModels));

        // Editor gets view_products, edit_products, view_categories
        $editorRole->permissions()->attach([
            $permissionModels['view_products']->id,
            $permissionModels['edit_products']->id,
            $permissionModels['view_categories']->id,
        ]);

        // 0.1. Create Admin and Editor Users in Database
        \App\Models\User::create([
            'name' => 'Admin LX',
            'email' => 'admin',
            'password' => \Illuminate\Support\Facades\Hash::make('abc123'),
            'role_id' => $adminRole->id,
        ]);

        \App\Models\User::create([
            'name' => 'Editor LX',
            'email' => 'editor',
            'password' => \Illuminate\Support\Facades\Hash::make('abc123'),
            'role_id' => $editorRole->id,
        ]);

        // 1. Create categories
        $tech = Category::create([
            'name' => 'Thiết bị Điện tử',
            'slug' => 'thiet-bi-dien-tu',
            'image_url' => 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=500&auto=format&fit=crop'
        ]);

        $fashion = Category::create([
            'name' => 'Thời trang & Phụ kiện',
            'slug' => 'thoi-trang-phu-kien',
            'image_url' => 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=500&auto=format&fit=crop'
        ]);

        $furniture = Category::create([
            'name' => 'Nội thất & Nhà cửa',
            'slug' => 'noi-that-nha-cua',
            'image_url' => 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=500&auto=format&fit=crop'
        ]);

        $books = Category::create([
            'name' => 'Sách & Văn phòng phẩm',
            'slug' => 'sach-van-phong-pham',
            'image_url' => 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=500&auto=format&fit=crop'
        ]);

        // 2. Create products for each category
        
        // --- Tech ---
        Product::create([
            'category_id' => $tech->id,
            'name' => 'Laptop MacBook Air M2 2022',
            'slug' => 'laptop-macbook-air-m2-2022',
            'description' => 'Laptop Apple MacBook Air M2 2022 sở hữu thiết kế siêu mỏng nhẹ sang trọng, vi xử lý M2 mạnh mẽ vượt trội, thời lượng pin sử dụng cả ngày dài và màn hình Liquid Retina hiển thị sắc nét.',
            'price' => 26990000,
            'stock' => 15,
            'image_url' => 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&auto=format&fit=crop'
        ]);

        Product::create([
            'category_id' => $tech->id,
            'name' => 'Bàn phím cơ không dây Keychron K2',
            'slug' => 'ban-phim-co-keychron-k2',
            'description' => 'Bàn phím cơ Keychron K2 nhôm hỗ trợ kết nối Bluetooth và cắm dây Type-C. Tích hợp Led RGB đẹp mắt với Switch Gateron gõ êm ái, tương thích hoàn hảo cả Windows và macOS.',
            'price' => 1850000,
            'stock' => 25,
            'image_url' => 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=500&auto=format&fit=crop'
        ]);

        Product::create([
            'category_id' => $tech->id,
            'name' => 'Tai nghe Sony WH-1000XM5',
            'slug' => 'tai-nghe-sony-wh-1000xm5',
            'description' => 'Tai nghe chụp tai Sony WH-1000XM5 chống ồn chủ động tốt nhất thế giới, thiết kế êm ái tối giản, âm thanh Hi-Res Audio chân thực cùng micro lọc giọng nói đàm thoại rõ nét.',
            'price' => 6490000,
            'stock' => 8,
            'image_url' => 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop'
        ]);

        Product::create([
            'category_id' => $tech->id,
            'name' => 'Điện thoại iPhone 15 Pro Max 256GB',
            'slug' => 'iphone-15-pro-max-256gb',
            'description' => 'Apple iPhone 15 Pro Max 256GB vỏ Titan cấp hàng không siêu nhẹ bền bỉ, nút Action tùy biến thông minh, chip A17 Pro chơi game cực đỉnh và camera zoom quang học 5x cực đỉnh.',
            'price' => 29990000,
            'stock' => 12,
            'image_url' => 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=500&auto=format&fit=crop'
        ]);

        // --- Fashion ---
        Product::create([
            'category_id' => $fashion->id,
            'name' => 'Balo du lịch chống nước Canvas',
            'slug' => 'balo-du-lich-chong-nuoc-canvas',
            'description' => 'Balo canvas thiết kế hiện đại chống nước tối ưu, không gian chứa rộng rãi có ngăn chống sốc chuyên dụng cho laptop lên đến 15.6 inch. Thích hợp đi làm, đi học và dã ngoại.',
            'price' => 450000,
            'stock' => 40,
            'image_url' => 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&auto=format&fit=crop'
        ]);

        Product::create([
            'category_id' => $fashion->id,
            'name' => 'Đồng hồ nam Classic Minimalist',
            'slug' => 'dong-ho-nam-classic-minimalist',
            'description' => 'Đồng hồ thạch anh thiết kế tối giản thanh lịch, dây đeo da thật cao cấp, mặt kính cường lực chống xước nhẹ, kháng nước sinh hoạt hàng ngày.',
            'price' => 1200000,
            'stock' => 20,
            'image_url' => 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop'
        ]);

        Product::create([
            'category_id' => $fashion->id,
            'name' => 'Áo khoác Bomber Unisex',
            'slug' => 'ao-khoac-bomber-unisex',
            'description' => 'Áo gió khoác ngoài kiểu dáng Bomber năng động, chất liệu vải dù gió cao cấp 2 lớp giữ ấm tốt, cản gió nhẹ và dễ dàng mix-match với mọi trang phục.',
            'price' => 350000,
            'stock' => 50,
            'image_url' => 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&auto=format&fit=crop'
        ]);

        // --- Furniture ---
        Product::create([
            'category_id' => $furniture->id,
            'name' => 'Bàn làm việc gỗ sồi tự nhiên',
            'slug' => 'ban-lam-viec-go-soi-tu-nhien',
            'description' => 'Bàn làm việc gỗ sồi chất lượng cao được gia công mượt mà, khung sắt sơn tĩnh điện chắc chắn, tích hợp sẵn khe đi dây điện gọn gàng cho không gian ngăn nắp.',
            'price' => 3200000,
            'stock' => 10,
            'image_url' => 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=500&auto=format&fit=crop'
        ]);

        Product::create([
            'category_id' => $furniture->id,
            'name' => 'Ghế xoay công thái học Ergonomic',
            'slug' => 'ghe-xoay-cong-thai-hoc-ergonomic',
            'description' => 'Ghế văn phòng công thái học thiết kế chuẩn nâng đỡ cột sống, đệm lưới thoáng khí chống ê mỏi, hỗ trợ ngả lưng thư giãn và tay vịn điều chỉnh đa hướng.',
            'price' => 2850000,
            'stock' => 15,
            'image_url' => 'https://images.unsplash.com/photo-1505797149-43b0069ec26b?w=500&auto=format&fit=crop'
        ]);

        Product::create([
            'category_id' => $furniture->id,
            'name' => 'Đèn LED để bàn thông minh cảm ứng',
            'slug' => 'den-led-de-ban-thong-minh-cam-ung',
            'description' => 'Đèn học chống cận thị với công nghệ LED dịu mắt, nút bấm cảm ứng điều chỉnh 5 mức độ sáng và 3 chế độ màu sắc khác nhau, tích hợp hẹn giờ tắt tự động.',
            'price' => 550000,
            'stock' => 30,
            'image_url' => 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500&auto=format&fit=crop'
        ]);

        // --- Books ---
        Product::create([
            'category_id' => $books->id,
            'name' => 'Sách Đắc Nhân Tâm (Khổ lớn)',
            'slug' => 'sach-dac-nhan-tam-kho-lon',
            'description' => 'Tác phẩm nghệ thuật ứng xử nổi tiếng nhất của Dale Carnegie, cuốn sách gối đầu giường của nhiều thế hệ giúp bạn thấu hiểu bản thân và chinh phục lòng người.',
            'price' => 86000,
            'stock' => 100,
            'image_url' => 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&auto=format&fit=crop'
        ]);

        Product::create([
            'category_id' => $books->id,
            'name' => 'Sổ tay da ghi chép A5 Premium',
            'slug' => 'so-tay-da-ghi-chep-a5-premium',
            'description' => 'Sổ tay bìa da PU mềm mịn dập vân chìm tinh tế, ruột sổ làm bằng giấy Ford kem chống mỏi mắt dày dặn, viết êm không lem màu mực phù hợp làm quà tặng.',
            'price' => 120000,
            'stock' => 80,
            'image_url' => 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=500&auto=format&fit=crop'
        ]);

        // 3. Create news articles
        \App\Models\News::create([
            'title' => 'Top 5 Thiết Bị Công Nghệ Giúp Tối Ưu Hóa Góc Làm Việc',
            'slug' => 'top-5-thiet-bi-cong-nghe-giup-toi-uu-hoa-goc-lam-viec',
            'summary' => 'Làm sao để thiết lập một không gian làm việc vừa đẹp vừa tối ưu hiệu suất? Hãy cùng NovaStore điểm qua 5 thiết bị công nghệ không thể thiếu.',
            'content' => '<p>Một góc làm việc gọn gàng, thông minh không chỉ giúp tăng cảm hứng mà còn cải thiện rõ rệt hiệu suất công việc hàng ngày của bạn. Dưới đây là top 5 thiết bị được đánh giá cao nhất hiện nay:</p><h3>1. Bàn phím cơ không dây</h3><p>Bàn phím cơ mang lại cảm giác gõ êm ái và chính xác. Kết nối không dây giúp bàn làm việc của bạn gọn gàng, không bị rối dây.</p><h3>2. Ghế công thái học</h3><p>Ghế công thái học giúp nâng đỡ cột sống tốt hơn, giảm đau lưng khi phải làm việc liên tục trong nhiều giờ.</p><h3>3. Đèn LED để bàn chống cận</h3><p>Ánh sáng thích hợp giúp mắt không bị mỏi và bảo vệ thị lực tốt hơn.</p><h3>4. Tai nghe chống ồn chủ động</h3><p>Giúp bạn tập trung tuyệt đối vào công việc, tránh xa tiếng ồn xung quanh.</p><h3>5. Màn hình máy tính UltraWide</h3><p>Diện tích hiển thị rộng hơn giúp bạn đa nhiệm dễ dàng hơn.</p><p>Tại NovaStore, chúng tôi cung cấp đầy đủ các thiết bị trên với chất lượng vượt trội. Hãy truy cập danh mục sản phẩm của chúng tôi để mua sắm ngay hôm nay!</p>',
            'image_url' => 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&auto=format&fit=crop',
            'author' => 'Xuân Trường'
        ]);

        \App\Models\News::create([
            'title' => 'Xu Hướng Thời Trang Tối Giản (Minimalism) Cho Năm 2026',
            'slug' => 'xu-huong-thoi-trang-toi-gian-minimalism-cho-nam-2026',
            'summary' => 'Phong cách Minimalism tiếp tục thống trị xu hướng thời trang. Cùng khám phá bí quyết phối đồ đơn giản nhưng cực kỳ tinh tế.',
            'content' => '<p>Phong cách tối giản (Minimalism) không chỉ đơn thuần là việc mặc những bộ quần áo ít họa tiết hay đơn sắc. Đó là triết lý sống hướng tới sự tinh tế, tập trung vào chất lượng hơn số lượng.</p><h3>Bí quyết xây dựng tủ đồ tối giản:</h3><p>1. Chọn các tông màu trung tính như đen, trắng, xám, beige để dễ dàng mix-match.</p><p>2. Đầu tư vào các sản phẩm cơ bản nhưng chất lượng cao, ví dụ như áo phông trơn cotton, balo canvas hay đồng hồ da classic.</p><p>3. Ưu tiên sự thoải mái và phom dáng chuẩn xác.</p><p>Hãy cùng trải nghiệm những sản phẩm thời trang tối giản chất lượng tại NovaStore ngay!</p>',
            'image_url' => 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&auto=format&fit=crop',
            'author' => 'Thùy Chi'
        ]);

        \App\Models\News::create([
            'title' => 'Cách Chọn Ghế Công Thái Học Phù Hợp Cho Dân Văn Phòng',
            'slug' => 'cach-chon-ghe-cong-thai-hoc-phu-hop-cho-dan-van-phong',
            'summary' => 'Làm việc 8 tiếng mỗi ngày trước màn hình máy tính có thể hủy hoại cột sống của bạn. Đây là hướng dẫn chi tiết cách chọn ghế tốt cho sức khỏe.',
            'content' => '<p>Đau mỏi vai gáy, thoát vị đĩa đệm là những căn bệnh phổ biến đối với dân văn phòng. Một chiếc ghế xoay công thái học chất lượng sẽ là giải pháp tối ưu giúp nâng đỡ cơ thể và ngăn ngừa các vấn đề cột sống.</p><h3>Các tiêu chí quan trọng khi chọn mua:</h3><ul><li><strong>Tựa đầu điều chỉnh linh hoạt:</strong> Giúp đỡ cổ khi mỏi mệt.</li><li><strong>Đệm tựa lưng hỗ trợ lumbar:</strong> Điểm tựa quan trọng bảo vệ thắt lưng.</li><li><strong>Bệ tỳ tay 3D/4D:</strong> Giúp vai không bị căng cứng khi gõ phím.</li><li><strong>Chất liệu lưới thoáng khí:</strong> Tránh nóng bức và êm ái khi ngồi lâu.</li></ul><p>NovaStore hiện đang phân phối các dòng ghế công thái học chuẩn Ergonomic chất lượng hàng đầu. Hãy liên hệ với chúng tôi để được tư vấn chiếc ghế phù hợp nhất!</p>',
            'image_url' => 'https://images.unsplash.com/photo-1505797149-43b0069ec26b?w=800&auto=format&fit=crop',
            'author' => 'Minh Tuấn'
        ]);
    }
}
