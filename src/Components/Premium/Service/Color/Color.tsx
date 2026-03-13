"use client";
import ColorBlock from "../Elements/ColorBlock/ColorBlock";
import Service from "../Service";
import TermBlock from "../Elements/TermBlock/TermBlock";
import styles from "../Service.module.scss";
import {
  ColorType,
  colorSchema,
  ColorValidation,
  PlanUnionLiteral,
  HexColorLiteral,
} from "@/types/service.type";
import { handleSubmit } from "@/lib/common";
import {
  useUpdateServiceColorMutation,
  useGetPriceQuery,
} from "@/redux/apiSlice/paymentApi";
import { useState } from "react";
import { toast } from "react-toastify";
import { useRefreshServer } from "@/Hooks/useRefreshServer";
export default function Color() {
  const [color, setColor] = useState<HexColorLiteral | "none">("none");
  const [purchaseService] = useUpdateServiceColorMutation();
  const [selectedPlan, setSelectedPlan] = useState<PlanUnionLiteral | null>(
    null,
  );
  const [selectedPrice, setSelectedPrice] = useState<number>(0);
  const { data } = useGetPriceQuery({ service: "color" });
  const refreshServer = useRefreshServer();
  const [validationErrors, setValidationErrors] = useState({
    errorServerIpPort: "",
    errorEmail: "",
    errorOffer: "",
    errorPlan: "",
    errorColor: "",
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

    if (color === "none") {
      toast.error("Выберите цвет");
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

    const formData: ColorType = {
      serverIpPort: refs.serverRef.current.value,
      email: refs.emailRef.current.value,
      plan: selectedPlan,
      services: "color",
      amount: selectedPrice,
      color,
    };

    const validation: ColorValidation = {
      serverIpPort: refs.serverRef.current.value,
      email: refs.emailRef.current.value,
      offer: refs.offerRef.current.checked || false,
      plan: selectedPlan,
      services: "color",
      color,
    };

    handleSubmit<ColorValidation, ColorType, void>(
      e,
      (errors) => {
        setValidationErrors({
          errorServerIpPort: errors.serverIpPort || "",
          errorEmail: errors.email || "",
          errorOffer: errors.offer || "",
          errorPlan: errors.plan || "",
          errorColor: errors.color || "none",
          errorBalance: errors.balance || "",
        });
      },
      purchaseService,
      validation,
      colorSchema,
      formData,
      (data) => {
        toast.success(
          "Услуга успешно заказана и появится на вашем сервере через 1 минуту",
        );
        refreshServer(refs.serverRef.current!.value);
        setSelectedPlan(null);
        setSelectedPrice(0);
        setColor("none");
        if (refs.serverRef.current) refs.serverRef.current.value = "";
        if (refs.emailRef.current) refs.emailRef.current.value = "";
        if (refs.offerRef.current) refs.offerRef.current.checked = false;
      },
      (msg) => setValidationErrors((prev) => ({ ...prev, errorBalance: msg })),
    );
  };

  return (
    <Service
      title="COLOR"
      serviceName="ЦВЕТ"
      validationErrors={validationErrors}
      onSubmit={onSubmit}
    >
      <>
        <h3 className={styles.title_service}>Срок услуги</h3>
        <TermBlock
          price={data && data.data ? data.data : [0, 0, 0, 0]}
          discount={["", "(Скидка 5%)", "(Скидка 10%)", "(Скидка 15%)"]}
          selectedPlan={selectedPlan || undefined}
          onSelectPlan={handlePlanSelect}
        />
        <ColorBlock setColor={setColor} />
      </>
    </Service>
  );
}
