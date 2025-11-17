import { ZodSchema } from "zod";
import { toast } from "react-toastify";
import { MessageServer, Game } from "@/types/type";

export type ValidationErrors<T> = Partial<Record<keyof T, string>> & {
  unionErrorForm?: string;
};

export function validateWithZod<T>(
  schema: ZodSchema<T>,
  data: T,
  setErrors: (errors: ValidationErrors<T>) => void
): boolean {
  const result = schema.safeParse(data);

  if (result.success) {
    // очистим ошибки
    setErrors({});
    return true;
  } else {
    const errors: ValidationErrors<T> = {};

    result.error.issues.forEach((issue) => {
      const field = issue.path[0] as keyof T;
      errors[field] = issue.message as ValidationErrors<T>[keyof T];
    });

    setErrors(errors);
    return false;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function handleToastError(error: any) {
  if (error?.data?.message) {
    toast.error(error.data.message);
  } else if (error?.message) {
    toast.error(error.message);
  } else {
    toast.error(error);
  }
}

export async function handleSubmit<T, Arg, ServerData>(
  e: React.FormEvent<HTMLFormElement>,
  setErrors: (errors: ValidationErrors<T>) => void,
  triger: (arg: Arg) => { unwrap: () => Promise<MessageServer<ServerData>> },
  formData: T,
  schema: ZodSchema<T>,
  arg: Arg,
  sucssessCallback?: (data: MessageServer<ServerData>) => void
) {
  e.preventDefault();

  const isValid = validateWithZod<T>(schema, formData, setErrors);
  if (!isValid) return;

  try {
    const result = await triger(arg).unwrap();
    sucssessCallback?.(result as MessageServer<ServerData>);
  } catch (error) {
    handleToastError(error);
  }
}

const MAP_IMAGES: Record<string, string> = {
  // Официальные карты
  de_dust2: "dust2.png",
  de_mirage: "mirage.png",
  de_inferno: "inferno.png",
  de_nuke: "nuke.jpg",
  de_vertigo: "vertigo.jpg",
  de_cache: "cache.png",
  de_dust: "dust2.png",
  de_shortdust: "dust2.png",
  de_ancient: "ancient.jpg",
  de_anubis: "anubis.png",
  de_overpass: "overpass.png",
  de_train: "train.png",

  // Hostage карты
  cs_office: "office.png",
  cs_italy: "italy.png",
  cs_2: "cs2.png",
  cs_agency: "agency.png",

  // Danger Zone
  dz_arctic: "mirage.png",

  // Кастомные AWP карты
  awp_lego_2: "awp_lego_2.png",
  awp_lego_anime_ap3: "awp_lego_2.png",
  awp_india: "awp_lego_2.png",
  awp_japan: "awp_lego_2.png",
  "awp_back&yellow": "awp_lego_2.png",

  // Другие популярные карты
  poolday: "poolday.jpg",
  de_safehouse: "mirage.png",
  de_calavera: "mirage.png",
  de_eldorado: "mirage.png",
  de_westwood: "mirage.png",
};

// Дефолтные картинки для игр
const DEFAULT_IMAGES: Record<Game, string> = {
  "CS:GO": "csgo.png",
  CS2: "cs2.png",
};

export const getMapImagePath = (
  mapName: string,
  game: Game = "CS2"
): string => {
  // Убираем префиксы и приводим к нижнему регистру
  const cleanMapName = mapName
    .replace(/^(workshop\/\d+\/|myrun\/|ampr\/)/, "")
    .toLowerCase()
    .trim();

  // Проверяем точное совпадение
  if (MAP_IMAGES[cleanMapName]) {
    return `/map/${MAP_IMAGES[cleanMapName]}`;
  }

  // Ищем базовое название карты (до первого _fps, _2x2, _dusk, _v и т.д.)
  const baseMapName = cleanMapName.split(
    /_(fps|2x2|dusk|anime|v\d+|br|my|bw\d+|neyter|mp|hdr)/
  )[0];

  if (MAP_IMAGES[baseMapName]) {
    return `/map/${MAP_IMAGES[baseMapName]}`;
  }

  // Проверяем префиксы для специальных режимов
  if (cleanMapName.startsWith("awp_")) {
    return "/map/awp_lego_2.png";
  }

  if (
    cleanMapName.startsWith("mg_") ||
    cleanMapName.startsWith("surf_") ||
    cleanMapName.startsWith("bhop_") ||
    cleanMapName.startsWith("jb_") ||
    cleanMapName.startsWith("ttt_") ||
    cleanMapName.startsWith("zm_") ||
    cleanMapName.includes("hp_")
  ) {
    return `/map/${DEFAULT_IMAGES[game]}`;
  }

  // Если ничего не найдено - возвращаем дефолтную картинку игры
  return `/map/${DEFAULT_IMAGES[game]}`;
};

export function getFormatData(createdAt: string) {
  const dateObj = new Date(createdAt);
  const isValidDate = !isNaN(dateObj.getTime());

  // Форматируем дату и время
  const formattedDate = isValidDate
    ? dateObj.toLocaleDateString("ru-RU", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "—";

  // Точное время: часы:минуты:секунды
  const formattedTime = isValidDate
    ? dateObj.toLocaleTimeString("ru-RU", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
    : "";

  return {
    formattedDate,
    formattedTime,
  };
}

export async function generateCodeVerifier(): Promise<string> {
  const array = new Uint8Array(64);
  crypto.getRandomValues(array);
  return btoa(String.fromCharCode(...Array.from(array)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "")
    .slice(0, 128); // trim to allowed length
}

async function sha256(plain: string) {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return new Uint8Array(hash);
}

export async function codeChallengeFromVerifier(verifier: string) {
  const hashed = await sha256(verifier);
  const base64 = btoa(String.fromCharCode(...hashed))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
  return base64;
}
