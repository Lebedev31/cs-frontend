import z from "zod";

export type PlanUnionLiteral = "oneWeek" | "twoWeeks" | "month" | "year";
export type ServiceUnionLiteral = "vip" | "top" | "color" | "balls";

export const generalSchema = z.object({
  serverIpPort: z
    .string()
    .trim()
    .min(1, { message: "Вы не указали ip и port" })
    .max(1000, { message: "Неправильные данные" }),
  offer: z.literal(true, { message: "Подвердите оферту" }),
  email: z.email({ message: "Укажите email для отправки чека" }),
  plan: z.enum(["oneWeek", "twoWeeks", "month", "year"], {
    message: "Укажите план",
  }),
  services: z.enum(["vip", "top", "color", "balls"], {
    message: "Укажите услугу",
  }),
});

export type VipValidationType = {
  serverIpPort: string;
  services: ServiceUnionLiteral;
  plan: PlanUnionLiteral;
  offer: boolean;
  email: string;
};

export type VipType = {
  serverIpPort: string;
  services: ServiceUnionLiteral;
  plan: PlanUnionLiteral;
  amount: number;
  email: string;
};

export const standardHexColors = [
  "#FF0000", // Красный
  "#00FF00", // Зеленый
  "#0000FF", // Синий
  "#FFFF00", // Желтый
  "#00FFFF", // Циан
  "#FF00FF", // Маджента
  "#FFFFFF", // Белый
  "#f8a50bff", // Оранжевый
];

export type ColorType = VipType & { color: string };
export type HexColorLiteral = (typeof standardHexColors)[number];

export const colorSchema = generalSchema.extend({
  color: z.enum(standardHexColors, { message: "Выберите цвет" }),
});

export type ColorValidation = VipValidationType & { color: HexColorLiteral };
