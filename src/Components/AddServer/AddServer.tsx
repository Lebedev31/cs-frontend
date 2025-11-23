/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import styles from "./AddServer.module.scss";
import { mods } from "@/lib/mode";
import { handleSubmit } from "@/lib/common";
import { AddServerType, SettingSchemaType } from "@/types/addServerType";
import { useState, useRef } from "react";
import { toast } from "react-toastify";

const GAMES = ["CS:GO", "CS2"];

type MutationResult = {
  unwrap: () => Promise<any>;
};

type AddServerProps = {
  title: string;
  trigger: () => void;
  successMessage: string;
  schema: any;
  mutation: (arg: any) => MutationResult;
  serverId?: string;
};

export default function AddServer({
  title,
  trigger,
  successMessage,
  schema,
  mutation,
  serverId,
}: AddServerProps) {
  const ipRef = useRef<HTMLInputElement>(null);
  const gameRef = useRef<HTMLSelectElement>(null);
  const modRef = useRef<HTMLSelectElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const websiteRef = useRef<HTMLInputElement>(null);

  const [validationError, setValidationError] = useState({
    errorIpPort: "",
    errorGame: "",
    errorMod: "",
    errorDescription: "",
    errorWebsite: "",
  });

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    // --- Режим обновления (partial) ---
    if (serverId) {
      // берем значения из полей и тримим
      const ipVal = ipRef.current?.value?.trim() ?? "";
      const gameVal = gameRef.current?.value?.trim() ?? "";
      const modVal = modRef.current?.value?.trim() ?? "";
      const descVal = descriptionRef.current?.value?.trim() ?? "";
      const webVal = websiteRef.current?.value?.trim() ?? "";
      // Формируем объект только с непустыми полями + обязателен serverId
      const updateData: SettingSchemaType & { serverId: string } = {
        ...(ipVal !== "" ? { ipPort: ipVal } : {}),
        ...(gameVal !== "" ? { game: gameVal } : {}),
        ...(modVal !== "" ? { mod: modVal } : {}),
        ...(descVal !== "" ? { description: descVal } : {}),
        ...(webVal !== "" ? { website: webVal } : {}),
        serverId,
      };

      console.log(updateData);

      handleSubmit(
        e,
        (errors) => {
          setValidationError({
            errorIpPort: errors.ipPort || "",
            errorGame: errors.game || "",
            errorMod: errors.mod || "",
            errorDescription: errors.description || "",
            errorWebsite: errors.website || "",
          });
        },
        mutation,
        updateData,
        schema,
        updateData,
        (data) => {
          toast.success(data.message || successMessage);
          // при обновлении обычно не очищают поля — но оставлю как было
          if (ipRef.current) ipRef.current.value = "";
          if (gameRef.current) gameRef.current.value = "";
          if (modRef.current) modRef.current.value = "";
          if (descriptionRef.current) descriptionRef.current.value = "";
          if (websiteRef.current) websiteRef.current.value = "";
          trigger();
        }
      );

      return;
    }

    console.log(2);

    // --- Режим добавления (full) ---
    const addData: AddServerType = {
      ipPort: ipRef.current?.value || "",
      game: gameRef.current?.value || "",
      mod: modRef.current?.value || "",
      description: descriptionRef.current?.value || "",
      website: websiteRef.current?.value || "",
    };

    handleSubmit(
      e,
      (errors) => {
        setValidationError({
          errorIpPort: errors.ipPort || "",
          errorGame: errors.game || "",
          errorMod: errors.mod || "",
          errorDescription: errors.description || "",
          errorWebsite: errors.website || "",
        });
      },
      mutation,
      addData,
      schema,
      addData,
      (data) => {
        toast.success(data.message || "Сервер добавлен!");
        if (ipRef.current) ipRef.current.value = "";
        if (gameRef.current) gameRef.current.value = "";
        if (modRef.current) modRef.current.value = "";
        if (descriptionRef.current) descriptionRef.current.value = "";
        if (websiteRef.current) websiteRef.current.value = "";
      }
    );
  };

  return (
    <div className={styles.addServer}>
      <div className={styles.container}>
        <h1 className={styles.title}>{title}</h1>
        <div className={styles.wrapper}>
          <form className={styles.form} onSubmit={onSubmit}>
            <div className={styles.inputWrapper}>
              <input
                ref={ipRef}
                type="text"
                placeholder="IP:Port"
                className={styles.input}
              />
              {validationError.errorIpPort && (
                <p className={styles.error}>{validationError.errorIpPort}</p>
              )}
            </div>

            <div className={styles.inputWrapper}>
              <select ref={gameRef} className={styles.select}>
                <option value="">Игра</option>
                {GAMES.map((game) => (
                  <option key={game} value={game}>
                    {game}
                  </option>
                ))}
              </select>
              {validationError.errorGame && (
                <p className={styles.error}>{validationError.errorGame}</p>
              )}
            </div>

            <div className={styles.inputWrapper}>
              <select ref={modRef} className={styles.select}>
                <option value="">Мод игры</option>
                {mods.map((mod) => (
                  <option key={mod} value={mod}>
                    {mod}
                  </option>
                ))}
              </select>
              {validationError.errorMod && (
                <p className={styles.error}>{validationError.errorMod}</p>
              )}
            </div>

            <div className={styles.inputWrapper}>
              <textarea
                ref={descriptionRef}
                placeholder="Описание сервера&#10;(необязательно)"
                className={styles.textarea}
              />
              {validationError.errorDescription && (
                <p className={styles.error}>
                  {validationError.errorDescription}
                </p>
              )}
            </div>

            <div className={styles.inputWrapper}>
              <input
                ref={websiteRef}
                type="text"
                placeholder="Сайт сервера (необязательно)"
                className={styles.input}
              />
              {validationError.errorWebsite && (
                <p className={styles.error}>{validationError.errorWebsite}</p>
              )}
            </div>

            <button type="submit" className={styles.button}>
              {title}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
