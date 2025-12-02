"use client";
import styles from "../SettingAccount.module.scss";
import { useState, useRef } from "react";
import { useUpdatePasswordMutation } from "@/redux/apiSlice/settingAccountApi";
import { toast } from "react-toastify";
import { UpdatePassword, UpdatePasswordSchema } from "@/types/type";
import { handleSubmit } from "@/lib/common";

export default function BottomSettingBlock() {
  const [updatePassword] = useUpdatePasswordMutation();
  const [validationError, setValidationError] = useState({
    errorOldPassword: "",
    errorPassword: "",
    errorConfirmPassword: "",
  });
  const oldPasswordRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    if (
      !oldPasswordRef.current ||
      !passwordRef.current ||
      !confirmPasswordRef.current
    )
      return;
    const passwordData: UpdatePassword = {
      oldPassword: oldPasswordRef.current.value,
      password: passwordRef.current.value,
      confirmPassword: confirmPasswordRef.current.value,
    };
    const requestBody: Omit<UpdatePassword, "confirmPassword"> = {
      password: passwordData.password,
      oldPassword: passwordData.oldPassword,
    };
    await handleSubmit<
      UpdatePassword,
      Omit<UpdatePassword, "confirmPassword">,
      void
    >(
      e,
      (errors) => {
        setValidationError({
          errorOldPassword: errors.oldPassword || "",
          errorPassword: errors.password || "",
          errorConfirmPassword: errors.confirmPassword || "",
        });
      },
      updatePassword,
      passwordData,
      UpdatePasswordSchema,
      requestBody,
      (data) => {
        if (data.statusCode >= 200) {
          toast.success("Пароль успешно изменен");
          setValidationError({
            errorOldPassword: "",
            errorPassword: "",
            errorConfirmPassword: "",
          });
        }
      }
    );
  };
  return (
    <section className={styles.password_section}>
      <h2 className={styles.password_title}>Смена пароля</h2>

      <div className={styles.wrapper_password_block}>
        <form className={styles.password_form} onSubmit={onSubmit}>
          <input
            type="password"
            placeholder="Старый пароль"
            className={styles.setting_input}
            ref={oldPasswordRef}
          />
          {validationError.errorOldPassword && (
            <p className={styles.error}>{validationError.errorOldPassword}</p>
          )}
          <input
            type="password"
            placeholder="Новый пароль"
            className={styles.setting_input}
            ref={passwordRef}
          />
          {validationError.errorPassword && (
            <p className={styles.error}>{validationError.errorPassword}</p>
          )}
          <input
            type="password"
            placeholder="Подтвердите новый пароль"
            className={styles.setting_input}
            ref={confirmPasswordRef}
          />
          {validationError.errorConfirmPassword && (
            <p className={styles.error}>
              {validationError.errorConfirmPassword}
            </p>
          )}
          <button type="submit" className={styles.change_password_button}>
            Изменить пароль
          </button>
        </form>
      </div>
    </section>
  );
}
