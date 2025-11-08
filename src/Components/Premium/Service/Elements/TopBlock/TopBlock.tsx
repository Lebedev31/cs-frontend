"use client";
import styles from "./TopBlock.module.scss";
import { useGetLimitTopServiceQuery } from "@/redux/apiSlice/paymentApi";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useEffect } from "react";

export type TopBlockProps = {
  selectTopLimit: (limit: number) => void;
  topLimit: number;
};

export default function TopBlock({ selectTopLimit, topLimit }: TopBlockProps) {
  const serverIpPort = useSelector((state: RootState) => state.main.serverId);
  const { data, isLoading } = useGetLimitTopServiceQuery(
    serverIpPort ? { serverId: serverIpPort } : { serverId: "" },
    {
      skip: serverIpPort ? false : true,
    }
  );

  useEffect(() => {
    if (data && data.data) {
      selectTopLimit(data.data.limit);
    }
  }, [data, selectTopLimit]);
  return (
    <div className={styles.top_block}>
      {serverIpPort ? " Осталось мест в топ-рейтинге: " : ""}
      {isLoading
        ? "Загрузка..."
        : topLimit
        ? topLimit
        : !serverIpPort
        ? null
        : " Все места заняты"}
    </div>
  );
}
