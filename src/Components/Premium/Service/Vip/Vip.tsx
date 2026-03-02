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
import {
  useUpdateServiceVipMutation,
  useGetPriceQuery,
} from "@/redux/apiSlice/paymentApi";
import { useState } from "react";
import { toast } from "react-toastify";

export default function Vip() {
  const [purchaseService] = useUpdateServiceVipMutation();
  const [selectedPlan, setSelectedPlan] = useState<PlanUnionLiteral | null>(
    null,
  );
  const [selectedPrice, setSelectedPrice] = useState<number>(0);
  const { data } = useGetPriceQuery({ service: "vip" });
  const [validationErrors, setValidationErrors] = useState({
    errorServerIpPort: "",
    errorEmail: "",
    errorOffer: "",
    errorPlan: "",
    errorBalance: "",
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
    },
  ) => {
    if (!selectedPlan) {
      setValidationErrors((prev) => ({
        ...prev,
        errorPlan: "Выберите тарифный план",
      }));
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
      services: "vip",
      amount: selectedPrice,
    };

    const validation: VipValidationType = {
      serverIpPort: refs.serverRef.current.value,
      email: refs.emailRef.current.value,
      offer: refs.offerRef.current.checked || false,
      plan: selectedPlan,
      services: "vip",
    };

    handleSubmit<VipValidationType, VipType, void>(
      e,
      (errors) => {
        setValidationErrors({
          errorServerIpPort: errors.serverIpPort || "",
          errorEmail: errors.email || "",
          errorOffer: errors.offer || "",
          errorPlan: errors.plan || "",
          errorBalance: errors.balance || "",
        });
      },
      purchaseService,
      validation,
      generalSchema,
      formData,
      (data) => {
        toast.success(
          "Услуга успешно заказана и появится на вашем сервере через 1 минуту",
        );
        setSelectedPlan(null);
        setSelectedPrice(0);
        if (refs.serverRef.current) refs.serverRef.current.value = "";
        if (refs.emailRef.current) refs.emailRef.current.value = "";
        if (refs.offerRef.current) refs.offerRef.current.checked = false;
      },
      (msg) => setValidationErrors((prev) => ({ ...prev, errorBalance: msg })),
    );
  };

  return (
    <Service
      title="VIP"
      serviceName="VIP"
      validationErrors={validationErrors}
      onSubmit={onSubmit}
    >
      <>
        <h3 className={styles.title_service}>Срок услуги</h3>
        <TermBlock
          price={data && data.data ? data.data : [0, 0, 0, 0]}
          discount={["", "(скидка 5%)", "(скидка 10%)", "(скидка 15%)"]}
          selectedPlan={selectedPlan || undefined}
          onSelectPlan={handlePlanSelect}
        />
      </>
    </Service>
  );
}
