"use client";
import styles from "./PaymentForm.module.scss";
import { Payment, PaymentSchema, RedirectYooCassa } from "@/types/type";
import { useCreatePaymentMutation } from "@/redux/apiSlice/paymentApi";
import { useState, useRef } from "react";
import { handleSubmit } from "@/lib/common";

export default function PaymentForm() {
  const paymentRef = useRef<HTMLInputElement>(null);
  const [createPayment] = useCreatePaymentMutation();
  const [validationError, setValidationError] = useState({
    errorPayment: "",
  });

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const amount = Number(paymentRef?.current?.value);
    console.log(amount);
    if (!amount) {
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
          <p className={styles.balanceLabel}>Ваш текущий баланс — (сумма)</p>
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
