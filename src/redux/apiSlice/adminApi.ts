import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { MessageServer } from "@/types/type";
import { apiUrl } from "../api.url";
import { AddServerType } from "@/types/addServerType";
import { ServiceUnionLiteral, PlanUnionLiteral } from "@/types/service.type";

export type AuthAdmin = {
  login: string;
  password: string;
};

export type AdminStatistic = {
  users: number;
  servers: number;
  service: number;
};

export type AdminUsers = {
  userId: string;
  email: string;
  login: string;
  isBlocking: boolean;
  payment: {
    balance: number;
  };
};

export type AdminBalance = {
  newBalance: number | null;
};

export type AdminBlockingUser = {
  status: string;
};

export type AdminServerService = {
  vip: { status: boolean; term: string };
  top: { status: boolean; term: string };
  color: { status: boolean; term: string; colorName: string };
  balls: {
    status: boolean;
    listService: { _id: string; term: string; quantity: number }[];
  };
};

export type AdminServer = {
  _id: string;
  ip: string;
  port: string;
  service: AdminServerService;
};

export type AdminAddServicePayload = {
  serverId: string;
  services: ServiceUnionLiteral;
  plan: PlanUnionLiteral;
  color?: string;
  balls?: number;
};

export type AdminDeleteServicePayload = {
  serverId: string;
  service: ServiceUnionLiteral;
  ballsPackId?: string;
};

export type ServicePrices = {
  oneWeek: number;
  month: number;
  sixMonth: number;
  year: number;
};

export type AdminPrices = {
  vip: ServicePrices;
  top: ServicePrices;
  color: ServicePrices;
  balls: ServicePrices;
};

export type UpdatePricesPayload = {
  vip?: Partial<ServicePrices>;
  top?: Partial<ServicePrices>;
  color?: Partial<ServicePrices>;
};

export type AdminComment = {
  _id: string;
  description: string;
  createdAt: number;
  deletedUserName?: string | null;
  infoUser?: { login: string; avatarUrl?: string } | null;
};

export type AdminCommentsResponse = {
  comments: AdminComment[];
  idCommentsBlock: string;
};

export const adminApi = createApi({
  reducerPath: "adminApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${apiUrl}admin`,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("admin_token");
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),

  // Теги для инвалидации — серверов много, поэтому используем
  // оптимистичное обновление для услуг (быстрый отклик без рефетча),
  // для серверов целиком — тег-инвалидация (проще и надёжнее)
  // Добавить в tagTypes
  tagTypes: ["Servers", "Users", "Comments", "Prices", "Legal"],

  endpoints: (build) => ({
    authAdmin: build.mutation<MessageServer<string>, AuthAdmin>({
      query: (body) => ({ method: "POST", body, url: "/auth" }),
    }),

    getStatistic: build.query<MessageServer<AdminStatistic>, void>({
      query: () => ({ method: "GET", url: "/statistic" }),
    }),

    getUsers: build.query<MessageServer<AdminUsers[]>, void>({
      query: () => ({ method: "GET", url: "/users" }),
      providesTags: ["Users"],
    }),

    deleteUser: build.mutation<MessageServer<void>, { id: string }>({
      query: ({ id }) => ({ method: "DELETE", url: `/delete-user/${id}` }),
      invalidatesTags: ["Users"],
    }),

    updateBalance: build.mutation<
      MessageServer<AdminBalance>,
      { userId: string; newBalance: number }
    >({
      query: (body) => ({ method: "PATCH", body, url: "/update-balance" }),
    }),

    blocking: build.mutation<
      MessageServer<AdminBlockingUser>,
      { userId: string; block: boolean }
    >({
      query: (body) => ({ method: "PATCH", body, url: "/blocking" }),
      // Оптимистично обновляем статус блокировки в кеше
      onQueryStarted: async (
        { userId, block },
        { dispatch, queryFulfilled },
      ) => {
        const patch = dispatch(
          adminApi.util.updateQueryData("getUsers", undefined, (draft) => {
            if (!draft.data) return;
            const user = (draft.data as AdminUsers[]).find(
              (u) => u.userId === userId,
            );
            if (user) user.isBlocking = block;
          }),
        );
        try {
          await queryFulfilled;
        } catch {
          patch.undo();
        }
      },
    }),

    getServers: build.query<MessageServer<AdminServer[]>, void>({
      query: () => ({ method: "GET", url: "/servers" }),
      providesTags: ["Servers"],
    }),

    deleteServer: build.mutation<MessageServer<void>, { id: string }>({
      query: ({ id }) => ({ method: "DELETE", url: `/delete-server/${id}` }),
      // Оптимистично убираем сервер из списка
      onQueryStarted: async ({ id }, { dispatch, queryFulfilled }) => {
        const patch = dispatch(
          adminApi.util.updateQueryData("getServers", undefined, (draft) => {
            if (!draft.data) return;
            draft.data = (draft.data as AdminServer[]).filter(
              (s) => s._id !== id,
            );
          }),
        );
        try {
          await queryFulfilled;
        } catch {
          patch.undo();
        }
      },
    }),

    deleteComment: build.mutation<
      MessageServer<void>,
      { idCommentsBlock: string; idComment: string }
    >({
      query: (body) => ({ method: "PATCH", body, url: "/delete-comment" }),
    }),

    addService: build.mutation<MessageServer<void>, AdminAddServicePayload>({
      query: (body) => ({ method: "PATCH", body, url: "/add-service" }),
      // Оптимистичное обновление услуги на сервере
      onQueryStarted: async (
        { serverId, services, plan, color, balls },
        { dispatch, queryFulfilled },
      ) => {
        const planDaysMap: Record<PlanUnionLiteral, number> = {
          oneWeek: 7,
          month: 30,
          sixMonth: 180,
          year: 365,
        };
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + planDaysMap[plan]);
        const termIso = endDate.toISOString();

        const patch = dispatch(
          adminApi.util.updateQueryData("getServers", undefined, (draft) => {
            if (!draft.data) return;
            const server = (draft.data as AdminServer[]).find(
              (s) => s._id === serverId,
            );
            if (!server) return;

            // Use explicit branches (no indexed assignment) so TypeScript can infer property types
            if (services === "vip") {
              server.service.vip = { status: true, term: termIso };
            } else if (services === "top") {
              server.service.top = { status: true, term: termIso };
            } else if (services === "color" && color) {
              server.service.color = {
                status: true,
                term: termIso,
                colorName: color,
              };
            } else if (services === "balls" && balls) {
              server.service.balls.status = true;
              server.service.balls.listService.push({
                _id: `temp_${Date.now()}`,
                term: termIso,
                quantity: balls,
              });
            }
          }),
        );
        try {
          await queryFulfilled;
        } catch {
          patch.undo();
        }
      },
    }),

    deleteService: build.mutation<
      MessageServer<void>,
      AdminDeleteServicePayload
    >({
      query: (body) => ({ method: "PATCH", body, url: "/delete-service" }),
      // Оптимистично убираем услугу
      onQueryStarted: async (
        { serverId, service, ballsPackId },
        { dispatch, queryFulfilled },
      ) => {
        const patch = dispatch(
          adminApi.util.updateQueryData("getServers", undefined, (draft) => {
            if (!draft.data) return;
            const server = (draft.data as AdminServer[]).find(
              (s) => s._id === serverId,
            );
            if (!server) return;

            if (service === "balls" && ballsPackId) {
              server.service.balls.listService =
                server.service.balls.listService.filter(
                  (p) => p._id !== ballsPackId,
                );
              if (server.service.balls.listService.length === 0) {
                server.service.balls.status = false;
              }
            } else if (service === "color") {
              server.service.color = {
                status: false,
                term: new Date().toISOString(),
                colorName: "none",
              };
            } else if (service === "vip") {
              server.service.vip = {
                status: false,
                term: new Date().toISOString(),
              };
            } else if (service === "top") {
              server.service.top = {
                status: false,
                term: new Date().toISOString(),
              };
            }
          }),
        );
        try {
          await queryFulfilled;
        } catch {
          patch.undo();
        }
      },
    }),

    addServer: build.mutation<MessageServer<void>, AddServerType>({
      query: (body) => ({ method: "POST", body, url: "/add-server" }),
      invalidatesTags: ["Servers"],
    }),

    getPrices: build.query<MessageServer<AdminPrices>, void>({
      query: () => ({ method: "GET", url: "/prices" }),
      providesTags: ["Prices"],
    }),

    updatePrices: build.mutation<MessageServer<void>, UpdatePricesPayload>({
      query: (body) => ({ method: "PATCH", body, url: "/prices" }),
      // Оптимистичное обновление цен
      onQueryStarted: async (patch, { dispatch, queryFulfilled }) => {
        const update = dispatch(
          adminApi.util.updateQueryData("getPrices", undefined, (draft) => {
            if (!draft.data) return;
            for (const [service, plans] of Object.entries(patch)) {
              for (const [plan, price] of Object.entries(
                plans as Partial<ServicePrices>,
              )) {
                if (typeof price === "number") {
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  (draft.data as any)[service][plan] = price;
                }
              }
            }
          }),
        );
        try {
          await queryFulfilled;
        } catch {
          update.undo();
        }
      },
    }),

    getComments: build.query<
      MessageServer<AdminCommentsResponse>,
      { id: string }
    >({
      query: ({ id }) => ({
        method: "GET",
        url: `/comments/${id}`,
      }),
      providesTags: (_r, _e, { id }) => [{ type: "Comments", id: id }],
    }),
  }),
});

export const {
  useAuthAdminMutation,
  useGetStatisticQuery,
  useLazyGetUsersQuery,
  useDeleteUserMutation,
  useUpdateBalanceMutation,
  useBlockingMutation,
  useLazyGetServersQuery,
  useDeleteServerMutation,
  useDeleteCommentMutation,
  useAddServiceMutation,
  useDeleteServiceMutation,
  useAddServerMutation,
  useGetPricesQuery,
  useUpdatePricesMutation,
  useLazyGetCommentsQuery,
} = adminApi;
