"use client";
import React from "react";
import styles from "./SettingAccount.module.scss";
import Home from "@/Components/Home/Home";
import TopSettingBlock from "./TopSettingBlock/TopSettingBlock";
import BottomSettingBlock from "./BottomSettingBlock/BottomSettingBlock";

export default function SettingAccount() {
  return (
    <div className={styles.setting_container}>
      <h1 className={styles.title}>Настройки аккаунта</h1>
      <div className={styles.wrapper}>
        <Home />
        <TopSettingBlock />
        {/* Разделитель */}
      </div>

      <div className={styles.divider} />

      {/* Смена пароля */}
      <BottomSettingBlock />
    </div>
  );
}
