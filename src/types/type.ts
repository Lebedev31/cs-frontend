import z from "zod";
export interface GameServer {
  id: string; // ip:port
  ip: string;
  port: string;
  name: string;
  map: string;
  players: number;
  maxPlayers: number;
  ping: number;
  lastUpdate: number;
  isOnline: boolean;
  owner?: string; // для привязки к пользователю
  isPromoted?: boolean; // платное продвижение
  heartbeatAt?: number; // когда последний раз сервер сам отписался
  mode: string;
  game: Game;
  playersList: { name: string; raw?: { score: number; time: number } }[];
  ownerLogin: string;
  country: string;
  serverId: string;
  vipServer: boolean;
  createdAt: string;
  rating: number;
  website: string;
  service: Service;
  description: string;
  vk: string;
  discord: string;
  telergam: string;
  tags: string[];
}

export interface Service {
  vip: {
    status: boolean;
    term: Date;
  };

  top: {
    status: boolean;
    term: Date;
  };

  color: {
    status: boolean;
    colorName: string;
    term: Date;
  };

  balls: {
    status: boolean;
    listService: { term: Date; quantity: number }[];
  };
}

export interface MessageServer<T, M = unknown> {
  data?: T;
  message: string;
  statusCode: number;
  meta?: M;
}

export type AsideEndpointsUnion =
  | "CS:GO"
  | "CS2"
  | "popular"
  | "new"
  | "add-server"
  | "premium"
  | "faq"
  | "contact";

// регистрация

export const UserSchema = z
  .object({
    login: z
      .string({ message: "Введите логин в правильном формате" })
      .trim()
      .min(8, "Логин должен содержать минимум 6 символов")
      .max(30, "Логин не может быть длиннее 30 символов"),
    email: z.email({ message: "Введите email в правильном формате" }),
    password: z
      .string({ message: "Пароль должен быть строкой" })
      .min(8, "Пароль должен содержать минимум 8 символов")
      .max(30, "Пароль не может быть длиннее 30 символов")
      .regex(/[a-zA-Z]/, {
        message: "Пароль должен содержать хотя бы одну латинскую букву (A-z).",
      })
      .regex(/[0-9]/, {
        message: "Пароль должен содержать хотя бы одну цифру (0-9).",
      }),

    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Пароли не совпадают",
    path: ["confirmPassword"],
  });

export type User = z.infer<typeof UserSchema>;

// аутентификация
export const AuthSchema = UserSchema.omit({
  login: true,
  confirmPassword: true,
});

export type Auth = z.infer<typeof AuthSchema>;

// email и password схемы
export const EmailSchema = AuthSchema.omit({
  password: true,
});

export const PasswordSchema = UserSchema.omit({
  login: true,
  email: true,
}).refine((data) => data.password === data.confirmPassword, {
  message: "Пароли не совпадают",
  path: ["confirmPassword"],
});

export type Email = z.infer<typeof EmailSchema>;
export type Password = z.infer<typeof PasswordSchema>;

// ответ recaptcha
export type ResultRecaptcha = {
  score: number | undefined;
  success: boolean;
};

// cхема settingAccount
export const SettingSchema = UserSchema.safeExtend({
  avatarUrl: z.string({ message: "Введите URL в правильном формате" }),
}).omit({
  password: true,
  confirmPassword: true,
});

// cхема SettingAccount без url

export const SettingSchemaWithoutUrl = SettingSchema.omit({
  avatarUrl: true,
});
export type SettingAccountWithoutUrl = z.infer<typeof SettingSchemaWithoutUrl>;
export type SettingAccount = z.infer<typeof SettingSchema>;
// схема обновления пароля
export const UpdatePasswordSchema = PasswordSchema.safeExtend({
  oldPassword: z
    .string({ message: "Пароль должен быть строкой" })
    .min(8, "Пароль должен содержать минимум 8 символов")
    .max(30, "Пароль не может быть длиннее 30 символов")
    .regex(/[a-zA-Z]/, {
      message: "Пароль должен содержать хотя бы одну латинскую букву (A-z).",
    })
    .regex(/[0-9]/, {
      message: "Пароль должен содержать хотя бы одну цифру (0-9).",
    }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Пароли не совпадают",
  path: ["confirmPassword"],
});

export type UpdatePassword = z.infer<typeof UpdatePasswordSchema>;

export type Game = "CS:GO" | "CS2";

export const PaymentSchema = z.object({
  amount: z
    .number({ message: "Введите число" })
    .positive({ message: "Сумма должна быть положительной" })
    .min(1, { message: "Минимальная сумма 1 рубль" })
    .max(1000000, { message: "Максимальная сумма 1000000 рублей" })
    .refine(
      (val) => Number.isFinite(val) && Math.round(val * 100) / 100 === val,
      { message: "Максимум 2 знака после запятой" }
    ),
});

export type Payment = z.infer<typeof PaymentSchema>;
export type RedirectYooCassa = {
  confirmation_url: string;
};

/// комментарии
export const CommentsSchema = z.object({
  description: z
    .string()
    .trim()
    .min(1, { message: "Комментарий не должен быть пустым" })
    .max(10000, { message: "Комментарий, не должен превышать 10000 символов" }),
});

export type CommentValidationForm = z.infer<typeof CommentsSchema>;
export type PaginationComment = {
  idComment: string;
  count: number;
  serverId: string;
};

export type CreateComment = CommentValidationForm & {
  serverId: string;
  createdAt: number;
};
export type Comment = {
  description: string;
  createdAt: string;
  infoUser: {
    avatarUrl: string;
    login: string;
  };

  _id: string;
};

export type FinHistory = {
  date: string;
  description: string;
  amount: number;
  status: "waiting_for_capture" | "succeeded" | "canceled" | "pending";
};

export const ContactsSchema = z.object({
  email: z.email({ message: "Введите email" }),
  name: z
    .string()
    .min(1, { message: "Введите имя" })
    .max(100, { message: "Максимальный размер имени 100 символов" }),
  description: z
    .string()
    .min(1, { message: "Введите текст сообщения" })
    .max(5000, { message: "Максимальный размер текста 5000 символов" }),
});

export type Contacts = z.infer<typeof ContactsSchema>;
