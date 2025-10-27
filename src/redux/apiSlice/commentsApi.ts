import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  MessageServer,
  Comment,
  CreateComment,
  PaginationComment,
} from "@/types/type";
import { apiUrl } from "../api.url";
export const commentsApi = createApi({
  reducerPath: "commentsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${apiUrl}comments`,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    createComment: builder.mutation<
      MessageServer<Comment[], { count: number }>,
      CreateComment
    >({
      query: (body) => ({
        url: "/create",
        method: "POST",
        body,
      }),
    }),

    getCommentsPagination: builder.query<
      MessageServer<Comment[], { count: number }>,
      PaginationComment
    >({
      query: (param) => ({
        method: "GET",
        url: "/pagination",
        params: {
          serverId: param.serverId,
          count: param.count,
          idComment: param.idComment,
        },
      }),
    }),

    getComments: builder.query<
      MessageServer<Comment[], { count: number }>,
      { serverId: string; count: number }
    >({
      query: (param) => ({
        method: "GET",
        url: "",
        params: {
          serverId: param.serverId,
          count: param.count,
        },
      }),
      keepUnusedDataFor: 0,
    }),
  }),
});
export const {
  useCreateCommentMutation,
  useLazyGetCommentsPaginationQuery,
  useGetCommentsQuery,
} = commentsApi;
