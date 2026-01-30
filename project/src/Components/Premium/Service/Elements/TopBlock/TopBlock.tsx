"use client";
import styles from "./TopBlock.module.scss";
import { useGetLimitTopServiceQuery } from "@/redux/apiSlice/paymentApi";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { useEffect } from "react";
import { setServerId } from "@/redux/slice/main.slice";

export type TopBlockProps = {
  selectTopLimit: (limit: number) => void;
  topLimit: number;
};

export default function TopBlock({ selectTopLimit, topLimit }: TopBlockProps) {
  const serverIpPort = useSelector((state: RootState) => state.main.serverId);
  const dispatch: AppDispatch = useDispatch();
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

    return () => {
      dispatch(setServerId(undefined));
    };
  }, [data, selectTopLimit]);

  // Если сервер не выбран и не передан topLimit — ничего не показываем
  if (!serverIpPort && (topLimit === undefined || topLimit === null))
    return null;

  if (isLoading) {
    return <div className={styles.top_block}>Загрузка...</div>;
  }

  if (typeof topLimit === "number" && topLimit > 0) {
    return (
      <div className={styles.top_block}>
        Осталось мест в топ-рейтинге: {topLimit}
      </div>
    );
  }

  if (typeof topLimit === "number" && topLimit === 0 && serverIpPort) {
    return <div className={styles.top_block}>Нет мест в топ-рейтинге</div>;
  }
}
