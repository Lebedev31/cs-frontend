import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { MessageServer } from "@/types/type";
import { apiUrl } from "../api.url";

export type BannerData = {
  _id: string;
  imageUrl: string; // URL загруженного изображения
  linkUrl: string; // Куда ведёт клик
  expiresAt: string; // ISO-дата истечения
  isActive: boolean; // true если ещё не истёк
  impressions: number; // Показы
  clicks: number; // Клики
  ctr: number; // CTR в процентах (clicks / impressions * 100)
  createdAt: string;
};

export type CreateBannerPayload = {
  imageUrl: string;
  linkUrl: string;
  expiresAt: string; // ISO-строка
};

export type UpdateBannerPayload = Partial<CreateBannerPayload> & {
  id: string;
};

export const bannerApi = createApi({
  reducerPath: "bannerApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${apiUrl}banner`,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("admin_token");
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Banner"],
  endpoints: (build) => ({
    // --- ПУБЛИЧНЫЕ ---

    // Получить активный баннер для отображения на сайте
    getActiveBanner: build.query<MessageServer<BannerData | null>, void>({
      query: () => ({ method: "GET", url: "/active" }),
      providesTags: ["Banner"],
    }),

    // Зафиксировать показ
    trackImpression: build.mutation<MessageServer<void>, { id: string }>({
      query: ({ id }) => ({ method: "POST", url: `/impression/${id}` }),
    }),

    // Зафиксировать клик
    trackClick: build.mutation<MessageServer<void>, { id: string }>({
      query: ({ id }) => ({ method: "POST", url: `/click/${id}` }),
    }),

    // --- АДМИНСКИЕ ---

    // Список всех баннеров
    getAllBanners: build.query<MessageServer<BannerData[]>, void>({
      query: () => ({ method: "GET", url: "/all" }),
      providesTags: ["Banner"],
    }),

    // Создать баннер
    createBanner: build.mutation<
      MessageServer<BannerData>,
      CreateBannerPayload
    >({
      query: (body) => ({ method: "POST", body, url: "/" }),
      invalidatesTags: ["Banner"],
    }),

    // Загрузить изображение баннера (multipart/form-data)
    uploadBannerImage: build.mutation<MessageServer<{ url: string }>, FormData>(
      {
        query: (formData) => ({
          method: "POST",
          url: "/upload",
          body: formData,
        }),
      },
    ),

    // Удалить баннер
    deleteBanner: build.mutation<MessageServer<void>, { id: string }>({
      query: ({ id }) => ({ method: "DELETE", url: `/${id}` }),
      onQueryStarted: async ({ id }, { dispatch, queryFulfilled }) => {
        const patch = dispatch(
          bannerApi.util.updateQueryData(
            "getAllBanners",
            undefined,
            (draft) => {
              if (!draft.data) return;
              draft.data = (draft.data as BannerData[]).filter(
                (b) => b._id !== id,
              );
            },
          ),
        );
        try {
          await queryFulfilled;
        } catch {
          patch.undo();
        }
      },
    }),
  }),
});

export const {
  useGetActiveBannerQuery,
  useTrackImpressionMutation,
  useTrackClickMutation,
  useGetAllBannersQuery,
  useCreateBannerMutation,
  useUploadBannerImageMutation,
  useDeleteBannerMutation,
} = bannerApi;
