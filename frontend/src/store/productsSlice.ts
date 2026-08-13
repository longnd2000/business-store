import { apiSlice } from './apiSlice';

export const productsSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
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
  }),
});

export const {
  useGetProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productsSlice;
