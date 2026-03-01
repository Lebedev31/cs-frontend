"use client";

import styles from "./Auth.module.scss";
import { useAuthAdminMutation } from "@/redux/apiSlice/adminApi";
import { useState } from "react";
import { handleToastError } from "@/lib/common";
import { useRouter } from "next/navigation";

export default function AuthAdmin() {
  // 1. Состояния для полей ввода
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const [authAdmin, { isLoading }] = useAuthAdminMutation();

  const canSubmit = login.trim().length > 0 && password.trim().length > 0;

  async function onSubmit() {
    // Если поля пустые, просто выходим (защита на случай обхода disabled)
    if (!canSubmit || isLoading) return;

    try {
      const result = await authAdmin({ login, password }).unwrap();
      if (result.data) {
        localStorage.setItem("admin_token", result.data);
        router.push("x9FqL7rA2pVdM3sK/admin");
      }
    } catch (error) {
      handleToastError(error);
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.grid} />

      <div className={styles.wrapper}>
        <div className={styles.header}>
          <div className={styles.logo}>
            <div className={styles.logo__icon}>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="2" y="3" width="20" height="14" rx="2" />
                <path d="M8 21h8M12 17v4" />
              </svg>
            </div>
            <span className={styles.logo__text}>Админ Панель</span>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.fields}>
            <div className={styles.field}>
              <input
                className={styles.field__input}
                type="text"
                placeholder="ЛОГИН"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                autoComplete="off"
              />
            </div>

            <div className={styles.field}>
              <input
                className={styles.field__input}
                type="password"
                placeholder="ПАРОЛЬ"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            className={styles.button}
            onClick={onSubmit}
            disabled={!canSubmit || isLoading}
          >
            {isLoading ? "ЗАГРУЗКА..." : "ВХОД"}
          </button>
        </div>
      </div>
    </div>
  );
}
