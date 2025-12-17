"use client";
import styles from "./MyServers.module.scss";
import Link from "next/link";
import { useGetMyServersQuery } from "@/redux/apiSlice/csServerApi";
import React, { useState, useMemo } from "react";
import { Game } from "@/types/type";
import ServerBlockItem from "@/Components/UpdateBlock/ServerBlockItem/ServerBlockItem";
import Modal from "./Modal/Modal";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import Pagination from "@/Components/Pagination/Pagination";
import PremiumServerList from "./PremiumServerList/PremiumServerList";

export default function MyServers() {
  const [onClose, setOnClose] = useState<boolean>(false);
  const [serverId, setServerId] = useState<string>("");
  const { data, isLoading } = useGetMyServersQuery();

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  // Получаем активный таб из URL или устанавливаем "all" по умолчанию
  const activeTab =
    (searchParams.get("tab") as "all" | Game | "premium") || "all";

  // Получаем текущую страницу из URL
  const currentPage = Number(searchParams.get("page")) || 1;
  const serversPerPage = 10;

  // Фильтруем серверы по табу
  const filteredServers = useMemo(() => {
    if (!data?.data || isLoading) {
      return [];
    }

    if (activeTab === "all") {
      return data.data;
    }

    if (activeTab === "premium") {
      return data.data.filter((item) => {
        const svc = item.service;
        if (!svc) return false;
        return (
          !!svc.vip?.status ||
          !!svc.top?.status ||
          !!svc.color?.status ||
          !!svc.balls?.status
        );
      });
    }

    return data.data.filter((item) => item.game === activeTab);
  }, [data, activeTab, isLoading]);

  // Применяем пагинацию к отфильтрованным серверам
  const indexOfLastServer = currentPage * serversPerPage;
  const indexOfFirstServer = indexOfLastServer - serversPerPage;
  const currentServers = filteredServers.slice(
    indexOfFirstServer,
    indexOfLastServer
  );

  // Функция для смены таба
  const handleTabChange = (tab: "all" | Game | "premium") => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tab);
    params.set("page", "1"); // Сбрасываем на первую страницу при смене таба
    router.push(`${pathname}?${params.toString()}`);
  };

  // Функция для смены страницы
  const paginate = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", pageNumber.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className={styles.myServers}>
      {onClose ? (
        <Modal onClose={setOnClose} isOpen={onClose} serverId={serverId} />
      ) : null}
      <h1 className={styles.title}>Ваши сервера</h1>
      <div className={styles.button_block}>
        <Link href="/addServer">
          <button className={styles.addServer}>Добавить сервер</button>
        </Link>
      </div>
      <div className={styles.servers_block}>
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${
              activeTab === "all" ? styles.tab_active : ""
            }`}
            onClick={() => handleTabChange("all")}
          >
            Все сервера
          </button>
          <button
            className={`${styles.tab} ${
              activeTab === "CS:GO" ? styles.tab_active : ""
            }`}
            onClick={() => handleTabChange("CS:GO")}
          >
            CS:GO
          </button>
          <button
            className={`${styles.tab} ${
              activeTab === "CS2" ? styles.tab_active : ""
            }`}
            onClick={() => handleTabChange("CS2")}
          >
            CS2
          </button>
          <button
            className={`${styles.tab} ${
              activeTab === "premium" ? styles.tab_active : ""
            }`}
            onClick={() => handleTabChange("premium")}
          >
            Премиум услуги
          </button>
        </div>
        <div className={styles.servers_content}>
          {activeTab === "premium" ? (
            filteredServers.length > 0 ? (
              <PremiumServerList servers={filteredServers} />
            ) : (
              <p className={styles.not_server}>
                Нет серверов с премиум-услугами
              </p>
            )
          ) : currentServers.length > 0 ? (
            currentServers.map((item, index) => {
              return (
                <div key={index} onClick={() => setServerId(item.id)}>
                  <ServerBlockItem server={item} onClose={setOnClose} />
                </div>
              );
            })
          ) : (
            <p className={styles.not_server}>Нет добавленных серверов</p>
          )}
        </div>

        {/* Пагинация отображается только если есть серверы */}
        {filteredServers.length > 0 && (
          <Pagination
            serversPerPage={serversPerPage}
            totalServers={filteredServers.length}
            paginate={paginate}
            currentPage={currentPage}
          />
        )}
      </div>
    </div>
  );
}
