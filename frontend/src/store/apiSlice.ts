import { createApi, BaseQueryFn } from '@reduxjs/toolkit/query/react';
import api from '../services/api';
import { AxiosRequestConfig, AxiosError } from 'axios';

const axiosBaseQuery = (): BaseQueryFn<
  {
    url: string;
    method?: AxiosRequestConfig['method'];
    data?: AxiosRequestConfig['data'];
    params?: AxiosRequestConfig['params'];
  },
  unknown,
  unknown
> =>
  async ({ url, method = 'GET', data, params }) => {
    try {
      const result = await api({ url, method, data, params });
      return { data: result.data };
    } catch (axiosError) {
      const err = axiosError as AxiosError;
      return {
        error: {
          status: err.response?.status,
          data: err.response?.data || err.message,
        },
      };
    }
  };

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Stats', 'Orders', 'Products', 'Categories', 'Buyers', 'News'],
  endpoints: () => ({}),
});
