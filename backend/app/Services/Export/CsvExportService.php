<?php

namespace App\Services\Export;

/**
 * CONCRETE CLASS (Lớp cài đặt thực tế)
 * - Kế thừa (extends) từ BaseExportService
 * - BẮT BUỘC phải viết code cho 2 hàm abstract: getExtension() và writeToFile()
 */
class CsvExportService extends BaseExportService
{
    protected function getExtension(): string
    {
        return 'csv';
    }

    protected function writeToFile(array $data, string $filePath): void
    {
        $file = fopen($filePath, 'w');

        foreach ($data as $row) {
            fputcsv($file, $row);
        }

        fclose($file);
    }
}
