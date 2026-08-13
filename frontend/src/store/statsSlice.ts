import { apiSlice } from './apiSlice';

export const statsSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getStats: builder.query<any, void>({
      query: () => ({ url: '/admin/stats' }),
      providesTags: ['Stats'],
    }),
  }),
});

export const {
  useGetStatsQuery,
} = statsSlice;
