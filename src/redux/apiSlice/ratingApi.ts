import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { apiUrl } from "../api.url";
import { MessageServer } from "@/types/type";

export const ratingApi = createApi({
  reducerPath: "ratingApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${apiUrl}rating`,
    credentials: "include",
  }),

  endpoints: (builder) => ({
    increaseRating: builder.mutation<
      MessageServer<{ rating: number }>,
      { serverId: string }
    >({
      query: (body: { serverId: string }) => ({
        method: "PATCH",
        body,
        url: "",
      }),
    }),
  }),
});

export const { useIncreaseRatingMutation } = ratingApi;
