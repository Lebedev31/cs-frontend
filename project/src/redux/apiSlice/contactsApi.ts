import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Contacts, MessageServer } from "@/types/type";
import { apiUrl } from "../api.url";

export const contactsApi = createApi({
  reducerPath: "contsctsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${apiUrl}contacts`,
  }),

  endpoints: (build) => ({
    message: build.mutation<MessageServer<void>, Contacts>({
      query: (body) => ({
        method: "POST",
        body,
        url: "",
      }),
    }),
  }),
});

export const { useMessageMutation } = contactsApi;
