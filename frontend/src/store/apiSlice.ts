import { createApi, BaseQueryFn } from '@reduxjs/toolkit/query/react';
import api from '../utils/api';
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
  tagTypes: ['Stats', 'Orders', 'Products', 'Categories', 'Buyers'],
  endpoints: (builder) => ({
    getStats: builder.query<any, void>({
      query: () => ({ url: '/admin/stats' }),
      providesTags: ['Stats'],
    }),
    getOrders: builder.query<any[], { search?: string } | void>({
      query: (args) => ({
        url: '/admin/orders',
        params: args && (args as { search?: string }).search
          ? { search: (args as { search?: string }).search }
          : undefined,
      }),
      providesTags: ['Orders'],
    }),
    updateOrderStatus: builder.mutation<any, { id: number; status: string }>({
      query: ({ id, status }) => ({
        url: `/admin/orders/${id}/status`,
        method: 'PUT',
        data: { status },
      }),
      invalidatesTags: ['Orders', 'Stats', 'Buyers'],
    }),
    getProducts: builder.query<any[], { search?: string } | void>({
      query: (args) => ({
        url: '/admin/products',
        params: args && (args as { search?: string }).search
          ? { search: (args as { search?: string }).search }
          : undefined,
      }),
      providesTags: ['Products'],
    }),
    createProduct: builder.mutation<any, any>({
      query: (data) => ({
        url: '/admin/products',
        method: 'POST',
        data,
      }),
      invalidatesTags: ['Products', 'Stats'],
    }),
    updateProduct: builder.mutation<any, { id: number; data: any }>({
      query: ({ id, data }) => ({
        url: `/admin/products/${id}`,
        method: 'PUT',
        data,
      }),
      invalidatesTags: ['Products', 'Stats'],
    }),
    deleteProduct: builder.mutation<any, number>({
      query: (id) => ({
        url: `/admin/products/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Products', 'Stats'],
    }),
    getCategories: builder.query<any[], { search?: string } | void>({
      query: (args) => ({
        url: '/admin/categories',
        params: args && (args as { search?: string }).search
          ? { search: (args as { search?: string }).search }
          : undefined,
      }),
      providesTags: ['Categories'],
    }),
    createCategory: builder.mutation<any, any>({
      query: (data) => ({
        url: '/admin/categories',
        method: 'POST',
        data,
      }),
      invalidatesTags: ['Categories', 'Stats'],
    }),
    updateCategory: builder.mutation<any, { id: number; data: any }>({
      query: ({ id, data }) => ({
        url: `/admin/categories/${id}`,
        method: 'PUT',
        data,
      }),
      invalidatesTags: ['Categories', 'Products', 'Stats'],
    }),
    deleteCategory: builder.mutation<any, number>({
      query: (id) => ({
        url: `/admin/categories/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Categories', 'Products', 'Stats'],
    }),
    getBuyers: builder.query<any[], { search?: string } | void>({
      query: (args) => ({
        url: '/admin/buyers',
        params: args && (args as { search?: string }).search
          ? { search: (args as { search?: string }).search }
          : undefined,
      }),
      providesTags: ['Buyers'],
    }),
  }),
});

export const {
  useGetStatsQuery,
  useGetOrdersQuery,
  useUpdateOrderStatusMutation,
  useGetProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useGetBuyersQuery,
} = apiSlice;
