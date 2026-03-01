"use client";
import styles from "./StatisticServer.module.scss";
import { useRouter } from "next/navigation";
import { useGetStatisticQuery } from "@/redux/apiSlice/adminApi";
import { useState, useEffect } from "react";
import type { AdminStatistic } from "@/redux/apiSlice/adminApi";
import { toast } from "react-toastify";

export default function StatisticServers() {
  const router = useRouter();
  const { data, isError } = useGetStatisticQuery();
  const [statistic, setStatistic] = useState<AdminStatistic>({
    servers: 0,
    users: 0,
    service: 0,
  });

  useEffect(() => {
    if (isError) {
      toast.error("Срок жизни токена истек, авторизируйтесь");
      router.push("/x9FqL7rA2pVdM3sK");
    }
  }, [isError, router]);

  useEffect(() => {
    if (data && data.data) {
      const { servers, users, service } = data.data;
      console.log(data.data);
      setStatistic((prev) => ({
        ...prev,
        servers: servers,
        users: users,
        service: service,
      }));
    }
  }, [data]);

  return (
    <section className={styles.statistic}>
      <div className={styles.wrapper}>
        <div className={styles.grid}>
          {/* Карточка: Серверы */}
          <div className={styles.card}>
            <div className={styles.card__icon}>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="2" y="2" width="20" height="8" rx="2" />
                <rect x="2" y="14" width="20" height="8" rx="2" />
                <line x1="6" y1="6" x2="6.01" y2="6" />
                <line x1="6" y1="18" x2="6.01" y2="18" />
              </svg>
            </div>
            <div className={styles.card__content}>
              <p className={styles.card__label}>Общее кол-во серверов</p>
              <h3 className={styles.card__value}>{statistic.servers}</h3>
            </div>
          </div>

          {/* Карточка: Юзеры */}
          <div className={styles.card}>
            <div className={styles.card__icon}>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <div className={styles.card__content}>
              <p className={styles.card__label}>Всего пользователей</p>
              <h3 className={styles.card__value}>{statistic.users}</h3>
            </div>
          </div>

          {/* Карточка: Платные услуги */}
          <div className={styles.card}>
            <div className={styles.card__icon}>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </div>
            <div className={styles.card__content}>
              <p className={styles.card__label}>Активные услуги</p>
              <h3 className={styles.card__value}>{statistic.service}</h3>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
