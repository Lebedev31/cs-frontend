"use client";
import styles from "./MyServers.module.scss";
import Link from "next/link";
import { useGetMyServersQuery } from "@/redux/apiSlice/csServerApi";
import React, { useState, useMemo } from "react";
import { Game } from "@/types/type";
import ServerBlockItem from "@/Components/UpdateBlock/ServerBlockItem/ServerBlockItem";
import Modal from "./Modal/Modal";

export default function MyServers() {
  const [onClose, setOnClose] = useState<boolean>(false);
  const [serverId, setServerId] = useState<string>("");
  const { data, isLoading } = useGetMyServersQuery();
  const [activeTab, setActiveTab] = useState<"all" | Game>("all");
  const myServerList = useMemo(() => {
    if (!data?.data || isLoading) {
      return [];
    }
    return data.data.filter((item) => {
      if (activeTab === "all") {
        return data.data;
      }

      if (activeTab === "CS:GO") {
        return item.game === "CS:GO";
      }

      if (activeTab === "CS2") {
        return item.game === "CS2";
      }
    });
  }, [data, activeTab, isLoading]);

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
