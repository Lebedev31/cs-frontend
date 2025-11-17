import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { apiUrl } from "../api.url";
import {
  SettingAccount,
  MessageServer,
  SettingAccountWithoutUrl,
} from "@/types/type";

export const settingAccountApi = createApi({
  reducerPath: "settingAccountApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${apiUrl}setting`,
    credentials: "include",
  }),
  tagTypes: ["avatarUrl", "infoUser"],

  endpoints: (build) => ({
    getInfoUser: build.query<MessageServer<SettingAccount>, void>({
      query: () => "profile",
      providesTags: ["infoUser"],
    }),

    updateUserInfo: build.mutation<
      MessageServer<SettingAccountWithoutUrl>,
      SettingAccountWithoutUrl
    >({
      query: (body) => ({
        method: "PATCH",
        body,
        url: "update-email-or-login",
      }),

      invalidatesTags: ["infoUser"],
    }),
    updatePassword: build.mutation<
      MessageServer<void>,
      { password: string; oldPassword: string }
    >({
      query: (body) => ({
        method: "PATCH",
        body,
        url: "update-password",
      }),
    }),

    addAvatar: build.mutation<MessageServer<string>, { file: Blob }>({
      query: (body) => {
        const formData = new FormData();
        formData.append("file", body.file);
        return {
          method: "POST",
          body: formData,
          url: "file",
        };
      },
      invalidatesTags: ["avatarUrl"],
    }),

    getAvatarUrl: build.query<
      MessageServer<{ avatarUrl: string; login: string }>,
      void
    >({
      query: () => "avatar-url",
      providesTags: ["avatarUrl"],
      keepUnusedDataFor: 0,
    }),
  }),
});

export const {
  useGetInfoUserQuery,
  useUpdateUserInfoMutation,
  useAddAvatarMutation,
  useUpdatePasswordMutation,
  useGetAvatarUrlQuery,
} = settingAccountApi;
