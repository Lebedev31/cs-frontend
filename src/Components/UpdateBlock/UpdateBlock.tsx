"use client";
import styles from "./UpdateBlock.module.scss";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import AllServers from "./AllServers/AllServers";
import PremiumServerBlockItem from "./PremiumServerBlockItem/PremiumServerBlockItem";
import TopServerSlider from "./TopServerSlider/TopServerSlider";
import MainPageSkeleton from "./MainServerSkeleton/MainServerSceleton";
import AddBanner from "../AddBanner/AddBanner";
import { useEffect, useRef, useState } from "react";

// ⚠️ Замени на реальную высоту своего header!
const HEADER_HEIGHT = 60;
const BANNER_TOP = HEADER_HEIGHT + 10;

export default function UpdateBlock() {
  const serversArr = useSelector((state: RootState) => state.main.servers);
  const isLoading = useSelector(
    (state: RootState) => state.main.isLoadingServers,
  );

  const premiumRef = useRef<HTMLDivElement>(null);
  const bannerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isSticky, setIsSticky] = useState(false);
  const [bannerWidth, setBannerWidth] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!bannerRef.current || !containerRef.current || !premiumRef.current)
        return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const premiumHeight = premiumRef.current.offsetHeight;
      const bannerHeight = bannerRef.current.offsetHeight;

      // Natural-позиция верха баннера относительно viewport
      const bannerNaturalTop = containerRect.top + premiumHeight;

      // Нижний край правой колонки
      const containerBottom = containerRect.bottom;

      // Баннер достиг header — пора прилипать
      const shouldStick = bannerNaturalTop <= BANNER_TOP;

      // Нижний край баннера если он sticky
      const bannerBottomIfSticky = BANNER_TOP + bannerHeight;

      // Баннер достиг конца колонки — снимаем sticky (не наезжает на footer)
      const reachedEnd = containerBottom <= bannerBottomIfSticky;

      if (!isSticky && bannerRef.current) {
        setBannerWidth(bannerRef.current.offsetWidth);
      }

      setIsSticky(shouldStick && !reachedEnd);
    };

    if (bannerRef.current) {
      setBannerWidth(bannerRef.current.offsetWidth);
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [isSticky]);

  if (isLoading) return <MainPageSkeleton />;

  return (
    <div className={styles.updateBlock}>
      <div className={styles.updateBlock_union}>
        <div className={styles.topSliderMobile}>
          <TopServerSlider />
        </div>
        <AllServers data={serversArr} />

        {/* Баннер под пагинацией — только на ≤ 1280px */}
        <div className={styles.bannerMobile}>
          <AddBanner />
        </div>
      </div>

      {/* Правая колонка — только на > 1280px */}
      <div className={styles.premium} ref={containerRef}>
        <div ref={premiumRef}>
          <PremiumServerBlockItem />
        </div>

        {/* Плейсхолдер держит место когда баннер fixed */}
        <div
          className={styles.bannerWrapper}
          style={{
            height: isSticky
              ? `${bannerRef.current?.offsetHeight ?? 0}px`
              : "auto",
          }}
        >
          <div
            ref={bannerRef}
            className={`${styles.advertising} ${isSticky ? styles.stickyBanner : ""}`}
            style={
              isSticky
                ? { width: `${bannerWidth}px`, top: `${BANNER_TOP}px` }
                : {}
            }
          >
            <AddBanner />
          </div>
        </div>
      </div>
    </div>
  );
}
