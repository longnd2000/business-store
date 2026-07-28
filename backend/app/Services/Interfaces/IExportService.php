<?php

namespace App\Services\Interfaces;

/**
 * INTERFACE: Chỉ định nghĩa "CÁI GÌ" (WHAT) cần phải có.
 * - KHÔNG chứa thuộc tính (properties)
 * - KHÔNG chứa code xử lý (method body {})
 * - Chỉ khai báo tên hàm, tham số và kiểu dữ liệu trả về
 */
interface IExportService
{
    /**
     * Xuất dữ liệu ra file
     *
     * @param array $data Dữ liệu cần xuất
     * @param string $filename Tên file mong muốn
     * @return string Trả về đường dẫn file sau khi xuất
     */
    public function export(array $data, string $filename): string;
}
