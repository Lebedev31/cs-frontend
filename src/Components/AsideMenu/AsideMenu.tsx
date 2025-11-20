"use client";

import styles from "./AsideMenu.module.scss";
import { useGetDataQuery } from "@/redux/apiSlice/csServerApi";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import {
  setSelectedServer,
  setServers,
  setOriginalServers,
} from "@/redux/slice/main.slice";
import { AsideEndpointsUnion, GameServer } from "@/types/type";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type MenuItem = {
  key: string;
  label: string;
  type: "api" | "link";
  href: string;
};

const menuItems: MenuItem[] = [
  { key: "CS:GO", label: "🎮 CS GO", type: "api", href: "/server-list" },
  { key: "CS2", label: "🎮 CS2", type: "api", href: "/server-list" },
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
  const selectedServer = useSelector(
    (state: RootState) => state.main.selectedServer
  );

  console.log(selectedServer);
  const pathname = usePathname();

  // 1. Флаг: "Прочитали ли мы уже настройки?"
  const [isInitialized, setIsInitialized] = useState(false);

  // 2. При маунте читаем localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedType = localStorage.getItem(
        "typeGame"
      ) as AsideEndpointsUnion | null;

      if (savedType && (savedType === "CS:GO" || savedType === "CS2")) {
        // Если в памяти другое значение, чем в сторе - обновляем
        if (savedType !== selectedServer) {
          dispatch(setSelectedServer(savedType));
        }
      }
    }
    // 3. Сообщаем, что инициализация завершена
    setIsInitialized(true);
  }, [dispatch]); // selectedServer специально убран из зависимостей, чтобы не вызывать лишних циклов

  const { data, isLoading } = useGetDataQuery(
    { endpoint: selectedServer as AsideEndpointsUnion },
    {
      pollingInterval: 50000,
      skipPollingIfUnfocused: true,
    }
  );

  const globalFilter = (servers: GameServer[]) => {
    const calcScore = (item: GameServer) =>
      item.rating +
      item.service.balls.listService.reduce((acc, i) => acc + i.quantity, 0);

    const vipFilter = servers
      .filter((item) => item.service.vip.status)
      .sort((a, b) => calcScore(b) - calcScore(a));

    const notVipFilter = servers
      .filter((item) => !item.service.vip.status)
      .sort((a, b) => calcScore(b) - calcScore(a));

    return vipFilter.concat(notVipFilter);
  };

  useEffect(() => {
    if (data && data.data) {
      const rating = globalFilter(data.data);
      dispatch(setServers(rating));
      dispatch(setOriginalServers(rating));
    }
  }, [data, dispatch]);

  const handleGameClick = (key: string) => {
    const gameKey = key as AsideEndpointsUnion;
    dispatch(setSelectedServer(gameKey));
    localStorage.setItem("typeGame", gameKey);
  };

  return (
    <nav className={styles.nav}>
      {menuItems.map((item) => {
        if (item.type === "api") {
          // 4. Ключевое изменение:
          // Мы считаем кнопку активной ТОЛЬКО если прошла инициализация (isInitialized).
          // До этого момента isActive будет false, и "скачка" анимации не будет.
          const isActive =
            isInitialized &&
            pathname === item.href &&
            selectedServer === item.key;

          return (
            <Link key={item.key} href={item.href}>
              <div
                className={`${styles.link} ${isActive ? styles.active : ""} ${
                  // Лоадер показываем, только если это активная вкладка
                  isLoading && isActive ? styles.loading : ""
                }`}
                onClick={() => handleGameClick(item.key)}
              >
                {item.label}
                {isLoading && isActive && (
                  <span className={styles.loader}> ⚡</span>
                )}
              </div>
            </Link>
          );
        }

        // Для обычных ссылок задержка не нужна
        const isLinkActive = pathname === item.href;

        return (
          <Link
            key={item.key}
            href={item.href}
            className={`${styles.link} ${isLinkActive ? styles.active : ""}`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
