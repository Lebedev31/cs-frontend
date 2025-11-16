"use client";
import styles from "../Login/Login.module.scss";
import { useCreateNewPasswordMutation } from "@/redux/apiSlice/authApi";
import { useRef, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { Password, PasswordSchema } from "@/types/type";
import { handleToastError, validateWithZod } from "@/lib/common";
import { useSearchParams } from "next/navigation";
import Home from "@/Components/Home/Home";

export default function ChangePassword() {
  const [createNewPasswordMutation, { isLoading }] =
    useCreateNewPasswordMutation();
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [validationError, setValidationError] = useState({
    errorPassword: "",
    errorConfirmPassword: "",
  });
  const token = searchParams.get("token")!;

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (passwordRef.current && confirmPasswordRef.current) {
      const formData: Password = {
        password: passwordRef.current.value,
        confirmPassword: confirmPasswordRef.current.value,
      };

      // Валидация в стиле компонента Login
      const isValid = validateWithZod<Password>(
        PasswordSchema,
        formData,
        (errors) => {
          setValidationError({
            errorPassword: errors.password ?? "",
            errorConfirmPassword: errors.confirmPassword ?? "",
          });
        }
      );

      if (isValid) {
        try {
          await createNewPasswordMutation({
            password: formData.password,
            token,
          }).unwrap();

          toast.success("Пароль успешно изменен!");

          if (passwordRef.current) passwordRef.current.value = "";
          if (confirmPasswordRef.current) confirmPasswordRef.current.value = "";
          router.push("/login");
        } catch (error) {
          handleToastError(error);
        }
      }
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.loginForm}>
        <h1 className={styles.title}>Создание нового пароля</h1>
        <Home />
        <form className={styles.form} onSubmit={onSubmit}>
          <input
            type="password"
            className={styles.input}
            placeholder="Новый пароль"
            ref={passwordRef}
          />
          {validationError.errorPassword && (
            <p className={styles.error}>{validationError.errorPassword}</p>
          )}

          <input
            type="password"
            className={styles.input}
            placeholder="Подтвердите новый пароль"
            ref={confirmPasswordRef}
            autoComplete="new-password"
          />
          {validationError.errorConfirmPassword && (
            <p className={styles.error}>
              {validationError.errorConfirmPassword}
            </p>
          )}

          <button
            type="submit"
            className={styles.loginButton}
            disabled={isLoading}
          >
            {isLoading ? "Изменение..." : "Изменить пароль"}
          </button>
        </form>
      </div>
    </div>
  );
}
