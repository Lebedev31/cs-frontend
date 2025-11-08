"use client";
import styles from "./MyServers.module.scss";
import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useGetMyServersQuery } from "@/redux/apiSlice/addServerApi";
import React, { useState, useMemo } from "react";
import { Game } from "@/types/type";
import ServerBlockItem from "@/Components/UpdateBlock/ServerBlockItem/ServerBlockItem";
import Modal from "./Modal/Modal";

export default function MyServers() {
  const [onClose, setOnClose] = useState<boolean>(false);
  const [serverId, setServerId] = useState<string>("");
  const originalServerList = useSelector(
    (state: RootState) => state.main.originalServers
  );
  const { data, isLoading } = useGetMyServersQuery();
  const [activeTab, setActiveTab] = useState<"all" | Game>("all");
  const myServerList = useMemo(() => {
    if (!data?.data || !Array.isArray(originalServerList) || isLoading) {
      return [];
    }
    return originalServerList.filter((item) =>
      activeTab === "all"
        ? item.owner === data?.data?.owner
        : item.owner === data?.data?.owner && item.game === activeTab
    );
  }, [data, activeTab, originalServerList, isLoading]);

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
            onClick={() => setActiveTab("all")}
          >
            Все сервера
          </button>
          <button
            className={`${styles.tab} ${
              activeTab === "CS:GO" ? styles.tab_active : ""
            }`}
            onClick={() => setActiveTab("CS:GO")}
          >
            CS:GO
          </button>
          <button
            className={`${styles.tab} ${
              activeTab === "CS2" ? styles.tab_active : ""
            }`}
            onClick={() => setActiveTab("CS2")}
          >
            CS2
          </button>
        </div>
        <div className={styles.servers_content}>
          {myServerList.length > 0 ? (
            myServerList.map((item, index) => {
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
      </div>
    </div>
  );
}
