"use client";

import { useState } from "react";
import styles from "./AdminServices.module.scss";
import {
  useAddServiceMutation,
  useDeleteServiceMutation,
  AdminServerService,
} from "@/redux/apiSlice/adminApi";
import {
  standardHexColors,
  PlanUnionLiteral,
  ServiceUnionLiteral,
} from "@/types/service.type";

const PLAN_OPTIONS: { value: PlanUnionLiteral; label: string }[] = [
  { value: "oneWeek", label: "1 Неделя" },
  { value: "month", label: "1 Месяц" },
  { value: "sixMonth", label: "6 Месяцев" },
  { value: "year", label: "1 Год" },
];

export default function AdminServices({
  serverId,
  initialServices,
}: {
  serverId: string;
  initialServices: AdminServerService;
}) {
  const [selectedType, setSelectedType] = useState<ServiceUnionLiteral>("vip");
  const [plan, setPlan] = useState<PlanUnionLiteral>("month");
  const [ballsQuantity, setBallsQuantity] = useState(100);
  const [colorHex, setColorHex] = useState(standardHexColors[0]);

  const [addService, { isLoading: isAdding }] = useAddServiceMutation();
  const [deleteService, { isLoading: isDeleting }] = useDeleteServiceMutation();

  const handleAdd = async () => {
    try {
      await addService({
        serverId,
        services: selectedType,
        plan,
        ...(selectedType === "color" ? { color: colorHex } : {}),
        ...(selectedType === "balls" ? { balls: ballsQuantity } : {}),
      }).unwrap();
    } catch (e) {
      console.error("Ошибка добавления услуги", e);
    }
  };

  const handleDelete = async (
    service: ServiceUnionLiteral,
    ballsPackId?: string,
  ) => {
    try {
      await deleteService({ serverId, service, ballsPackId }).unwrap();
    } catch (e) {
      console.error("Ошибка удаления услуги", e);
    }
  };

  const hasAnyService =
    initialServices?.vip?.status ||
    initialServices?.top?.status ||
    initialServices?.color?.status ||
    (initialServices?.balls?.status &&
      initialServices.balls.listService.length > 0);

  return (
    <div className={styles.container}>
      {/* Активные услуги */}
      <div className={styles.listSection}>
        <h4 className={styles.title}>Активные услуги</h4>

        {!hasAnyService ? (
          <p className={styles.empty}>Нет подключенных услуг</p>
        ) : (
          <div className={styles.servicesRow}>
            {initialServices.vip?.status && (
              <div className={styles.serviceItem}>
                <div className={styles.serviceInfo}>
                  <span className={styles.serviceName}>VIP</span>
                  <span className={styles.serviceTerm}>
                    до {new Date(initialServices.vip.term).toLocaleDateString()}
                  </span>
                </div>
                <button
                  className={styles.deleteBtn}
                  disabled={isDeleting}
                  onClick={() => handleDelete("vip")}
                >
                  ×
                </button>
              </div>
            )}

            {initialServices.top?.status && (
              <div className={styles.serviceItem}>
                <div className={styles.serviceInfo}>
                  <span className={styles.serviceName}>TOP</span>
                  <span className={styles.serviceTerm}>
                    до {new Date(initialServices.top.term).toLocaleDateString()}
                  </span>
                </div>
                <button
                  className={styles.deleteBtn}
                  disabled={isDeleting}
                  onClick={() => handleDelete("top")}
                >
                  ×
                </button>
              </div>
            )}

            {initialServices.color?.status && (
              <div className={styles.serviceItem}>
                <div className={styles.serviceInfo}>
                  <span className={styles.serviceName}>Цвет</span>
                  <span className={styles.serviceTerm}>
                    до{" "}
                    {new Date(initialServices.color.term).toLocaleDateString()}
                  </span>
                </div>
                <span
                  className={styles.colorSwatch}
                  style={{
                    backgroundColor: initialServices.color.colorName,
                  }}
                />
                <button
                  className={styles.deleteBtn}
                  disabled={isDeleting}
                  onClick={() => handleDelete("color")}
                >
                  ×
                </button>
              </div>
            )}

            {initialServices.balls?.status &&
              initialServices.balls.listService.map((pkg) => (
                <div key={pkg._id} className={styles.serviceItem}>
                  <div className={styles.serviceInfo}>
                    <span className={styles.serviceName}>
                      Баллы +{pkg.quantity}
                    </span>
                    <span className={styles.serviceTerm}>
                      до {new Date(pkg.term).toLocaleDateString()}
                    </span>
                  </div>
                  <button
                    className={styles.deleteBtn}
                    disabled={isDeleting}
                    onClick={() => handleDelete("balls", pkg._id)}
                  >
                    ×
                  </button>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Форма добавления */}
      <div className={styles.addSection}>
        <h4 className={styles.title}>Добавить услугу</h4>

        <div className={styles.formGroup}>
          <label>Тип услуги</label>
          <select
            value={selectedType}
            onChange={(e) =>
              setSelectedType(e.target.value as ServiceUnionLiteral)
            }
          >
            <option value="vip">VIP Статус</option>
            <option value="top">TOP Статус</option>
            <option value="color">Выделение цветом</option>
            <option value="balls">Баллы</option>
          </select>
        </div>

        {selectedType === "balls" && (
          <div className={styles.formGroup}>
            <label>Количество</label>
            <input
              type="number"
              min={1}
              value={ballsQuantity}
              onChange={(e) => setBallsQuantity(Number(e.target.value))}
            />
          </div>
        )}

        {selectedType === "color" && (
          <div className={styles.formGroup}>
            <label>Цвет</label>
            <div className={styles.colorPicker}>
              {standardHexColors.map((hex) => (
                <button
                  key={hex}
                  className={`${styles.colorOption} ${
                    colorHex === hex ? styles.colorOption_active : ""
                  }`}
                  style={{ backgroundColor: hex }}
                  onClick={() => setColorHex(hex)}
                  title={hex}
                />
              ))}
            </div>
          </div>
        )}

        {selectedType !== "balls" && (
          <div className={styles.formGroup}>
            <label>Срок действия</label>
            <select
              value={plan}
              onChange={(e) => setPlan(e.target.value as PlanUnionLiteral)}
            >
              {PLAN_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        )}

        <button
          className={styles.addBtn}
          onClick={handleAdd}
          disabled={isAdding}
        >
          {isAdding ? "Подключение..." : "Подключить"}
        </button>
      </div>
    </div>
  );
}
