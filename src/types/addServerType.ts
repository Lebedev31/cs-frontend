import { z } from "zod";

const ipPortSchema = z
  .string()
  .regex(
    /^(\d{1,3}\.){3}\d{1,3}:\d{1,5}$/,
    "Формат должен быть IP:Port (например, 192.168.1.1:27015)"
  )
  .refine((val) => {
    const [ip, port] = val.split(":");
    const octets = ip.split(".").map(Number);

    // Проверка IP (0-255)
    const validIp = octets.every((octet) => octet >= 0 && octet <= 255);

    // Проверка порта (1-65535)
    const validPort = Number(port) >= 1 && Number(port) <= 65535;

    return validIp && validPort;
  }, "Неверный IP или порт");

// Схемы валидации для социальных сетей
const vkSchema = z
  .string()
  .regex(/^https:\/\/(vk\.com|m\.vk\.com)\/.+$/, "Неверная ссылка VK")
  .optional()
  .or(z.literal(""));

const discordSchema = z
  .string()
  .regex(/^https:\/\/(www\.)?discord\.(gg|com)\/.+$/, "Неверная ссылка Discord")
  .optional()
  .or(z.literal(""));

const telegramSchema = z
  .string()
  .regex(/^https:\/\/(t\.me|telegram\.me)\/.+$/, "Неверная ссылка Telegram")
  .optional()
  .or(z.literal(""));

const tagsSchema = z.array(z.string()).optional().default([]);

// Полная схема формы с опциональным serverId
export const AddServerSchema = z.object({
  ipPort: ipPortSchema,
  game: z.string().min(1, "Выберите игру"),
  mod: z.string().min(1, "Выберите мод"),
  description: z
    .string()
    .max(600, "Максимальный размер описания 600 символов")
    .optional(),
  website: z.string().url("Неверный URL").optional().or(z.literal("")),
  vk: vkSchema,
  discord: discordSchema,
  telegram: telegramSchema,
  serverId: z.string().optional(),
  tags: tagsSchema,
});

export type AddServerType = z.infer<typeof AddServerSchema>;

// Схема для настроек: все поля опциональны, кроме serverId который обязателен
export const SettingSchema = AddServerSchema.partial().required({
  serverId: true,
});

export type SettingSchemaType = z.infer<typeof SettingSchema>;

// Union type для formData
export type ServerFormData = AddServerType | SettingSchemaType;
