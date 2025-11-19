"use client";
import styles from "./UpdateBlock.module.scss";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import AllServers from "./AllServers/AllServers";
import PremiumServerBlockItem from "./PremiumServerBlockItem/PremiumServerBlockItem";
// 1. Импортируем скелетон
import MainPageSkeleton from "./MainServerSkeleton/MainServerSceleton";

export default function UpdateBlock() {
  const serversArr = useSelector((state: RootState) => state.main.servers);
  if (!serversArr || serversArr.length === 0) {
    return <MainPageSkeleton />;
  }

  return (
    <div className={styles.updateBlock}>
      <div className={styles.updateBlock_union}>
        <AllServers data={serversArr} />
      </div>
      <div className={styles.premium}>
        <PremiumServerBlockItem />
      </div>
    </div>
  );
}
