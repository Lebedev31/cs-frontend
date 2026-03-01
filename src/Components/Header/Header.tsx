/* eslint-disable @next/next/no-img-element */
"use client";

import Image from "next/image";
import Link from "next/link";
import styles from "./Header.module.scss";
import AsideMenu from "../AsideMenu/AsideMenu";
import ProfileDropdown from "../ProfileDropDown/ProfileDropdown";
import { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { useGetAvatarUrlQuery } from "@/redux/apiSlice/settingAccountApi";
import { apiImg } from "@/redux/api.url";
import { setInfo } from "@/redux/slice/main.slice";
import { setLogin } from "@/redux/slice/auth.slice";

export default function Header() {
  const isLogin = useSelector((state: RootState) => state.auth.isLoggedIn);
  const [isClient, setIsClient] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const profileButtonRef = useRef<HTMLButtonElement | null>(null);
  const dispatch: AppDispatch = useDispatch();
  const { data, refetch, isError } = useGetAvatarUrlQuery(undefined, {
    skip: !isLogin,
  });

  useEffect(() => {
    if (isError) {
      localStorage.removeItem("login");
      dispatch(setInfo({ avatarUrl: "", login: "" }));
      dispatch(setLogin(false));
    }
    setIsClient(true);
  }, [isError]);

  useEffect(() => {
    const existLogin = localStorage.getItem("login");
    if (isLogin && data && data.data) {
      localStorage.setItem("login", data.data.login);
      dispatch(
        setInfo({ avatarUrl: data.data.avatarUrl, login: data.data.login }),
      );
      dispatch(setLogin(true));
    }
    if (!data && !isLogin) {
      if (existLogin) {
        localStorage.removeItem("login");
        dispatch(setInfo({ avatarUrl: "", login: "" }));
        dispatch(setLogin(false));
      }
    }
  }, [isLogin, isClient, data, dispatch]);

  useEffect(() => {
    if (isLogin) refetch();
  }, [isLogin, refetch]);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  if (!isClient) {
    return (
      <header className={styles.header}>
        <div style={{ width: 44 }} />
        <div className={styles.logo}>
          <Image
            src="/logo.png"
            alt="CS 1.6 Server Parser"
            width={165}
            height={60}
            priority
          />
        </div>
        <div className={styles.desktopNav}>
          <AsideMenu />
        </div>
        <div className={styles.auth}>
          <Link href="/login">
            <button className={styles.loginBtn}>Войти</button>
          </Link>
        </div>
      </header>
    );
  }

  return (
    <>
      <header className={styles.header}>
        {/* Гамбургер — виден только на мобиле */}
        <button
          className={`${styles.hamburger} ${isMobileMenuOpen ? styles.open : ""}`}
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          aria-label="Открыть меню"
        >
          <span />
          <span />
          <span />
        </button>

        {/* Логотип — слева на десктопе, по центру на мобиле */}
        <div className={styles.logo}>
          <Link href="/">
            <Image
              src="/logo.png"
              alt="CS 1.6 Server Parser"
              priority
              width={165}
              height={60}
            />
          </Link>
        </div>

        {/* Навигация — только десктоп */}
        <div className={styles.desktopNav}>
          <AsideMenu />
        </div>

        {/* Авторизация — всегда справа */}
        <div className={styles.auth}>
          {isLogin ? (
            <div className={styles.profileWrapper}>
              <button
                ref={profileButtonRef}
                className={styles.profileBtn}
                onClick={() => setIsProfileOpen((p) => !p)}
              >
                <div className={styles.avatar}>
                  <img
                    src={
                      data?.data?.avatarUrl
                        ? data.data.avatarUrl.startsWith("http")
                          ? data.data.avatarUrl
                          : `${apiImg}${data.data.avatarUrl}`
                        : "/вопрос.png"
                    }
                    alt="Avatar"
                  />
                </div>
                <span className={styles.loginText}>
                  {data?.data?.login
                    ? data.data.login.replace(/^(vk_|steam_)/, "")
                    : "Login"}
                </span>
                <svg
                  className={`${styles.arrow} ${isProfileOpen ? styles.arrowUp : ""}`}
                  width="12"
                  height="8"
                  viewBox="0 0 12 8"
                  fill="none"
                >
                  <path
                    d="M1 1L6 6L11 1"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <ProfileDropdown
                isOpen={isProfileOpen}
                onClose={() => setIsProfileOpen(false)}
                toggleRef={profileButtonRef}
              />
            </div>
          ) : (
            <Link href="/login">
              <button className={styles.loginBtn}>Войти</button>
            </Link>
          )}
        </div>
      </header>

      {/* Мобильная панель */}
      {isMobileMenuOpen && (
        <div
          className={styles.overlay}
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
      <div
        className={`${styles.mobilePanel} ${isMobileMenuOpen ? styles.mobilePanelOpen : ""}`}
      >
        {/* mobilePanelInner — глобальный класс для переключения nav в колонку */}
        <div className="mobilePanelInner">
          <AsideMenu onLinkClick={() => setIsMobileMenuOpen(false)} />
        </div>
      </div>
    </>
  );
}
