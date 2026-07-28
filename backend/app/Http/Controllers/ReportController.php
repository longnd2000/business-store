<?php

namespace App\Http\Controllers;

use App\Services\Interfaces\IExportService;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    protected IExportService $exporter;

    /**
     * Dependency Injection: Type-hint INTERFACE thay vì Concrete Class
     */
    public function __construct(IExportService $exporter)
    {
        $this->exporter = $exporter;
    }

    public function exportReport(Request $request)
    {
        $sampleData = [
            ['ID', 'Tên Sản Phẩm', 'Giá'],
            [1, 'Áo Thun Nam', 150000],
            [2, 'Quần Jean', 350000],
        ];

        // Thực thi xuất file
        $filePath = $this->exporter->export($sampleData, 'report_ban_hang');

        return response()->json([
            'message' => 'Xuất file thành công!',
            'path'    => $filePath
        ]);
    }
}
