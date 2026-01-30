"use client";
import styles from "../Login/Login.module.scss";
import { RegistrationProps } from "../RegisterBlock";
import { useRef, useState } from "react";
import { UserSchema, User } from "@/types/type";
import { useRegisterMutation } from "@/redux/apiSlice/registrationApi";
import { toast } from "react-toastify";
import V2 from "@/Components/Registration/Recaptcha/V2";
import V3 from "@/Components/Registration/Recaptcha/V3";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import useRecaptcha from "../Recaptcha/useRecaptcha";
import { validateWithZod, handleToastError } from "@/lib/common";
import Home from "@/Components/Home/Home";
import Link from "next/link";

export default function Registration({ setToggle }: RegistrationProps) {
  const [registerMutation] = useRegisterMutation();
  const password = useRef<HTMLInputElement>(null);
  const login = useRef<HTMLInputElement>(null);
  const email = useRef<HTMLInputElement>(null);
  const confirmPassword = useRef<HTMLInputElement>(null);

  const {
    handleVerifyV2,
    handleVerifyV3,
    visibleV2,
    v2Token,
    v3Token,
    isVerifying,
  } = useRecaptcha();

  const [validationError, setValidationError] = useState({
    errorLogin: "",
    errorEmail: "",
    errorPassword: "",
    errorConfirmPassword: "",
    unionErrorForm: "",
  });

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const token = v2Token || v3Token;

    if (!token) {
      return;
    }

    if (isVerifying) {
      toast.info("Подождите, идет проверка...");
      return;
    }

    // Проверяем что все поля заполнены
    if (
      !login.current?.value ||
      !email.current?.value ||
      !password.current?.value ||
      !confirmPassword.current?.value
    ) {
      setValidationError((prev) => ({
        ...prev,
        unionErrorForm: "Заполните все поля формы",
      }));
      return;
    }

    const user: User = {
      login: login.current.value.trim(),
      email: email.current.value.trim(),
      password: password.current.value,
      confirmPassword: confirmPassword.current.value,
    };

    const isValid = validateWithZod<User>(UserSchema, user, (errors) => {
      setValidationError({
        errorLogin: errors.login ?? "",
        errorEmail: errors.email ?? "",
        errorPassword: errors.password ?? "",
        errorConfirmPassword: errors.confirmPassword ?? "",
        unionErrorForm: errors.unionErrorForm ?? "",
      });
    });

    if (!isValid) {
      return;
    }

    // Отправляем данные
    const requestUser = {
      login: user.login,
      email: user.email,
      password: user.password,
    };

    try {
      const res = await registerMutation(requestUser).unwrap();

      if (res.statusCode === 201) {
        toast.success(
          "Ссылка для подтверждения отправлена на вашу почту. Подтвердите аккаунт"
        );

        // Очищаем форму
        if (login.current) login.current.value = "";
        if (email.current) email.current.value = "";
        if (password.current) password.current.value = "";
        if (confirmPassword.current) confirmPassword.current.value = "";
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      handleToastError(error);
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.loginForm}>
        <h1 className={styles.title}>Регистрация</h1>
        <div className={styles.wrapper}>
          <Home />
          <GoogleReCaptchaProvider
            reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY_V3!}
          >
            <form className={styles.form} onSubmit={onSubmit}>
              <input
                type="text"
                placeholder="Логин"
                className={styles.input}
                ref={login}
              />
              {validationError.errorLogin && (
                <p className={styles.error}>{validationError.errorLogin}</p>
              )}

              <input
                type="text"
                placeholder="Email"
                className={styles.input}
                ref={email}
              />
              {validationError.errorEmail && (
                <p className={styles.error}>{validationError.errorEmail}</p>
              )}

              <input
                type="password"
                placeholder="Пароль"
                className={styles.input}
                ref={password}
                autoComplete="new-password"
              />
              {validationError.errorPassword && (
                <p className={styles.error}>{validationError.errorPassword}</p>
              )}

              <input
                type="password"
                placeholder="Подтвердите пароль"
                className={styles.input}
                ref={confirmPassword}
                autoComplete="new-password"
              />
              {validationError.errorConfirmPassword && (
                <p className={styles.error}>
                  {validationError.errorConfirmPassword}
                </p>
              )}

              {/* reCAPTCHA */}
              {!visibleV2 && <V3 onVerify={handleVerifyV3} />}
              {visibleV2 && <V2 onVerify={handleVerifyV2} />}

              {validationError.unionErrorForm && (
                <p className={styles.error}>{validationError.unionErrorForm}</p>
              )}

              <button
                type="submit"
                className={styles.loginButton}
                disabled={isVerifying}
              >
                {isVerifying ? "Проверка..." : "Зарегистрироваться"}
              </button>

              <a
                href="#"
                className={styles.createAccount}
                onClick={(e) => {
                  e.preventDefault();
                  setToggle(false);
                }}
              >
                Уже есть аккаунт? Войти
              </a>
            </form>
          </GoogleReCaptchaProvider>
          <div className={styles.disclaimer}>
            Нажимая кнопку «Зарегистрироваться», Вы соглашаетесь с{" "}
            <Link href="/agreement">пользовательским соглашением</Link> , и
            даете своё согласие на обработку данных в соответствии с нашей{" "}
            <Link href="/policy">политикой конфиденциальности.</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
