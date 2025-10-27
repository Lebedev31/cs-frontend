import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { MessageServer, Payment, RedirectYooCassa } from "@/types/type";
import { apiUrl } from "../api.url";
export const paymentApi = createApi({
  reducerPath: "paymentApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${apiUrl}payment`,
    credentials: "include",
  }),
  tagTypes: ["balance"],
  endpoints: (builder) => ({
    createPayment: builder.mutation<
      MessageServer<RedirectYooCassa>,
      Payment & { description: string }
    >({
      query: (body) => ({
        method: "POST",
        url: "/create",
        body,
      }),

      invalidatesTags: ["balance"],
    }),

    getBalance: builder.query<MessageServer<number>, void>({
      query: () => "/balance",
      providesTags: ["balance"],
    }),
  }),
});
export const { useCreatePaymentMutation, useGetBalanceQuery } = paymentApi;
