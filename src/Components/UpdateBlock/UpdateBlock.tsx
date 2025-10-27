"use client";
import styles from "./UpdateBlock.module.scss";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import AllServers from "./AllServers/AllServers";
import PremiumServerBlockItem from "./PremiumServerBlockItem/PremiumServerBlockItem";

export default function UpdateBlock() {
  const serversArr = useSelector((state: RootState) => state.main.servers);

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
