"use client";
import styles from "./PaymentForm.module.scss";
import Link from "next/link";
import { toast } from "react-toastify";
import { Payment, PaymentSchema, RedirectYooCassa } from "@/types/type";
import { useCreatePaymentMutation } from "@/redux/apiSlice/paymentApi";
import { useState, useRef } from "react";
import { handleSubmit } from "@/lib/common";
import { useGetBalanceQuery } from "@/redux/apiSlice/paymentApi";

export default function PaymentForm() {
  const paymentRef = useRef<HTMLInputElement>(null);
  const { data } = useGetBalanceQuery();
  const [createPayment] = useCreatePaymentMutation();
  const [validationError, setValidationError] = useState({
    errorPayment: "",
  });
  const [agreed, setAgreed] = useState(false);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const amount = Number(paymentRef?.current?.value);
    console.log(amount);
    if (!amount) {
      return;
    }

    if (!agreed) {
      toast.error(
        "Пожалуйста, примите оферту и согласитесь на обработку данных платежным агрегатором"
      );
      return;
    }

    const order: Payment & { description: string } = {
      amount,
      description: "Пополнение баланса",
    };

    handleSubmit<Payment, Payment & { description: string }, RedirectYooCassa>(
      e,
      (error) => {
        setValidationError({
          errorPayment: error.amount || "",
        });
      },
      createPayment,
      { amount },
      PaymentSchema,
      order,
      (data) => {
        if (data.statusCode >= 200 && data.data) {
          window.location.href = data.data?.confirmation_url;
        }
      }
    );
  };

  return (
    <div className={styles.payment}>
      <div className={styles.container}>
        <h1 className={styles.title}>Пополнить баланс</h1>

        <div className={styles.balanceInfo}>
          <p className={styles.balanceLabel}>
            Ваш текущий баланс — {data && data.data ? data.data : 0}
          </p>
          <div className={styles.balanceLine}></div>
        </div>

        <form className={styles.form} onSubmit={onSubmit} noValidate>
          <div className={styles.inputGroup}>
            <span className={styles.label}>Пополнить баланс на</span>
            <div className={styles.inputWrapper}>
              <input
                type="number"
                placeholder="сумма"
                className={styles.input}
                ref={paymentRef}
              />
              <span className={styles.currency}>рублей</span>
            </div>
          </div>

          <div className={styles.agreementBlock}>
            <label className={styles.agreement} htmlFor="payment-agreement">
              <input
                id="payment-agreement"
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className={styles.agreementCheckbox}
              />
              <span className={styles.agreementText}>
                Я согласен с&nbsp;
                <Link href="/offer">
                  <span className={styles.agreementLink}>договором оферты</span>
                </Link>
                &nbsp;и&nbsp;
                <Link href="/agreement">
                  <span className={styles.agreementLink}>
                    пользовательским соглашением
                  </span>
                </Link>
                , а также даю согласие на&nbsp;обработку данных
                <a
                  className={styles.agreementLink}
                  href="https://yoomoney.ru/document/politika-konfidencialnosti-ooo-nko-yoomoney"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  &nbsp;платёжным агрегатором
                </a>
                .
              </span>
            </label>
          </div>

          {validationError.errorPayment && (
            <p className={styles.error}>{validationError.errorPayment}</p>
          )}
          <button type="submit" className={styles.button}>
            Пополнить
          </button>
        </form>
      </div>
    </div>
  );
}
