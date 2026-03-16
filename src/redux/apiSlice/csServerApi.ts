import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { MessageServer, AsideEndpointsUnion, GameServer } from "@/types/type";
import { apiUrl } from "../api.url";

export const csServerApi = createApi({
  reducerPath: "csServerApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${apiUrl}server-list`,
  }),
  tagTypes: ["Server"], // ← добавить
  endpoints: (builder) => ({
    getData: builder.query<
      MessageServer<GameServer[]>,
      { endpoint: AsideEndpointsUnion }
    >({
      query: ({ endpoint }) => `${endpoint === "CS:GO" ? "cs-go" : "cs2"}`,
      providesTags: ["Server"], // ← добавить
    }),

    getServerById: builder.query<MessageServer<GameServer>, { id: string }>({
      query: ({ id }) => `/server/${id}`,
      providesTags: ["Server"], // ← добавить
    }),

    getMyServers: builder.query<MessageServer<GameServer[]>, void>({
      query: () => ({
        url: "my-servers",
        credentials: "include",
      }),
      providesTags: ["Server"], // ← добавить
    }),
  }),
});
export const {
  useLazyGetDataQuery,
  useGetDataQuery,
  useLazyGetServerByIdQuery,
  useGetMyServersQuery,
} = csServerApi;
