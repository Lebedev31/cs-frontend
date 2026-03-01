import { useState, useMemo } from "react";
import { AdminUsers, AdminServer } from "@/redux/apiSlice/adminApi";

type SearchMode = "users" | "servers";

/* Перегрузки */
export function useAdminSearch(
  mode: "users",
  data: AdminUsers[],
): {
  query: string;
  setQuery: (v: string) => void;
  filtered: AdminUsers[];
};

export function useAdminSearch(
  mode: "servers",
  data: AdminServer[],
): {
  query: string;
  setQuery: (v: string) => void;
  filtered: AdminServer[];
};

/* Реализация с явной сигнатурой возврата — объединение двух вариантов */
export function useAdminSearch(
  mode: SearchMode,
  data: AdminUsers[] | AdminServer[],
):
  | {
      query: string;
      setQuery: (v: string) => void;
      filtered: AdminUsers[];
    }
  | {
      query: string;
      setQuery: (v: string) => void;
      filtered: AdminServer[];
    } {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return data;

    if (mode === "users") {
      return (data as AdminUsers[]).filter((u) =>
        u.login.toLowerCase().includes(q),
      );
    } else {
      return (data as AdminServer[]).filter((s) =>
        `${s.ip}:${s.port}`.toLowerCase().includes(q),
      );
    }
  }, [query, data, mode]);

  return { query, setQuery, filtered } as
    | { query: string; setQuery: (v: string) => void; filtered: AdminUsers[] }
    | { query: string; setQuery: (v: string) => void; filtered: AdminServer[] };
}
