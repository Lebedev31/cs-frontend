"use client";
import Link from "next/link";
import styles from "./Service.module.scss";
import { useGetServerIpPortQuery } from "@/redux/apiSlice/addServerApi";
import { useRef, ReactNode } from "react";

type ServiceProps = {
  title: string;
  serviceName: string;
  children?: ReactNode;
  validationErrors: {
    errorServerIpPort: string;
    errorEmail: string;
    errorOffer: string;
    errorPlan: string;
  };
  onSubmit: (
    e: React.FormEvent<HTMLFormElement>,
    refs: {
      serverRef: React.RefObject<HTMLSelectElement | null>;
      emailRef: React.RefObject<HTMLInputElement | null>;
      offerRef: React.RefObject<HTMLInputElement | null>;
    }
  ) => void;
};

export default function Service({
  title,
  serviceName,
  children,
  validationErrors,
  onSubmit,
}: ServiceProps) {
  const { data } = useGetServerIpPortQuery();
  const serverRef = useRef<HTMLSelectElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const offerRef = useRef<HTMLInputElement>(null);

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(e, { serverRef, emailRef, offerRef });
  };

  return (
    <section className={styles.service}>
      <h2 className={styles.title}>Заказ услуги — {serviceName}</h2>

      <form className={styles.wrapper} onSubmit={handleFormSubmit}>
        <div className={styles.inputWrapper}>
          <select ref={serverRef} className={styles.select}>
            <option value="">
              Выберете сервер (раскрыть список серверов пользователя)
            </option>
            {data && data.data
              ? data.data.map((item) => {
                  return (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  );
                })
              : null}
          </select>
          {validationErrors.errorServerIpPort && (
            <p className={styles.error}>{validationErrors.errorServerIpPort}</p>
          )}
        </div>

        <input
          ref={emailRef}
          className={styles.input}
          placeholder="Электронная почта для чека"
          type="email"
        />
        {validationErrors.errorEmail && (
          <p className={styles.error}>{validationErrors.errorEmail}</p>
        )}

        {children}

        <div className={styles.offer_block}>
          <input ref={offerRef} className={styles.offer} type="checkbox" />
          <Link href={"#"}>
            <span>Я принимаю условия офферты</span>
          </Link>
        </div>
        {validationErrors.errorOffer && (
          <p className={styles.error}>{validationErrors.errorOffer}</p>
        )}

        {validationErrors.errorPlan && (
          <p className={styles.error}>{validationErrors.errorPlan}</p>
        )}

        <button type="submit" className={styles.service_button}>
          Оплатить
        </button>

        <hr className={styles.line} />

        <div className={styles.infoBlock}>
          <p>
            Расположение VIP серверов среди других VIP серверов зависит от
            количества баллов. Вы можете купить баллы, чтобы повысить рейтинг
            сервера среди других VIP серверов.
          </p>
          <p>
            При повторной покупке услуги для сервера, у которого уже
            активирована данная услуга — время действия будет продлено.
          </p>
          <p className={styles.warning}>
            При покупке товаров и/или услуг на данном сайте — возврат средств не
            осуществляется!
          </p>
        </div>
      </form>
    </section>
  );
}
