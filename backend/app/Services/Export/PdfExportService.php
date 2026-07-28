<?php

namespace App\Services\Export;

/**
 * CONCRETE CLASS (Lớp cài đặt xuất PDF)
 */
class PdfExportService extends BaseExportService
{
    protected function getExtension(): string
    {
        return 'pdf';
    }

    protected function writeToFile(array $data, string $filePath): void
    {
        // Logic giả lập tạo PDF và ghi vào $filePath
        file_put_contents($filePath, "%PDF-1.4 " . json_encode($data));
    }
}
