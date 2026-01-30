"use client";
import { useEffect, useRef } from "react";
import styles from "./ProfileDropdown.module.scss";
import { useLazyLogoutQuery } from "@/redux/apiSlice/authApi";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { toast } from "react-toastify";
import { handleToastError } from "@/lib/common";
import Link from "next/link";
import { setLogin } from "@/redux/slice/auth.slice";
import { useGetBalanceQuery } from "@/redux/apiSlice/paymentApi";
import { setInfo } from "@/redux/slice/main.slice";

interface ProfileDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  toggleRef?: React.RefObject<HTMLElement | null>; // ref кнопки-открывашки (опционально)
}

export default function ProfileDropdown({
  isOpen,
  onClose,
  toggleRef,
}: ProfileDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [trigger] = useLazyLogoutQuery();
  const dispatch: AppDispatch = useDispatch();
  const { data } = useGetBalanceQuery();

  const logout = async () => {
    try {
      const result = await trigger().unwrap();
      if (result.statusCode === 200) {
        localStorage.removeItem("login");
        const loginToken = localStorage.getItem("login");
        dispatch(setLogin(loginToken ? true : false));
        dispatch(setInfo({ avatarUrl: "", login: "" }));
        toast.success("Вы вышли из системы");
      }
    } catch (error) {
      handleToastError(error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      // Если клик внутри дропдауна — ничего не делаем
      if (dropdownRef.current && dropdownRef.current.contains(target)) return;

      // Если передали ref на кнопку-тогглер и клик по ней — игнорируем (не считаем "вне")
      if (toggleRef?.current && toggleRef.current.contains(target)) return;

      // Иначе — закрыть
      onClose();
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose, toggleRef]);

  if (!isOpen) return null;

  return (
    <div className={styles.dropdown} ref={dropdownRef}>
      <div className={styles.menuItem}>
        <span className={styles.label}>
          Баланс:{" "}
          {data ? (data.data ? data.data + "₽" : 0 + "₽") : "Неизвестно"}
        </span>
        <Link href="/payment">
          <button className={styles.balanceBtn}>Пополнить баланс</button>
        </Link>
      </div>

      <div className={styles.separator}></div>
      <Link href="/settingAccount">
        <button className={styles.menuItem}>Настройки</button>
      </Link>
      <Link href="/myServers">
        <button className={styles.menuItem}>Ваши сервера</button>
      </Link>
      <Link href="/finHistory">
        <button className={styles.menuItem}>История финансовых операций</button>
      </Link>

      <div className={styles.separator}></div>

      <button className={styles.menuItem} onClick={logout}>
        Выйти
      </button>
    </div>
  );
}
