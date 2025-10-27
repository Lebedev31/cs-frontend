"use client";
import React from "react";
import styles from "./FinHistory.module.scss";
import { mockData } from "@/lib/mock.fin";
import Pagination from "@/Components/Pagination/Pagination";
import { useState } from "react";
import Home from "@/Components/Home/Home";

function formatAmount(amount: number, currency = "₽") {
  const sign = amount > 0 ? "+" : amount < 0 ? "-" : "";
  const abs = Math.abs(amount).toLocaleString("ru-RU");
  return `${sign}${abs} ${currency}`;
}

export default function FinHistory() {
  // 1. Состояние для текущей страницы
  const [currentPage, setCurrentPage] = useState(1);
  // 2. Количество серверов на одной странице
  const [serversPerPage] = useState(10); // Можете изменить это значение

  // 3. Вычисляем индексы для обрезки массива
  const indexOfLastServer = currentPage * serversPerPage;
  const indexOfFirstServer = indexOfLastServer - serversPerPage;
  const currentServers = mockData.slice(indexOfFirstServer, indexOfLastServer);
  // 4. Функция для смены страницы, которую передадим в Pagination
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className={styles.page}>
      <div className={styles.wrapper}>
        <h1 className={styles.title}>История финансовых операций</h1>
        <Home />
        <div className={styles.tableWrapper}>
          <table className={styles.table} cellPadding={0} cellSpacing={0}>
            <thead>
              <tr>
                <th className={styles.colDate}>Дата</th>
                <th className={styles.colDesc}>Описание</th>
                <th className={styles.colAmount}>Сумма</th>
                <th className={styles.colStatus}>Статус</th>
              </tr>
            </thead>

            <tbody>
              {currentServers.map((row) => (
                <tr key={row.id} className={styles.row}>
                  <td className={styles.cellDate}>{row.date}</td>
                  <td className={styles.cellDesc}>{row.description}</td>
                  <td className={styles.cellAmount}>
                    <span
                      className={`${styles.amount} ${
                        row.amount > 0
                          ? styles.amountPlus
                          : row.amount < 0
                          ? styles.amountMinus
                          : ""
                      }`}
                    >
                      {formatAmount(row.amount, row.currency)}
                    </span>
                  </td>
                  <td className={styles.cellStatus}>
                    <span
                      className={`${styles.status} ${
                        row.status === "completed"
                          ? styles.statusSuccess
                          : row.status === "pending"
                          ? styles.statusPending
                          : styles.statusFailed
                      }`}
                    >
                      {row.status === "completed"
                        ? "Завершено"
                        : row.status === "pending"
                        ? "В обработке"
                        : "Ошибка"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination
          serversPerPage={serversPerPage}
          totalServers={mockData.length}
          paginate={paginate}
          currentPage={currentPage}
        />
      </div>
    </div>
  );
}
