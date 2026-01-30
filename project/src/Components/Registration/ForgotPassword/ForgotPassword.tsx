"use client";

import styles from "../Login/Login.module.scss";
import { useForgotPasswordMutation } from "@/redux/apiSlice/authApi";
import { useRef, useState } from "react";
import { Email, EmailSchema } from "@/types/type";
import { toast } from "react-toastify";
import { handleToastError, validateWithZod } from "@/lib/common";
import Home from "@/Components/Home/Home";

export default function ForgotPassword() {
  // Добавляем isLoading из хука для управления состоянием кнопки
  const [forgotPasswordMutation, { isLoading }] = useForgotPasswordMutation();
  const emailRef = useRef<HTMLInputElement>(null);
  const [validationError, setValidationError] = useState({
    errorEmail: "",
  });

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (emailRef.current) {
      const formData: Email = {
        email: emailRef.current.value.trim(),
      };

      const isValid = validateWithZod<Email>(
        EmailSchema,
        formData,
        (errors) => {
          setValidationError({
            errorEmail: errors.email ?? "",
          });
        }
      );

      if (isValid) {
        try {
          await forgotPasswordMutation({ email: formData.email }).unwrap();
          toast.success("Ссылка для сброса пароля отправлена на вашу почту.");

          // Очищаем форму
          if (emailRef.current) emailRef.current.value = "";
        } catch (error) {
          handleToastError(error);
        }
      }
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.loginForm}>
        <h1 className={styles.title}>Забыли пароль</h1>
        <div className={styles.wrapper}>
          <Home />
          <form className={styles.form} onSubmit={onSubmit}>
            <input
              type="text"
              className={styles.input}
              placeholder="Email"
              ref={emailRef}
              autoComplete="email"
            />
            {/* Теперь validationError определен и будет работать */}
            {validationError.errorEmail && (
              <p className={styles.error}>{validationError.errorEmail}</p>
            )}

            <button
              type="submit"
              className={styles.loginButton}
              disabled={isLoading}
            >
              {isLoading ? "Отправка..." : "Сбросить пароль"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
