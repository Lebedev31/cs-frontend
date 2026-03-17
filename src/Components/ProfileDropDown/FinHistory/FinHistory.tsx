"use client";
import React from "react";
import styles from "./FinHistory.module.scss";
import Pagination from "@/Components/Pagination/Pagination";
import Home from "@/Components/Home/Home";
import { useGetFinHistoryQuery } from "@/redux/apiSlice/paymentApi";
import { getFormatData } from "@/lib/common";
import { useSearchParams, usePathname, useRouter } from "next/navigation";

function formatAmount(amount: number) {
  const sign = amount > 0 ? "+" : amount < 0 ? "-" : "";
  const abs = Math.abs(amount).toLocaleString("ru-RU");
  return `${sign}${abs} ₽`;
}

const serviceNames: Record<string, string> = {
  balls: "Баллы",
  top: "Топ-сервер",
  vip: "Вип-сервер",
  color: "Цвет",
};

export default function FinHistory() {
  const { data } = useGetFinHistoryQuery();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const currentPage = Number(searchParams.get("page")) || 1;
  const serversPerPage = 15;

  const sortedData = data?.data
    ? [...data.data].sort(
        (a, b) =>
          new Date(b.date || "").getTime() - new Date(a.date || "").getTime(),
      )
    : [];

  const indexOfLastServer = currentPage * serversPerPage;
  const indexOfFirstServer = indexOfLastServer - serversPerPage;
  const currentServers = sortedData.slice(
    indexOfFirstServer,
    indexOfLastServer,
  );

  const paginate = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", pageNumber.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

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
              {currentServers.map((row, index) => (
                <tr key={index} className={styles.row}>
                  <td className={styles.cellDate}>
                    <span>
                      {getFormatData(row.date || "").formattedDate +
                        " " +
                        getFormatData(row.date || "").formattedTime}
                    </span>
                  </td>
                  <td className={styles.cellDesc}>
                    {row.description !== "Пополнение баланса"
                      ? `Покупка услуги ${serviceNames[row.description] ?? row.description}`
                      : row.description}
                  </td>
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
                      {formatAmount(row.amount)}
                    </span>
                  </td>
                  <td className={styles.cellStatus}>
                    <span
                      className={`${styles.status} ${
                        row.status === "succeeded"
                          ? styles.statusSuccess
                          : row.status === "pending" ||
                              row.status === "waiting_for_capture"
                            ? styles.statusPending
                            : styles.statusFailed
                      }`}
                    >
                      {row.status === "succeeded"
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
          totalServers={sortedData.length}
          paginate={paginate}
          currentPage={currentPage}
        />
      </div>
    </div>
  );
}
