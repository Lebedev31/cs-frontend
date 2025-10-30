"use client";
import Link from "next/link";
import styles from "./Service.module.scss";
import { useGetServerIpPortQuery } from "@/redux/apiSlice/addServerApi";

export default function Service({ children }: { children?: React.ReactNode }) {
  const { data } = useGetServerIpPortQuery();
  return (
    <section className={styles.service}>
      <h2 className={styles.title}>Заказ услуги — VIP</h2>

      <form className={styles.wrapper}>
        <select className={styles.select}>
          <option value="">
            Выберете сервер (раскрыть список серверов пользователя)
          </option>
          {data && data.data
            ? data.data.map((item) => {
                return <option key={item}>{item}</option>;
              })
            : null}
        </select>

        <input
          className={styles.input}
          placeholder="Электронная почта для чека"
          type="email"
        />
        {children}
        <div className={styles.offer_block}>
          <input className={styles.offer} type="checkbox" />
          <Link href={"#"}>
            {" "}
            <span>Я принимаю условия офферты</span>{" "}
          </Link>
        </div>

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
