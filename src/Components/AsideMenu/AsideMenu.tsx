"use client";

import styles from "./AsideMenu.module.scss";
import {
  useLazyGetDataQuery,
  useGetDataQuery,
} from "@/redux/apiSlice/csServerApi";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import {
  setSelectedServer,
  setServers,
  setOriginalServers,
} from "@/redux/slice/main.slice";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { AsideEndpointsUnion } from "@/types/type";
import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// Тип для определения элемента меню
type MenuItem = {
  key: string;
  label: string;
  type: "api" | "link";
  href?: string;
};

const menuItems: MenuItem[] = [
  { key: "CS:GO", label: "🎮 CS GO", type: "api" },
  { key: "CS2", label: "🎮 CS2", type: "api" },
  {
    key: "addServer",
    label: "➕ Добавить сервер",
    type: "link",
    href: "/addServer",
  },
  {
    key: "premium",
    label: "💎 Раскрутка сервера",
    type: "link",
    href: "/premium",
  },
  { key: "faq", label: "❓ Вопросы и ответы", type: "link", href: "/faq" },
];

export default function AsideMenu() {
  const [trigger, { isLoading, data: triggerData }] = useLazyGetDataQuery();
  const dispatch: AppDispatch = useDispatch();
  const endpoint = useSelector((state: RootState) => state.main.selectedServer);
  const pathname = usePathname();
  const { data } = useGetDataQuery({ endpoint });

  useEffect(() => {
    if (triggerData && triggerData.data) {
      dispatch(setServers(triggerData.data));
      dispatch(setOriginalServers(triggerData.data));
    }

    if (data && data.data) {
      dispatch(setServers(data.data));
      dispatch(setOriginalServers(data.data));
    }
  }, [triggerData, data, dispatch]);

  // Функция-обработчик клика для API запросов
  const handleApiClick = async (endpointName: AsideEndpointsUnion) => {
    if (isLoading) return;

    try {
      dispatch(setSelectedServer(endpointName));
      await trigger({ endpoint: endpointName }).unwrap();
    } catch (error) {
      console.error(
        `[API ERROR] Не удалось загрузить данные для "${endpointName}":`,
        error
      );
    }
  };

  return (
    <nav className={styles.nav}>
      {menuItems.map((item) => {
        // Для API запросов
        if (item.type === "api") {
          return (
            <div
              key={item.key}
              className={`${styles.link} ${
                endpoint === item.key ? styles.active : ""
              } ${isLoading ? styles.loading : ""}`}
              onClick={() => handleApiClick(item.key as AsideEndpointsUnion)}
            >
              {item.label}
              {isLoading && endpoint === item.key && (
                <span className={styles.loader}> ⚡</span>
              )}
            </div>
          );
        }

        // Для навигации через Link
        return (
          <Link
            key={item.key}
            href={item.href!}
            className={`${styles.link} ${
              pathname === item.href ? styles.active : ""
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
