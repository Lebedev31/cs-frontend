import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { User, MessageServer, ResultRecaptcha } from "@/types/type";
import { apiUrl } from "../api.url";

export const registrationApi = createApi({
  reducerPath: "registrationApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${apiUrl}register`,
  }),

  endpoints: (build) => ({
    register: build.mutation<
      MessageServer<undefined>,
      Omit<User, "confirmPassword">
    >({
      query: (body) => ({
        method: "POST",
        body,
        url: "/",
      }),
    }),

    recaptcha: build.mutation<
      MessageServer<ResultRecaptcha>,
      { token: string; type: string }
    >({
      query: (body: { token: string; type: string }) => ({
        method: "POST",
        body,
        url: "recaptcha",
      }),
    }),
  }),
});

export const { useRegisterMutation, useRecaptchaMutation } = registrationApi;
