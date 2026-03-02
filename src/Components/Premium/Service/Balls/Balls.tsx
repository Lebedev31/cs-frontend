"use client";
import Service from "../Service";
import styles from "../Service.module.scss";
import { BallsType, ballsSchema, BallsValidation } from "@/types/service.type";
import { handleSubmit } from "@/lib/common";
import { useUpdateServiceBallsMutation } from "@/redux/apiSlice/paymentApi";
import { useState } from "react";
import { toast } from "react-toastify";

export default function Balls() {
  const [purchaseService] = useUpdateServiceBallsMutation();
  const [balls, setBalls] = useState<string>("0");

  const handleBallsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setBalls(value);
  };

  const [validationErrors, setValidationErrors] = useState({
    errorServerIpPort: "",
    errorEmail: "",
    errorOffer: "",
    errorPlan: "",
    errorBalls: "",
    errorBalance: "",
  });

  const onSubmit = (
    e: React.FormEvent<HTMLFormElement>,
    refs: {
      serverRef: React.RefObject<HTMLSelectElement | null>;
      emailRef: React.RefObject<HTMLInputElement | null>;
      offerRef: React.RefObject<HTMLInputElement | null>;
    },
  ) => {
    // 1. Проверяем, что все нужные DOM-элементы привязаны к рефам.
    if (
      !refs.serverRef.current ||
      !refs.emailRef.current ||
      !refs.offerRef.current
    ) {
      toast.error("Заполните все необходимые поля");
      return; // 🛑 ГАРАНТИЯ: Прекращаем выполнение, если хотя бы один null
    }

    const formData: BallsType = {
      serverIpPort: refs.serverRef.current.value,
      email: refs.emailRef.current.value,
      plan: "month",
      services: "balls",
      amount: Number(balls),
      balls,
    };

    const validation: BallsValidation = {
      serverIpPort: refs.serverRef.current.value,
      email: refs.emailRef.current.value,
      offer: refs.offerRef.current.checked || false,
      plan: "month",
      services: "balls",
      balls,
    };

    handleSubmit<BallsValidation, BallsType, void>(
      e,
      (errors) => {
        setValidationErrors({
          errorServerIpPort: errors.serverIpPort || "",
          errorEmail: errors.email || "",
          errorOffer: errors.offer || "",
          errorPlan: errors.plan || "",
          errorBalls: errors.balls || "0",
          errorBalance: errors.balance || "",
        });
      },
      purchaseService,
      validation,
      ballsSchema,
      formData,
      (data) => {
        toast.success(
          "Услуга успешно заказана и появится на вашем сервере через 1 минуту",
        );
        if (refs.serverRef.current) refs.serverRef.current.value = "";
        if (refs.emailRef.current) refs.emailRef.current.value = "";
        if (refs.offerRef.current) refs.offerRef.current.checked = false;
      },
      (msg) => setValidationErrors((prev) => ({ ...prev, errorBalance: msg })),
    );
  };

  return (
    <Service
      title="BALLS"
      serviceName="Баллы"
      validationErrors={validationErrors}
      onSubmit={onSubmit}
    >
      <>
        <h3 className={styles.title_service}>
          Баллы можно приобрести только на один месяц
        </h3>
        <input
          type="number"
          className={styles.input}
          onChange={handleBallsChange}
          placeholder="Один балл стоит один рубль"
        />
      </>
    </Service>
  );
}
