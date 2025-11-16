"use client";
import styles from "./Login.module.scss";
import Image from "next/image";
import { RegistrationProps } from "../RegisterBlock";
import { useAuthMutation, useVkAuthMutation } from "@/redux/apiSlice/authApi";
import { useRef, useState, useCallback } from "react";
import { AuthSchema, Auth } from "@/types/type";
import {
  validateWithZod,
  handleToastError,
  generateCodeVerifier,
  codeChallengeFromVerifier,
} from "@/lib/common";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Home from "@/Components/Home/Home";
import { AppDispatch } from "@/redux/store";
import { useDispatch } from "react-redux";
import { setLogin } from "@/redux/slice/auth.slice";
import * as VKID from "@vkid/sdk";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function Login({ setToggle }: RegistrationProps) {
  const [authMutation] = useAuthMutation();
  const [vkAuthMutation] = useVkAuthMutation();
  const dispatch: AppDispatch = useDispatch();
  const searchParams = useSearchParams();
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const [validationError, setValidationError] = useState({
    errorEmail: "",
    errorPassword: "",
    unionErrorForm: "",
  });

  const setloginAndRedirect = useCallback(() => {
    localStorage.setItem("login", "login");
    const loginToken = localStorage.getItem("login");
    dispatch(setLogin(loginToken ? true : false));
    router.push("/");
  }, [dispatch, router]);

  useEffect(() => {
    const code = searchParams.get("code");
    const device_id = searchParams.get("device_id");
    const state = searchParams.get("state");
    const code_verifier = localStorage.getItem("vk_code_verifier");
    const processVKCallback = async () => {
      try {
        if (code && device_id && state && code_verifier) {
          const result = await vkAuthMutation({
            code,
            device_id,
            state,
            code_verifier,
          }).unwrap();

          if (result.message === "success" && result.statusCode === 200) {
            setloginAndRedirect();
          }
        }
      } catch (error) {
        console.log("VK Callback Error:", error);
        handleToastError(error);
      } finally {
        localStorage.removeItem("vk_code_verifier");
      }
    };
    if (code && device_id && state && code_verifier) {
      processVKCallback();
    }
  }, [dispatch, router, searchParams, vkAuthMutation]);

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
            setloginAndRedirect();
          }
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          handleToastError(error);
        }
      }
    }
  };

  useEffect(() => {
    const steamRedirectStatus = searchParams.get("status");
    if (steamRedirectStatus === "success") {
      setloginAndRedirect();
    }
  }, [searchParams, setloginAndRedirect]);

  const authVk = async () => {
    const code_verifier = await generateCodeVerifier();
    const code_challenge = await codeChallengeFromVerifier(code_verifier);
    // сохраните verifier, чтобы потом отправить на бэк
    localStorage.setItem("vk_code_verifier", code_verifier);
    VKID.Config.init({
      app: Number(process.env.NEXT_PUBLIC_VK_APP_ID),
      redirectUrl: process.env.NEXT_PUBLIC_VK_CALLBACK_URL || "",
      scope: "email",
      state: "some_state",
      mode: VKID.ConfigAuthMode.Redirect,
      codeChallenge: code_challenge,
    });

    await VKID.Auth.login();
  };

  const authSteam = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}auth/steam`;
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
          <button className={styles.socialButton} onClick={authSteam}>
            <span className={styles.buttonNumber}>
              <Image width={35} height={35} src="/steam.png" alt="steam" />
            </span>
            Войти с помощью Steam
          </button>

          <button className={styles.socialButton} onClick={authVk}>
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
