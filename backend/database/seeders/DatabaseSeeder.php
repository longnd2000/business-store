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
        // 0. Create Admin User in Database
        \App\Models\User::create([
            'name' => 'Admin LX',
            'email' => 'admin',
            'password' => \Illuminate\Support\Facades\Hash::make('abc123'),
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
    }
}
