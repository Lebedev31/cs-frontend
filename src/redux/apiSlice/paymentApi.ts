import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  FinHistory,
  MessageServer,
  Payment,
  RedirectYooCassa,
} from "@/types/type";
import { ColorType, VipType, BallsType } from "@/types/service.type";
import { apiUrl } from "../api.url";
import { csServerApi } from "./csServerApi";
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
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        await queryFulfilled;
        dispatch(csServerApi.util.invalidateTags(["Server"]));
      },
    }),

    getLimitTopService: builder.query<
      MessageServer<{ limit: number }>,
      { serverId: string }
    >({
      query: ({ serverId }) => `/limit-top/${serverId}`,
    }),

    updateServiceTop: builder.mutation<MessageServer<void>, VipType>({
      query: (body) => ({
        method: "PATCH",
        url: "/service/top",
        body,
      }),
      invalidatesTags: ["balance"],
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        await queryFulfilled;
        dispatch(csServerApi.util.invalidateTags(["Server"]));
      },
    }),

    updateServiceColor: builder.mutation<MessageServer<void>, ColorType>({
      query: (body) => ({
        method: "PATCH",
        url: "/service/color",
        body,
      }),
      invalidatesTags: ["balance"],
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        await queryFulfilled;
        dispatch(csServerApi.util.invalidateTags(["Server"]));
      },
    }),

    updateServiceBalls: builder.mutation<MessageServer<void>, BallsType>({
      query: (body) => ({
        method: "PATCH",
        url: "/service/balls",
        body,
      }),
      invalidatesTags: ["balance"],
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        await queryFulfilled;
        dispatch(csServerApi.util.invalidateTags(["Server"]));
      },
    }),

    getFinHistory: builder.query<MessageServer<FinHistory[]>, void>({
      query: () => "/fin-history",
    }),

    getPrice: builder.query<MessageServer<number[]>, { service: string }>({
      query: ({ service }) => `price/${service}`,
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
  useUpdateServiceBallsMutation,
  useGetFinHistoryQuery,
  useGetPriceQuery,
} = paymentApi;
