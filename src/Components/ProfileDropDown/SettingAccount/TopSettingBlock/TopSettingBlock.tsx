"use client";
import styles from "../SettingAccount.module.scss";
import {
  useGetInfoUserQuery,
  useUpdateUserInfoMutation,
} from "@/redux/apiSlice/settingAccountApi";
import { useEffect, useRef, useState } from "react";
import { handleSubmit } from "@/lib/common";
import {
  SettingAccount,
  SettingAccountWithoutUrl,
  SettingSchemaWithoutUrl,
} from "@/types/type";
import { toast } from "react-toastify";
import UploadImg from "./UploadImg/UploadImg";

export default function TopSettingBlock() {
  const { data, isLoading } = useGetInfoUserQuery();
  const [updateUser] = useUpdateUserInfoMutation();
  const loginRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  const [validationError, setValidationError] = useState({
    errorEmail: "",
    errorLogin: "",
  });

  const [info, setInfo] = useState<SettingAccount>({
    email: "",
    login: "",
    avatarUrl: "",
  });

  useEffect(() => {
    if (data?.data && !isLoading) {
      setInfo(data.data);
    }
  }, [data, isLoading]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    if (!emailRef.current || !loginRef.current) return;

    const userData: SettingAccountWithoutUrl = {
      email: emailRef.current.value,
      login: loginRef.current.value,
    };
    await handleSubmit<
      SettingAccountWithoutUrl,
      SettingAccountWithoutUrl,
      SettingAccountWithoutUrl
    >(
      e,
      (errors) => {
        setValidationError({
          errorEmail: errors.email || "",
          errorLogin: errors.login || "",
        });
      },
      updateUser,
      userData,
      SettingSchemaWithoutUrl,
      userData,
      (result) => {
        if (result.data && result.statusCode >= 200) {
          toast.success("Данные успешно обновлены");
          setValidationError({ errorEmail: "", errorLogin: "" });
          setInfo((prev) => {
            const newInfo: SettingAccount = {
              avatarUrl: prev.avatarUrl,
              email: userData.email,
              login: userData.login,
            };
            return newInfo;
          });
        }
      }
    );
  };

  return (
    <div className={styles.setting_block}>
      {/* Левая колонка — форма профиля */}
      <form className={styles.setting_form} onSubmit={onSubmit}>
        <input
          type="text"
          placeholder="Логин"
          className={styles.setting_input}
          ref={loginRef}
          defaultValue={info?.login ?? ""}
        />
        {validationError.errorLogin && (
          <p className={styles.error}>{validationError.errorLogin}</p>
        )}

        <input
          type="text"
          placeholder="Email"
          className={styles.setting_input}
          ref={emailRef}
          defaultValue={info?.email ?? ""}
        />
        {validationError.errorEmail && (
          <p className={styles.error}>{validationError.errorEmail}</p>
        )}

        <button type="submit" className={styles.setting_button}>
          Сохранить изменения
        </button>
      </form>

      {/* Правая колонка — аватар */}
      <UploadImg avatarUrl={info.avatarUrl} />
    </div>
  );
}
