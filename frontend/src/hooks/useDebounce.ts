import { useEffect, useState } from 'react';

/**
 * Custom hook dùng để debounce một giá trị (áp dụng cơ chế Macrotask Queue của Event Loop)
 * @param value Giá trị cần debounce (ví dụ: searchQuery)
 * @param delay Thời gian chờ (ms)
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Thiết lập một Macrotask (setTimeout) để cập nhật giá trị sau thời gian delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup function: Hủy timer cũ nếu value hoặc delay thay đổi liên tục
    // Tránh việc gọi cập nhật state quá nhiều lần
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
