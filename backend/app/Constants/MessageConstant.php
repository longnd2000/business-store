<?php

namespace App\Constants;

class MessageConstant
{
    // General Messages
    public const GENERAL_UNAUTHORIZED = 'Yêu cầu không hợp lệ hoặc không có quyền truy cập.';
    public const GENERAL_NOT_FOUND = 'Không tìm thấy dữ liệu yêu cầu.';
    public const VALIDATION_FAILED = 'Dữ liệu đầu vào không hợp lệ.';

    // News / Articles Messages
    public const NEWS_NOT_FOUND = 'Bài viết không tồn tại.';
    public const NEWS_CREATE_SUCCESS = 'Tạo bài viết mới thành công!';
    public const NEWS_UPDATE_SUCCESS = 'Cập nhật bài viết thành công!';
    public const NEWS_DELETE_SUCCESS = 'Xóa bài viết thành công!';

    // Product Messages
    public const PRODUCT_NOT_FOUND = 'Sản phẩm không tồn tại.';
    public const PRODUCT_CREATE_SUCCESS = 'Thêm sản phẩm mới thành công!';
    public const PRODUCT_UPDATE_SUCCESS = 'Cập nhật sản phẩm thành công!';
    public const PRODUCT_DELETE_SUCCESS = 'Xóa sản phẩm thành công!';

    // Category Messages
    public const CATEGORY_NOT_FOUND = 'Danh mục không tồn tại.';
    public const CATEGORY_CREATE_SUCCESS = 'Tạo danh mục mới thành công!';
    public const CATEGORY_UPDATE_SUCCESS = 'Cập nhật danh mục thành công!';
    public const CATEGORY_DELETE_SUCCESS = 'Xóa danh mục thành công!';
}
