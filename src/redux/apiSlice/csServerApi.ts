import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { MessageServer, AsideEndpointsUnion, GameServer } from "@/types/type";
import { apiUrl } from "../api.url";
export const csServerApi = createApi({
  reducerPath: "csServerApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${apiUrl}server-list`, // Replace with your actual base URL
  }),
  endpoints: (builder) => ({
    getData: builder.query<
      MessageServer<GameServer[]>,
      { endpoint: AsideEndpointsUnion }
    >({
      query: ({ endpoint }) => `${endpoint === "CS:GO" ? "cs-go" : "cs2"}`,
    }),

    getServerById: builder.query<MessageServer<GameServer>, { id: string }>({
      query: ({ id }) => `server/${id}`,
    }),
  }),
});
export const {
  useLazyGetDataQuery,
  useGetDataQuery,
  useLazyGetServerByIdQuery,
} = csServerApi;
