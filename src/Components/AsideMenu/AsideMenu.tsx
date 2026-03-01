"use client";

import styles from "./AsideMenu.module.scss";
import { useGetDataQuery } from "@/redux/apiSlice/csServerApi";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import {
  setSelectedServer,
  setServers,
  setOriginalServers,
  setIsLoadingServers,
} from "@/redux/slice/main.slice";
import { AsideEndpointsUnion, GameServer } from "@/types/type";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

type MenuItem = {
  key: string;
  label: string;
  icon?: string;
  type: "api" | "link";
  href: string;
};

const menuItems: MenuItem[] = [
  {
    key: "CS:GO",
    label: "CS GO",
    icon: "/csgo-icon-2.png",
    type: "api",
    href: "/server-list/csgo",
  },
  {
    key: "CS2",
    label: "CS2",
    icon: "/cs2_ico.jpg",
    type: "api",
    href: "/server-list/cs2",
  },
  {
    key: "addServer",
    label: "➕ Добавить сервер",
    type: "link",
    href: "/addServer",
  },
  {
    key: "premium",
    label: "🛒 Раскрутка сервера",
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

type Props = {
  onLinkClick?: () => void;
};

export default function AsideMenu({ onLinkClick }: Props) {
  const dispatch: AppDispatch = useDispatch();
  const selectedServer = useSelector(
    (state: RootState) => state.main.selectedServer,
  );
  const pathname = usePathname();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedType = localStorage.getItem(
        "typeGame",
      ) as AsideEndpointsUnion | null;

      if (savedType && (savedType === "CS:GO" || savedType === "CS2")) {
        if (savedType !== selectedServer) {
          dispatch(setSelectedServer(savedType));
        }
      }
    }
    setIsInitialized(true);
  }, [dispatch]);

  const { data, isLoading } = useGetDataQuery(
    { endpoint: selectedServer as AsideEndpointsUnion },
    {
      pollingInterval: 50000,
      skipPollingIfUnfocused: true,
    },
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
    dispatch(setIsLoadingServers(isLoading));
    if (data && data.data) {
      const rating = globalFilter(data.data);
      dispatch(setServers(rating));
      dispatch(setOriginalServers(rating));
      dispatch(setIsLoadingServers(isLoading));
    }
  }, [data, dispatch, isLoading]);

  const handleGameClick = (key: string) => {
    const gameKey = key as AsideEndpointsUnion;
    dispatch(setSelectedServer(gameKey));
    localStorage.setItem("typeGame", gameKey);
    onLinkClick?.();
  };

  const renderContent = (item: MenuItem, isActive: boolean) => (
    <>
      <div className={styles.contentWrapper}>
        {item.icon && (
          <Image
            src={item.icon}
            alt={item.label}
            width={20}
            height={20}
            className={styles.menuIcon}
            priority
            unoptimized
          />
        )}
        <span>{item.label}</span>
      </div>
      {item.type === "api" && isLoading && isActive && (
        <span className={styles.loader}>⚡</span>
      )}
    </>
  );

  return (
    <nav className={styles.nav}>
      {menuItems.map((item) => {
        if (item.type === "api") {
          const isActive =
            isInitialized &&
            pathname === item.href &&
            selectedServer === item.key;

          return (
            <Link
              key={item.key}
              href={item.href}
              style={{ textDecoration: "none" }}
            >
              <div
                className={`${styles.link} ${isActive ? styles.active : ""} ${
                  isLoading && isActive ? styles.loading : ""
                }`}
                onClick={() => handleGameClick(item.key)}
              >
                {renderContent(item, isActive)}
              </div>
            </Link>
          );
        }

        const isLinkActive = pathname === item.href;

        return (
          <Link
            key={item.key}
            href={item.href}
            className={`${styles.link} ${isLinkActive ? styles.active : ""}`}
            onClick={onLinkClick}
          >
            {renderContent(item, isLinkActive)}
          </Link>
        );
      })}
    </nav>
  );
}
