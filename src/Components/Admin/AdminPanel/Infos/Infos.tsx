"use client";

import { useState, useEffect } from "react";
import styles from "./Infos.module.scss";
import AdminAccordion from "../AdminAccordion/AdminAccordion";
import {
  useGetPricesQuery,
  useUpdatePricesMutation,
  ServicePrices,
  UpdatePricesPayload,
} from "@/redux/apiSlice/adminApi";
import { toast } from "react-toastify";

type ServiceKey = "vip" | "top" | "color";
type PlanKey = keyof ServicePrices;

const SERVICE_LABELS: Record<ServiceKey, string> = {
  vip: "VIP Статус",
  top: "TOP Статус",
  color: "Выделение цветом",
};

const PLAN_LABELS: Record<PlanKey, string> = {
  oneWeek: "1 Неделя",
  month: "1 Месяц",
  sixMonth: "6 Месяцев",
  year: "1 Год",
};

const SERVICES: ServiceKey[] = ["vip", "top", "color"];
const PLANS: PlanKey[] = ["oneWeek", "month", "sixMonth", "year"];

type PriceInputs = Record<ServiceKey, Record<PlanKey, string>>;

const buildInitialInputs = (
  data: Record<ServiceKey, ServicePrices> | null,
): PriceInputs => {
  const result = {} as PriceInputs;
  for (const service of SERVICES) {
    result[service] = {} as Record<PlanKey, string>;
    for (const plan of PLANS) {
      result[service][plan] = data ? String(data[service][plan]) : "";
    }
  }
  return result;
};

export default function Infos() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputs, setInputs] = useState<PriceInputs>(buildInitialInputs(null));
  const [dirty, setDirty] = useState<Set<string>>(new Set());

  const { data: pricesData, isLoading } = useGetPricesQuery(undefined, {
    skip: !isOpen,
  });
  const [updatePrices, { isLoading: isSaving }] = useUpdatePricesMutation();

  useEffect(() => {
    if (pricesData?.data) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setInputs(buildInitialInputs(pricesData.data as any));
      setDirty(new Set());
    }
  }, [pricesData]);

  const handleToggle = (open: boolean) => {
    setIsOpen(open);
  };

  const handleChange = (service: ServiceKey, plan: PlanKey, value: string) => {
    // Только цифры
    if (value !== "" && !/^\d+$/.test(value)) return;

    setInputs((prev) => ({
      ...prev,
      [service]: { ...prev[service], [plan]: value },
    }));
    setDirty((prev) => new Set(prev).add(`${service}.${plan}`));
  };

  const handleSave = async () => {
    const payload: UpdatePricesPayload = {};

    for (const service of SERVICES) {
      for (const plan of PLANS) {
        if (!dirty.has(`${service}.${plan}`)) continue;

        const val = parseInt(inputs[service][plan], 10);
        if (isNaN(val) || val <= 0) {
          toast.error(
            `Некорректная цена: ${SERVICE_LABELS[service]} — ${PLAN_LABELS[plan]}`,
          );
          return;
        }

        if (!payload[service]) payload[service] = {};
        payload[service]![plan] = val;
      }
    }

    if (Object.keys(payload).length === 0) {
      toast.info("Нет изменений для сохранения");
      return;
    }

    try {
      await updatePrices(payload).unwrap();
      toast.success("Цены успешно обновлены");
      setDirty(new Set());
    } catch {
      toast.error("Ошибка при обновлении цен");
    }
  };

  return (
    <AdminAccordion title="Управление ценами" icon="💰" onToggle={handleToggle}>
      {isLoading ? (
        <p className={styles.loading}>Загрузка...</p>
      ) : (
        <div className={styles.content}>
          <div className={styles.grid}>
            {SERVICES.map((service) => (
              <div key={service} className={styles.card}>
                <h4 className={styles.cardTitle}>{SERVICE_LABELS[service]}</h4>
                <div className={styles.plans}>
                  {PLANS.map((plan) => {
                    const isDirty = dirty.has(`${service}.${plan}`);
                    return (
                      <div key={plan} className={styles.planRow}>
                        <label className={styles.planLabel}>
                          {PLAN_LABELS[plan]}
                        </label>
                        <div className={styles.inputWrapper}>
                          <input
                            type="text"
                            className={`${styles.priceInput} ${
                              isDirty ? styles.priceInput_dirty : ""
                            }`}
                            value={inputs[service][plan]}
                            onChange={(e) =>
                              handleChange(service, plan, e.target.value)
                            }
                          />
                          <span className={styles.currency}>₽</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <button
            className={styles.saveBtn}
            onClick={handleSave}
            disabled={isSaving || dirty.size === 0}
          >
            {isSaving
              ? "Сохранение..."
              : `Сохранить изменения ${dirty.size > 0 ? `(${dirty.size})` : ""}`}
          </button>
        </div>
      )}
    </AdminAccordion>
  );
}
