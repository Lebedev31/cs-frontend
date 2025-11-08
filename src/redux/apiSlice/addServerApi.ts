import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { apiUrl } from "../api.url";
import { MessageServer } from "@/types/type";
import { AddServerType } from "@/types/addServerType";

export const addServerApi = createApi({
  reducerPath: "addServerApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${apiUrl}my-server`,
    credentials: "include",
  }),

  endpoints: (builder) => ({
    addServer: builder.mutation<MessageServer<void>, AddServerType>({
      query: (body) => ({
        method: "POST",
        body,
        url: "",
      }),
    }),

    upadateServer: builder.mutation<MessageServer<void>, AddServerType>({
      query: (body) => ({
        method: "PATCH",
        body,
        url: "",
      }),
    }),

    getMyServers: builder.query<MessageServer<{ owner: string }>, void>({
      query: () => "",
    }),

    confirmServer: builder.mutation<MessageServer<void>, { serverId: string }>({
      query: (body) => ({
        url: "confirm-server",
        method: "PATCH",
        body,
      }),
    }),

    getServerIpPort: builder.query<MessageServer<string[]>, void>({
      query: () => "server-ip",
    }),
  }),
});

export const {
  useAddServerMutation,
  useGetMyServersQuery,
  useConfirmServerMutation,
  useGetServerIpPortQuery,
  useUpadateServerMutation,
} = addServerApi;
