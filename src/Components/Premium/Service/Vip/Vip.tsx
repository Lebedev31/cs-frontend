"use client";
import Service from "../Service";
import TermBlock from "../Elements/TermBlock/TermBlock";
import styles from "../Service.module.scss";
import { VipType, generalSchema } from "@/types/service.type";
import { handleSubmit } from "@/lib/common";
import { useRef, useState } from "react";

export default function Vip() {
  return (
    <Service>
      <>
        <h3 className={styles.title_service}>Срок услуги</h3>
        <TermBlock price={[100, 300, 500, 800]} />
      </>
    </Service>
  );
}
