"use client";
import styles from "./Login.module.scss";
import Image from "next/image";
import { RegistrationProps } from "../RegisterBlock";
import { useAuthMutation } from "@/redux/apiSlice/authApi";
import { useRef, useState } from "react";
import { AuthSchema, Auth } from "@/types/type";
import { validateWithZod, handleToastError } from "@/lib/common";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Home from "@/Components/Home/Home";
import { AppDispatch } from "@/redux/store";
import { useDispatch } from "react-redux";
import { setLogin } from "@/redux/slice/auth.slice";

export default function Login({ setToggle }: RegistrationProps) {
  const [authMutation] = useAuthMutation();
  const dispatch: AppDispatch = useDispatch();
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [validationError, setValidationError] = useState({
    errorEmail: "",
    errorPassword: "",
    unionErrorForm: "",
  });

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (emailRef.current && passwordRef.current) {
      const auth: Auth = {
        email: emailRef.current.value,
        password: passwordRef.current.value,
      };

      const isValid = validateWithZod<Auth>(AuthSchema, auth, (errors) => {
        setValidationError({
          errorEmail: errors.email ?? "",
          errorPassword: errors.password ?? "",
          unionErrorForm: errors.unionErrorForm ?? "",
        });
      });
      if (isValid) {
        try {
          const result = await authMutation(auth).unwrap();
          if (result.message === "success" && result.statusCode === 200) {
            localStorage.setItem("login", "login");
            const loginToken = localStorage.getItem("login");
            dispatch(setLogin(loginToken ? true : false));
            router.push("/");
          }
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          handleToastError(error);
        }
      }
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.loginForm}>
        <h1 className={styles.title}>Вход в аккаунт</h1>
        <Home />
        <form className={styles.form} onSubmit={onSubmit}>
          <input
            type="text"
            placeholder="Email"
            className={styles.input}
            ref={emailRef}
          />

          {validationError.errorEmail && (
            <p className={styles.error}>{validationError.errorEmail}</p>
          )}

          <input
            type="password"
            placeholder="Пароль"
            className={styles.input}
            ref={passwordRef}
          />

          {validationError.errorPassword && (
            <p className={styles.error}>{validationError.errorPassword}</p>
          )}

          <Link href="/forgotPassword" className={styles.forgotPassword}>
            Забыли пароль?
          </Link>

          {validationError.unionErrorForm && (
            <p className={styles.error}>{validationError.unionErrorForm}</p>
          )}

          <button type="submit" className={styles.loginButton}>
            Войти
          </button>

          <a
            href="#"
            className={styles.createAccount}
            onClick={() => setToggle(true)}
          >
            Создать аккаунт
          </a>
        </form>

        <div className={styles.divider}></div>

        <div className={styles.socialLogin}>
          <button className={styles.socialButton}>
            <span className={styles.buttonNumber}>
              <Image width={35} height={35} src="/steam.png" alt="steam" />
            </span>
            Войти с помощью Steam
          </button>

          <button className={styles.socialButton}>
            <span className={styles.buttonNumber}>
              <Image width={35} height={35} src="/vk.png" alt="vk" />
            </span>
            Войти с помощью ВК
          </button>
        </div>
      </div>
    </div>
  );
}
