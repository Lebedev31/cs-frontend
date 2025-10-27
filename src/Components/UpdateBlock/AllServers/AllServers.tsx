"use client";

import styles from "./AllServers.module.scss";
import { GameServer } from "@/types/type";
import ServerBlockItem from "../ServerBlockItem/ServerBlockItem";
import Pagination from "@/Components/Pagination/Pagination";
import { useState } from "react";

export type AllServersProps = {
  data: GameServer[];
};

export default function AllServers({ data }: AllServersProps) {
  // 1. Состояние для текущей страницы
  const [currentPage, setCurrentPage] = useState(1);
  // 2. Количество серверов на одной странице
  const [serversPerPage] = useState(10); // Можете изменить это значение

  // 3. Вычисляем индексы для обрезки массива
  const indexOfLastServer = currentPage * serversPerPage;
  const indexOfFirstServer = indexOfLastServer - serversPerPage;
  const currentServers = data.slice(indexOfFirstServer, indexOfLastServer);

  // 4. Функция для смены страницы, которую передадим в Pagination
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <>
      <div className={styles.allServers}>
        {/* Отображаем только серверы для текущей страницы */}
        {currentServers.map((item, index) => {
          return <ServerBlockItem key={index} server={item} />;
        })}
      </div>

      <Pagination
        serversPerPage={serversPerPage}
        totalServers={data.length}
        paginate={paginate}
        currentPage={currentPage}
      />
    </>
  );
}
