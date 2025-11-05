"use client";
import styles from "./TopBlock.module.scss";
import { useGetLimitTopServiceQuery } from "@/redux/apiSlice/paymentApi";
import { useEffect } from "react";

export type TopBlockProps = {
  selectTopLimit: (limit: number) => void;
  topLimit: number;
};

export default function TopBlock({ selectTopLimit, topLimit }: TopBlockProps) {
  const { data, isLoading } = useGetLimitTopServiceQuery();

  useEffect(() => {
    if (data && data.data) {
      selectTopLimit(data.data.limit);
    }
  }, [data, selectTopLimit]);
  return (
    <div className={styles.top_block}>
      Осталось мест в топ-рейтинге:{" "}
      {isLoading ? "Загрузка..." : topLimit ? topLimit : "Все места заняты"}
    </div>
  );
}
