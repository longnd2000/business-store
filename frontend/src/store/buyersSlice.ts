import { apiSlice } from './apiSlice';

export const buyersSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
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
  useGetBuyersQuery,
} = buyersSlice;
