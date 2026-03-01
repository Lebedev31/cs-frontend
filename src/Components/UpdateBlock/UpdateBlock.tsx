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

export default function UpdateBlock() {
  const serversArr = useSelector((state: RootState) => state.main.servers);
  const isLoading = useSelector(
    (state: RootState) => state.main.isLoadingServers,
  );

  const premiumRef = useRef<HTMLDivElement>(null);
  const bannerRef = useRef<HTMLDivElement>(null);
  const [isSticky, setIsSticky] = useState(false);
  const [bannerWidth, setBannerWidth] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!premiumRef.current || !bannerRef.current) return;

      const premiumRect = premiumRef.current.getBoundingClientRect();

      if (!isSticky) {
        setBannerWidth(bannerRef.current.offsetWidth);
      }

      if (premiumRect.bottom <= 0) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

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
        {/*
          Слайдер — виден ТОЛЬКО на ≤ 1280px (через CSS display: none/block).
          На десктопе скрыт — там топ отображается в правой колонке как список.
        */}
        <div className={styles.topSliderMobile}>
          <TopServerSlider />
        </div>

        <AllServers data={serversArr} />
      </div>

      {/*
        Правая колонка — видна ТОЛЬКО на > 1280px.
        Содержит полный список топ серверов + баннер.
        На ≤ 1280px скрывается через CSS.
      */}
      <div className={styles.premium}>
        <div ref={premiumRef}>
          <PremiumServerBlockItem />
        </div>

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
