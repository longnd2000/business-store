import { apiSlice } from './apiSlice';

export const ordersSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
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
  }),
});

export const {
  useGetOrdersQuery,
  useUpdateOrderStatusMutation,
} = ordersSlice;
