"use client";
import Link from "next/link";
import styles from "./Premium.module.scss";
import { ServiceUnionLiteral, BoxShadowUnionType } from "@/types/service.type";
import { useState } from "react";
import ViewServices from "./Service/ViewServices/ViewServices";

interface Service {
  id: ServiceUnionLiteral;
  number: number;
  title: string;
  description: string;
  colorClass: string;
  link: string;
  boxShadowColor: BoxShadowUnionType;
}

export default function Premium() {
  const [boxShadowColor, setBoxShadowColor] = useState<BoxShadowUnionType | "">(
    ""
  );
  const [open, setOpen] = useState<boolean>(false);
  const [type, setType] = useState<ServiceUnionLiteral | "">("");

  const viewServices = (
    color: BoxShadowUnionType,
    type: ServiceUnionLiteral
  ) => {
    setBoxShadowColor(color);
    setOpen(true);
    setType(type);
  };
  const services: Service[] = [
    {
      id: "vip",
      number: 1,
      title: "VIP",
      description: "Ваш сервер будет поднят в топ списка серверов",
      colorClass: "gold",
      link: "/premium/servicePage/",
      boxShadowColor: "#ffd700",
    },
    {
      id: "top",
      number: 2,
      title: "TOP",
      description: "Ваш сервер будет находится в отдельном списке TOP серверов",
      colorClass: "blue",
      link: "/premium/servicePage/",
      boxShadowColor: "#4c8aff",
    },
    {
      id: "color",
      number: 3,
      title: "ЦВЕТ",
      description: "Ваш сервер будет окрашен в цвет, который вы выберете",
      colorClass: "red",
      link: "/premium/servicePage/",
      boxShadowColor: "#ff4c4c",
    },
    {
      id: "balls",
      number: 4,
      title: "БАЛЛЫ",
      description:
        "При покупке Баллов, Ваш сервер поднимается выше в общем списке серверов",
      colorClass: "green",
      link: "/premium/servicePage/",
      boxShadowColor: "#39ff14",
    },
  ];

  return (
    <div className={styles.container}>
      {open ? (
        <ViewServices
          colorBoxShadow={boxShadowColor}
          setOpen={setOpen}
          typeServices={type}
        />
      ) : null}
      <h1 className={styles.title}>Платные услуги для продвижения</h1>

      <div className={styles.servicesGrid}>
        {services.map((service) => (
          <div
            key={service.id}
            className={`${styles.serviceCard} ${styles[service.colorClass]}`}
          >
            <div className={styles.serviceContent}>
              <h2 className={styles.serviceTitle}>{service.title}</h2>
              <p className={styles.serviceDescription}>{service.description}</p>

              <div className={styles.priceSection}>
                <Link href={service.link + service.id}>
                  <button
                    className={`${styles.servicePayment} ${
                      styles[
                        `btn${
                          service.colorClass.charAt(0).toUpperCase() +
                          service.colorClass.slice(1)
                        }`
                      ]
                    }`}
                  >
                    {" "}
                    Заказать услугу
                  </button>
                </Link>
              </div>
            </div>
            <button
              onMouseEnter={() =>
                viewServices(service.boxShadowColor, service.id)
              }
              className={`${styles.questionBtn} ${
                styles[
                  `btnQuestion${
                    service.colorClass.charAt(0).toUpperCase() +
                    service.colorClass.slice(1)
                  }`
                ]
              }`}
            >
              ?
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
