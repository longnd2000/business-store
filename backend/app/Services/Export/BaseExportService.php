<?php

namespace App\Services\Export;

use App\Services\Interfaces\IExportService;

/**
 * ABSTRACT CLASS: Lớp trừu tượng đóng vai trò "Bộ khung dùng chung"
 * - Không thể khởi tạo trực tiếp bằng 'new BaseExportService()'
 * - ĐƯỢC CHỨA thuộc tính (properties) và constructor
 * - ĐƯỢC CHỨA hàm có code xử lý chung (Concrete Methods)
 * - ĐƯỢC CHỨA hàm trừu tượng (Abstract Methods) để bắt buộc lớp con phải viết code xử lý riêng
 */
abstract class BaseExportService implements IExportService
{
    // 1. Thuộc tính dùng chung cho tất cả các class con
    protected string $storageDir;

    public function __construct()
    {
        $this->storageDir = storage_path('app/exports');
    }

    // 2. Concrete Method (Hàm có code sẵn): Định nghĩa quy trình xử lý chung (Template Method Pattern)
    public function export(array $data, string $filename): string
    {
        // Bước A: Làm sạch dữ liệu (dùng chung)
        $cleanData = $this->sanitizeData($data);

        // Bước B: Chuẩn bị thư mục lưu trữ (dùng chung)
        $this->prepareDirectory();

        // Bước C: Tạo đường dẫn file đầy đủ (dùng chung)
        $fullPath = $this->storageDir . '/' . $filename . '.' . $this->getExtension();

        // Bước D: Gọi hàm ghi file chi tiết (Lớp con BẮT BUỘC phải tự định nghĩa)
        $this->writeToFile($cleanData, $fullPath);

        return $fullPath;
    }

    // 3. Concrete Method: Hàm bổ trợ dùng chung
    protected function sanitizeData(array $data): array
    {
        return array_map('array_filter', $data);
    }

    protected function prepareDirectory(): void
    {
        if (!file_exists($this->storageDir)) {
            mkdir($this->storageDir, 0755, true);
        }
    }

    // 4. ABSTRACT METHODS: Hàm chưa có body {}, bắt buộc LỚP CON phải cài đặt
    abstract protected function getExtension(): string;
    abstract protected function writeToFile(array $data, string $filePath): void;
}
