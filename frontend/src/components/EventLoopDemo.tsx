import { useState, useRef } from 'react';

interface LogEntry {
  type: 'sync' | 'micro' | 'macro' | 'system';
  message: string;
  timestamp: string;
}

export default function EventLoopDemo() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isComputing, setIsComputing] = useState<boolean>(false);
  const [spinnerActive, setSpinnerActive] = useState<boolean>(false);
  const progressRef = useRef<number>(0);

  const addLog = (message: string, type: LogEntry['type']) => {
    const time = new Date().toLocaleTimeString() + '.' + String(new Date().getMilliseconds()).padStart(3, '0');
    setLogs((prev) => [...prev, { type, message, timestamp: time }]);
  };

  const clearLogs = () => {
    setLogs([]);
    progressRef.current = 0;
  };

  // Test 1: Order Demo
  const runOrderDemo = () => {
    clearLogs();
    addLog('BẮT ĐẦU: Click Button event handler (được đẩy vào Call Stack)', 'system');

    // 1. Call Stack
    addLog('1. Call Stack: Đoạn code đồng bộ thứ nhất', 'sync');

    // 2. Macrotask (setTimeout)
    setTimeout(() => {
      addLog('4. Macrotask Queue: Callback của setTimeout (0ms) chạy!', 'macro');
    }, 0);

    // 3. Microtask (Promise)
    Promise.resolve().then(() => {
      addLog('3. Microtask Queue: Callback của Promise.then() chạy!', 'micro');
    });

    // 4. Call Stack
    addLog('2. Call Stack: Đoạn code đồng bộ thứ hai (kết thúc event handler)', 'sync');
    addLog('KẾT THÚC: Call Stack rỗng. Bây giờ Event Loop bắt đầu duyệt Microtask rồi tới Macrotask...', 'system');
  };

  // Test 2: Blocking Loop (UI đơ)
  const runBlockingLoop = () => {
    clearLogs();
    setIsComputing(true);
    setSpinnerActive(true);
    
    // Sử dụng setTimeout nhỏ để cập nhật UI log BẮT ĐẦU trước khi chạy đồng bộ nặng làm đơ luồng
    setTimeout(() => {
      addLog('BẮT ĐẦU: Chạy vòng lặp đồng bộ nặng (Blocking)...', 'system');
      
      const start = performance.now();
      let count = 0;
      // Vòng lặp nặng làm đơ luồng chính
      for (let i = 0; i < 2_000_000_000; i++) {
        count += Math.sqrt(i);
      }
      const end = performance.now();

      addLog(`KẾT THÚC: Tính toán xong sau ${(end - start).toFixed(2)}ms. Kết quả: ${count.toFixed(0)}`, 'sync');
      setIsComputing(false);
      setSpinnerActive(false);
    }, 100);
  };

  // Test 3: Non-blocking Loop (Cắt nhỏ tác vụ bằng Event Loop)
  const runNonBlockingLoop = () => {
    clearLogs();
    setIsComputing(true);
    setSpinnerActive(true);
    addLog('BẮT ĐẦU: Chạy tính toán nặng nhưng cắt nhỏ bằng setTimeout (Non-blocking)', 'system');

    const totalIterations = 2_000_000_000;
    const chunkSize = 50_000_000; // Mỗi chunk chạy khoảng 15-30ms để tránh giật lag
    let currentIteration = 0;
    let count = 0;
    const start = performance.now();

    const processChunk = () => {
      const chunkEnd = Math.min(currentIteration + chunkSize, totalIterations);
      for (let i = currentIteration; i < chunkEnd; i++) {
        count += Math.sqrt(i);
      }
      currentIteration = chunkEnd;
      progressRef.current = Math.floor((currentIteration / totalIterations) * 100);

      // Nếu chưa xong, hoãn phần tiếp theo vào Macrotask Queue (setTimeout) để giải phóng Main Thread
      if (currentIteration < totalIterations) {
        // Nhường Main Thread cho trình duyệt render spinner và nhận tương tác
        setTimeout(processChunk, 0);
      } else {
        const end = performance.now();
        addLog(`KẾT THÚC: Tính toán xong sau ${(end - start).toFixed(2)}ms. Kết quả: ${count.toFixed(0)}`, 'sync');
        setIsComputing(false);
        setSpinnerActive(false);
      }
    };

    // Bắt đầu chunk đầu tiên
    processChunk();
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-slate-900 text-slate-100 rounded-2xl shadow-xl space-y-6 text-left border border-slate-800">
      <div>
        <h2 className="text-2xl font-bold text-violet-400 m-0">Event Loop Demo & Application</h2>
        <p className="text-slate-400 text-sm mt-1">Trực quan hóa hoạt động của Call Stack, Microtask, Macrotask và cách tối ưu giao diện không bị giật lag.</p>
      </div>

      {/* Control Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={runOrderDemo}
          disabled={isComputing}
          className="px-4 py-3 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white font-semibold rounded-xl transition-all cursor-pointer shadow-lg shadow-violet-900/30"
        >
          1. Thứ tự Chạy (Event Loop Order)
        </button>

        <button
          onClick={runBlockingLoop}
          disabled={isComputing}
          className="px-4 py-3 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-semibold rounded-xl transition-all cursor-pointer shadow-lg shadow-rose-900/30"
        >
          2. Vòng lặp Nặng (Blocking UI)
        </button>

        <button
          onClick={runNonBlockingLoop}
          disabled={isComputing}
          className="px-4 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold rounded-xl transition-all cursor-pointer shadow-lg shadow-emerald-900/30"
        >
          3. Vòng lặp Tối ưu (Yielding UI)
        </button>
      </div>

      {/* Visual Indicator of Thread Responsiveness */}
      <div className="flex items-center space-x-4 p-4 bg-slate-800 rounded-xl border border-slate-700">
        <div className="flex items-center space-x-2">
          {/* A CSS Spinner that freezes if the thread blocks */}
          <div className={`w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full ${spinnerActive ? 'animate-spin' : ''}`}></div>
          <span className="text-sm font-semibold">Trạng thái Main Thread:</span>
        </div>
        <div className="flex-1">
          {spinnerActive ? (
            <span className="text-amber-400 text-xs font-semibold animate-pulse">
              {isComputing && progressRef.current > 0
                ? `Đang tính toán ngầm... ${progressRef.current}% (Giao diện vẫn mượt!)`
                : 'Đang chạy đồng bộ... (Spinner bên trái sẽ BỊ ĐƠ hoàn toàn trong vài giây!)'}
            </span>
          ) : (
            <span className="text-slate-400 text-xs">Đang rảnh rỗi (Idle)</span>
          )}
        </div>
      </div>

      {/* Logs Console */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm font-semibold text-slate-300">Console Logs Output:</span>
          <button onClick={clearLogs} className="text-xs text-violet-400 hover:underline cursor-pointer bg-transparent border-0">Xóa logs</button>
        </div>
        <div className="h-64 bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs overflow-y-auto space-y-1.5 scrollbar-thin scrollbar-thumb-slate-800">
          {logs.length === 0 && (
            <div className="text-slate-600 text-center py-20 italic">Click vào các nút ở trên để xem Event Loop thực thi...</div>
          )}
          {logs.map((log, index) => {
            let color = 'text-slate-300';
            if (log.type === 'sync') color = 'text-sky-400';
            if (log.type === 'micro') color = 'text-violet-400 font-bold';
            if (log.type === 'macro') color = 'text-amber-400 font-bold';
            if (log.type === 'system') color = 'text-emerald-400 italic';

            return (
              <div key={index} className="flex space-x-2 border-b border-slate-900/50 pb-1">
                <span className="text-slate-600">[{log.timestamp}]</span>
                <span className={color}>{log.message}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Educational Explanation Box */}
      <div className="p-4 bg-slate-950/50 border border-slate-800 rounded-xl space-y-2 text-xs text-slate-400">
        <h4 className="font-bold text-slate-300 m-0">Giải thích nguyên lý Event Loop qua ví dụ trên:</h4>
        <ul className="list-disc pl-4 space-y-1">
          <li><strong>Nút 1 (Order):</strong> Thấy rõ Call Stack chạy xong (1 & 2), sau đó Microtask Queue (3 - Promise) chạy trước, rồi mới tới Macrotask Queue (4 - setTimeout) dù set thời gian delay là 0ms.</li>
          <li><strong>Nút 2 (Blocking):</strong> Chạy vòng lặp đồng bộ nặng 2 tỷ lần chiếm dụng luồng chính. Spinner vòng tròn bên trái bị **đóng băng (freeze)** hoàn toàn trong vài giây vì luồng chính bị nghẽn, không thể vẽ lại (repaint) giao diện.</li>
          <li><strong>Nút 3 (Yielding):</strong> Chia nhỏ 2 tỷ lần tính toán thành các khối nhỏ (chunk) 50 triệu lần và dùng <code className="bg-slate-800 text-slate-300 px-1 rounded">setTimeout(processChunk, 0)</code>. Sau mỗi chunk, trình duyệt giải phóng luồng chính để vẽ lại giao diện (spinner vẫn quay mượt mà) rồi mới thực thi tiếp chunk tiếp theo.</li>
        </ul>
      </div>
    </div>
  );
}
