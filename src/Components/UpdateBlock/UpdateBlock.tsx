"use client";
import styles from "./UpdateBlock.module.scss";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import AllServers from "./AllServers/AllServers";
import PremiumServerBlockItem from "./PremiumServerBlockItem/PremiumServerBlockItem";
// 1. Импортируем скелетон
import MainPageSkeleton from "./MainServerSkeleton/MainServerSceleton";
import AddBanner from "../AddBanner/AddBanner";

export default function UpdateBlock() {
  const serversArr = useSelector((state: RootState) => state.main.servers);
  const isLoading = useSelector(
    (state: RootState) => state.main.isLoadingServers
  );
  if (isLoading) {
    return <MainPageSkeleton />;
  }

  return (
    <div className={styles.updateBlock}>
      <div className={styles.updateBlock_union}>
        <AllServers data={serversArr} />
      </div>
      <div className={styles.premium}>
        <PremiumServerBlockItem data={serversArr} />
        <div className={styles.advertising}>
          <AddBanner
            size="responsive"
            customHtml="<div>Моя реклама</div>"
            style={{ minHeight: "300px" }}
          />
        </div>
      </div>
    </div>
  );
}
