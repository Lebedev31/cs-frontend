/*"use client";
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
        <PremiumServerBlockItem />
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
}*/
"use client";
import styles from "./UpdateBlock.module.scss";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import AllServers from "./AllServers/AllServers";
import PremiumServerBlockItem from "./PremiumServerBlockItem/PremiumServerBlockItem";
import MainPageSkeleton from "./MainServerSkeleton/MainServerSceleton";
import AddBanner from "../AddBanner/AddBanner";
import { useEffect, useRef, useState } from "react";

export default function UpdateBlock() {
  const serversArr = useSelector((state: RootState) => state.main.servers);
  const isLoading = useSelector(
    (state: RootState) => state.main.isLoadingServers
  );

  const premiumRef = useRef<HTMLDivElement>(null);
  const bannerRef = useRef<HTMLDivElement>(null);
  const [isSticky, setIsSticky] = useState(false);
  const [bannerWidth, setBannerWidth] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!premiumRef.current || !bannerRef.current) return;

      const premiumBlock = premiumRef.current;
      const premiumRect = premiumBlock.getBoundingClientRect();
      const premiumBottom = premiumRect.bottom;

      // Сохраняем ширину баннера для fixed позиционирования
      if (!isSticky) {
        setBannerWidth(bannerRef.current.offsetWidth);
      }

      // Баннер становится sticky когда премиум блок прокручен
      if (premiumBottom <= 0) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    // Сохраняем начальную ширину
    if (bannerRef.current) {
      setBannerWidth(bannerRef.current.offsetWidth);
    }

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [isSticky]);

  if (isLoading) {
    return <MainPageSkeleton />;
  }

  return (
    <div className={styles.updateBlock}>
      <div className={styles.updateBlock_union}>
        <AllServers data={serversArr} />
      </div>
      <div className={styles.premium}>
        <div ref={premiumRef}>
          <PremiumServerBlockItem />
        </div>

        {/* Placeholder для сохранения места когда баннер становится fixed */}
        <div
          className={styles.bannerWrapper}
          style={{ height: isSticky ? "400px" : "auto" }}
        >
          <div
            ref={bannerRef}
            className={`${styles.advertising} ${
              isSticky ? styles.stickyBanner : ""
            }`}
            style={isSticky ? { width: `${bannerWidth}px` } : {}}
          >
            <AddBanner
              size="responsive"
              customHtml="<div>Моя реклама</div>"
              style={{ minHeight: "300px" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
