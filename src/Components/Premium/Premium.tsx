"use client";
import styles from "./Premium.module.scss";

type ServiceId = "vip" | "top" | "color" | "points";

interface Service {
  id: ServiceId;
  number: number;
  title: string;
  description: string;
  colorClass: string;
}

export default function Premium() {
  const services: Service[] = [
    {
      id: "vip",
      number: 1,
      title: "VIP",
      description: "Ваш сервер будет поднят в топ списка серверов",
      colorClass: "gold",
    },
    {
      id: "top",
      number: 2,
      title: "TOP",
      description: "Ваш сервер будет находится в отдельном списке TOP серверов",
      colorClass: "blue",
    },
    {
      id: "color",
      number: 3,
      title: "ЦВЕТ",
      description: "Ваш сервер будет окрашен в цвет, который вы выберете",
      colorClass: "red",
    },
    {
      id: "points",
      number: 4,
      title: "БАЛЛЫ",
      description:
        "При покупке Баллов, Ваш сервер поднимается выше в общем списке серверов",
      colorClass: "green",
    },
  ];

  return (
    <div className={styles.container}>
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
                  Заказать услугу
                </button>
              </div>
            </div>
            <button
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
