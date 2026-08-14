import { apiSlice } from './apiSlice';

export const newsSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAdminNews: builder.query<any[], { search?: string } | void>({
      query: (args) => ({
        url: '/admin/news',
        params: args && (args as { search?: string }).search
          ? { search: (args as { search?: string }).search }
          : undefined,
      }),
      providesTags: ['News'],
    }),
    createNews: builder.mutation<any, any>({
      query: (data) => ({
        url: '/admin/news',
        method: 'POST',
        data,
      }),
      invalidatesTags: ['News'],
    }),
    updateNews: builder.mutation<any, { id: number; data: any }>({
      query: ({ id, data }) => ({
        url: `/admin/news/${id}`,
        method: 'PUT',
        data,
      }),
      invalidatesTags: ['News'],
    }),
    deleteNews: builder.mutation<any, number>({
      query: (id) => ({
        url: `/admin/news/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['News'],
    }),
  }),
});

export const {
  useGetAdminNewsQuery,
  useCreateNewsMutation,
  useUpdateNewsMutation,
  useDeleteNewsMutation,
} = newsSlice;
