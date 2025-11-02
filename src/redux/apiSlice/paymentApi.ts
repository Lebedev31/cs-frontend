import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { MessageServer, Payment, RedirectYooCassa } from "@/types/type";
import { ColorType, VipType } from "@/types/service.type";
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

    updateServiceVip: builder.mutation<MessageServer<void>, VipType>({
      query: (body) => ({
        method: "PATCH",
        url: "/service/vip",
        body,
      }),
      invalidatesTags: ["balance"],
    }),

    getLimitTopService: builder.query<MessageServer<{ limit: number }>, void>({
      query: () => "/limit-top",
    }),

    updateServiceTop: builder.mutation<MessageServer<void>, VipType>({
      query: (body) => ({
        method: "PATCH",
        url: "/service/top",
        body,
      }),
      invalidatesTags: ["balance"],
    }),

    updateServiceColor: builder.mutation<MessageServer<void>, ColorType>({
      query: (body) => ({
        method: "PATCH",
        url: "/service/color",
        body,
      }),
      invalidatesTags: ["balance"],
    }),
  }),
});
export const {
  useCreatePaymentMutation,
  useGetBalanceQuery,
  useUpdateServiceVipMutation,
  useGetLimitTopServiceQuery,
  useUpdateServiceTopMutation,
  useUpdateServiceColorMutation,
} = paymentApi;
