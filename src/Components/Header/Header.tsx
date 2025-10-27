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

export default function Header() {
  const login = useSelector((state: RootState) => state.auth.isLoggedIn);
  const [isClient, setIsClient] = useState(false); // <- для безопасного SSR
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileButtonRef = useRef<HTMLButtonElement | null>(null);
  const dispatch: AppDispatch = useDispatch();
  const { data } = useGetAvatarUrlQuery();

  // После монтирования компонента мы уже на клиенте
  useEffect(() => {
    setIsClient(true);
  }, []);
  useEffect(() => {
    if (login && data && data.data) {
      console.log(12);
      dispatch(
        setInfo({ avatarUrl: data.data.avatarUrl, login: data.data.login })
      );
    }
  }, [login, isClient, data]);

  const toggleProfile = () => {
    setIsProfileOpen((prev) => !prev);
  };

  // Если мы ещё на сервере — рендерим только пустой контейнер, чтобы избежать ошибок гидрации
  if (!isClient) {
    return (
      <header className={styles.header}>
        <div className={styles.logo}>
          <Image
            src="/logo.jpg"
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
            src="/logo.jpg"
            alt="CS 1.6 Server Parser"
            priority
            width={80}
            height={60}
          />
        </Link>
      </div>

      <AsideMenu />

      <div className={styles.auth}>
        {login ? (
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
                      ? `${apiImg}${data.data.avatarUrl}`
                      : "/вопрос.png"
                  }
                  alt="Avatar"
                />
              </div>
              <span className={styles.loginText}>
                {data && data.data?.login ? `${data.data.login}` : "Login"}
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
