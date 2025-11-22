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
  const [isClient, setIsClient] = useState(false); // <- для безопасного SSR
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileButtonRef = useRef<HTMLButtonElement | null>(null);
  const dispatch: AppDispatch = useDispatch();
  const { data, refetch, isError } = useGetAvatarUrlQuery(
    undefined,
    { skip: !isLogin } // <-- не запрашивать пока не залогинен
  );

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
        setInfo({ avatarUrl: data.data.avatarUrl, login: data.data.login })
      );
      dispatch(setLogin(true));
    }
    if (!data && !isLogin) {
      console.log(existLogin);
      if (existLogin) {
        localStorage.removeItem("login");
        dispatch(setInfo({ avatarUrl: "", login: "" }));
        dispatch(setLogin(false));
      }
    }
  }, [isLogin, isClient, data, dispatch]);

  useEffect(() => {
    if (isLogin) {
      // если запрос ещё не делался — refetch подтянет данные
      refetch();
    }
  }, [isLogin, refetch]);

  const toggleProfile = () => {
    setIsProfileOpen((prev) => !prev);
  };

  // Если мы ещё на сервере — рендерим только пустой контейнер, чтобы избежать ошибок гидрации
  if (!isClient) {
    return (
      <header className={styles.header}>
        <div className={styles.logo}>
          <Image
            src="/logo.png"
            alt="CS 1.6 Server Parser"
            width={80}
            height={50}
            priority
          />
        </div>
        <AsideMenu />
        <div className={styles.auth}>
          <div style={{ width: 100, height: 40 }} />
        </div>
      </header>
    );
  }

  return (
    <header className={styles.header}>
      {/* Логотип слева */}
      <div className={styles.logo}>
        <Link href="/">
          <Image
            src="/logo.png"
            alt="CS 1.6 Server Parser"
            priority
            width={80}
            height={60}
          />
        </Link>
      </div>

      <AsideMenu />

      <div className={styles.auth}>
        {isLogin ? (
          <div className={styles.profileWrapper}>
            <button
              ref={profileButtonRef}
              className={styles.profileBtn}
              onClick={toggleProfile}
            >
              <div className={styles.avatar}>
                <img
                  src={
                    data && data.data?.avatarUrl
                      ? data.data.avatarUrl.startsWith("http")
                        ? data.data.avatarUrl
                        : `${apiImg}${data.data.avatarUrl}`
                      : "/вопрос.png"
                  }
                  alt="Avatar"
                />
              </div>
              <span className={styles.loginText}>
                {data && data.data?.login
                  ? data.data.login.replace(/^(vk_|steam_)/, "")
                  : "Login"}
              </span>
              <svg
                className={`${styles.arrow} ${
                  isProfileOpen ? styles.arrowUp : ""
                }`}
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
  );
}
