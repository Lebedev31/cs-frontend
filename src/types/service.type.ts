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
  "#FF000033", // Красный (20% непрозрачности)
  "#00FF0033", // Зеленый (20% непрозрачности)
  "#0000FF33", // Синий (20% непрозрачности)
  "#FFFF0033", // Желтый (20% непрозрачности)
  "#00FFFF33", // Циан (20% непрозрачности)
  "#FF00FF33", // Маджента (20% непрозрачности)
  "#FFFFFF33", // Белый (20% непрозрачности)
  "#f8a50b33", // Оранжевый (20% непрозрачности)
];

export type ColorType = VipType & { color: string };
export type HexColorLiteral = (typeof standardHexColors)[number];

export const colorSchema = generalSchema.extend({
  color: z.enum(standardHexColors, { message: "Выберите цвет" }),
});

export type ColorValidation = VipValidationType & { color: HexColorLiteral };

export type BallsValidation = VipValidationType & { balls: string };
export type BallsType = VipType & { balls: string };
export const ballsSchema = generalSchema.extend({
  balls: z.string(),
});

export type BoxShadowUnionType = "#ffd700" | "#ff4c4c" | "#4c8aff" | "#39ff14";
