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
import { useUpdateServiceColorMutation } from "@/redux/apiSlice/paymentApi";
import { useState } from "react";
import { toast } from "react-toastify";
export default function Color() {
  const [color, setColor] = useState<HexColorLiteral | "none">("none");
  const [purchaseService] = useUpdateServiceColorMutation();
  const [selectedPlan, setSelectedPlan] = useState<PlanUnionLiteral | null>(
    null
  );
  const [selectedPrice, setSelectedPrice] = useState<number>(0);

  const [validationErrors, setValidationErrors] = useState({
    errorServerIpPort: "",
    errorEmail: "",
    errorOffer: "",
    errorPlan: "",
    errorColor: "",
  });

  const handlePlanSelect = (plan: PlanUnionLiteral, price: number) => {
    setSelectedPlan(plan);
    setSelectedPrice(price);
    setValidationErrors((prev) => ({ ...prev, errorPlan: "" }));
  };

  return (
    <div>
      <ColorBlock setColor={setColor} />
    </div>
  );
}
