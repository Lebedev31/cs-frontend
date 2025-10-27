import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Auth, MessageServer } from "@/types/type";
import { apiUrl } from "../api.url";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${apiUrl}auth`,
    credentials: "include",
  }),

  endpoints: (build) => ({
    auth: build.mutation<MessageServer<void>, Auth>({
      query: (body) => ({
        method: "POST",
        body,
        url: "",
      }),
    }),

    forgotPassword: build.mutation<MessageServer<undefined>, { email: string }>(
      {
        query: (body) => ({
          method: "POST",
          body,
          url: "/forgot-password",
        }),
      }
    ),

    createNewPassword: build.mutation<
      MessageServer<undefined>,
      { password: string; token: string }
    >({
      query: (body) => ({
        method: "POST",
        body,
        url: "/create-newPassword",
      }),
    }),

    logout: build.query<MessageServer<undefined>, void>({
      query: () => "/logout",
    }),
  }),
});

export const {
  useAuthMutation,
  useForgotPasswordMutation,
  useCreateNewPasswordMutation,
  useLazyLogoutQuery,
} = authApi;
