"use client";

import Service from "../Service";
import TermBlock from "../Elements/TermBlock/TermBlock";
import styles from "../Service.module.scss";
import {
  VipType,
  generalSchema,
  PlanUnionLiteral,
  VipValidationType,
} from "@/types/service.type";
import { handleSubmit } from "@/lib/common";
import { useState } from "react";
import { toast } from "react-toastify";
import TopBlock from "../Elements/TopBlock/TopBlock";
import { useUpdateServiceTopMutation } from "@/redux/apiSlice/paymentApi";

export default function Top() {
  const [purchaseService] = useUpdateServiceTopMutation();
  const [selectedPlan, setSelectedPlan] = useState<PlanUnionLiteral | null>(
    null
  );
  const [selectedPrice, setSelectedPrice] = useState<number>(0);
  const [topLimit, setTopLimit] = useState<number>(0);

  const [validationErrors, setValidationErrors] = useState({
    errorServerIpPort: "",
    errorEmail: "",
    errorOffer: "",
    errorPlan: "",
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

    if (topLimit === 0) {
      toast.error("Извините мест в топе больше не осталось");
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

    const formData: VipType = {
      serverIpPort: refs.serverRef.current.value,
      email: refs.emailRef.current.value,
      plan: selectedPlan,
      services: "top",
      amount: selectedPrice,
    };

    const validation: VipValidationType = {
      serverIpPort: refs.serverRef.current.value,
      email: refs.emailRef.current.value,
      offer: refs.offerRef.current.checked || false,
      plan: selectedPlan,
      services: "top",
    };

    handleSubmit<VipValidationType, VipType, void>(
      e,
      (errors) => {
        setValidationErrors({
          errorServerIpPort: errors.serverIpPort || "",
          errorEmail: errors.email || "",
          errorOffer: errors.offer || "",
          errorPlan: errors.plan || "",
        });
      },
      purchaseService,
      validation,
      generalSchema,
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
      title="TOP"
      serviceName="TOP"
      validationErrors={validationErrors}
      onSubmit={onSubmit}
    >
      <>
        <h3 className={styles.title_service}>Срок услуги</h3>
        <TopBlock selectTopLimit={setTopLimit} topLimit={topLimit} />
        <TermBlock
          price={[200, 400, 750, 7000]}
          selectedPlan={selectedPlan || undefined}
          onSelectPlan={handlePlanSelect}
        />
      </>
    </Service>
  );
}
