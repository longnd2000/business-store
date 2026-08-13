import { apiSlice } from './apiSlice';

export const categoriesSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
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
  }),
});

export const {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoriesSlice;
