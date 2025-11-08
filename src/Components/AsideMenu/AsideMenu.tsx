"use client";

import styles from "./AsideMenu.module.scss";
import { useGetDataQuery } from "@/redux/apiSlice/csServerApi";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import {
  setSelectedServer,
  setServers,
  setOriginalServers,
} from "@/redux/slice/main.slice";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { AsideEndpointsUnion, GameServer } from "@/types/type";
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
  {
    key: "questions",
    label: "❓ Вопросы и ответы",
    type: "link",
    href: "/questions",
  },
];

export default function AsideMenu() {
  const dispatch: AppDispatch = useDispatch();
  const endpoint = useSelector((state: RootState) => state.main.selectedServer);
  const pathname = usePathname();
  const { data, isLoading } = useGetDataQuery(
    { endpoint },
    {
      pollingInterval: 50000,
      skipPollingIfUnfocused: true,
    }
  );

  const globalFilter = (servers: GameServer[]) => {
    const vipFilter = servers
      .filter((item) => item.service.vip.status)
      .sort(
        (a, b) =>
          b.rating +
          b.service.balls.listService.reduce(
            (acc, item) => acc + item.quantity,
            0
          ) -
          (a.rating +
            a.service.balls.listService.reduce(
              (acc, item) => acc + item.quantity,
              0
            ))
      );

    const notVipFilter = servers
      .filter((item) => !item.service.vip.status)
      .sort(
        (a, b) =>
          b.rating +
          b.service.balls.listService.reduce(
            (acc, item) => acc + item.quantity,
            0
          ) -
          (a.rating +
            a.service.balls.listService.reduce(
              (acc, item) => acc + item.quantity,
              0
            ))
      );

    return vipFilter.concat(notVipFilter);
  };
  useEffect(() => {
    if (data && data.data) {
      const rating = globalFilter(data.data);
      dispatch(setServers(rating));
      dispatch(setOriginalServers(rating));
    }
  }, [data, dispatch]);
  const handleApiClick = async (endpointName: AsideEndpointsUnion) => {
    try {
      dispatch(setSelectedServer(endpointName));
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
