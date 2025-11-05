"use client";
import Service from "../Service";
import TermBlock from "../Elements/TermBlock/TermBlock";
import styles from "../Service.module.scss";
import {
  BallsType,
  ballsSchema,
  BallsValidation,
  BallsLiteral,
  PlanUnionLiteral,
} from "@/types/service.type";
import { handleSubmit } from "@/lib/common";
import { useUpdateServiceBallsMutation } from "@/redux/apiSlice/paymentApi";
import { useState } from "react";
import { toast } from "react-toastify";
import BallsBlock from "../Elements/BallsBlock/BallsBlock";

export default function Balls() {
  const [purchaseService] = useUpdateServiceBallsMutation();
  const [balls, setBalls] = useState<BallsLiteral>("0");
  const [selectedPlan, setSelectedPlan] = useState<PlanUnionLiteral | null>(
    null
  );
  const [selectedPrice, setSelectedPrice] = useState<number>(0);

  const [validationErrors, setValidationErrors] = useState({
    errorServerIpPort: "",
    errorEmail: "",
    errorOffer: "",
    errorPlan: "",
    errorBalls: "",
  });

  const handlePlanSelect = (plan: PlanUnionLiteral, price: number) => {
    setSelectedPlan(plan);
    setSelectedPrice(price);
    setValidationErrors((prev) => ({ ...prev, errorPlan: "" }));
  };

  const onSubmit = (
    e: React.FormEvent<HTMLFormElement>,
    refs: {
      serverRef: React.RefObject<HTMLSelectElement | null>;
      emailRef: React.RefObject<HTMLInputElement | null>;
      offerRef: React.RefObject<HTMLInputElement | null>;
    }
  ) => {
    if (!selectedPlan) {
      setValidationErrors((prev) => ({
        ...prev,
        errorPlan: "Выберите тарифный план",
      }));
      return;
    }

    if (balls === "0") {
      toast.error("Выберите пак баллов");
      return;
    }

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
      plan: selectedPlan,
      services: "balls",
      amount: selectedPrice + Number(balls),
      balls,
    };

    const validation: BallsValidation = {
      serverIpPort: refs.serverRef.current.value,
      email: refs.emailRef.current.value,
      offer: refs.offerRef.current.checked || false,
      plan: selectedPlan,
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
        });
      },
      purchaseService,
      validation,
      ballsSchema,
      formData,
      (data) => {
        toast.success(data.message || "Услуга успешно заказана!");
        setSelectedPlan(null);
        setSelectedPrice(0);
        if (refs.serverRef.current) refs.serverRef.current.value = "";
        if (refs.emailRef.current) refs.emailRef.current.value = "";
        if (refs.offerRef.current) refs.offerRef.current.checked = false;
      }
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
        <h3 className={styles.title_service}>Срок услуги</h3>
        <TermBlock
          price={[150, 300, 550, 5000]}
          selectedPlan={selectedPlan || undefined}
          onSelectPlan={handlePlanSelect}
        />
        <h4 className={styles.title_service}> 1 балл стоит 1 рубль</h4>
        <BallsBlock setBalls={setBalls} initialBalls={balls} />
      </>
    </Service>
  );
}
