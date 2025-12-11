/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import styles from "./AddServer.module.scss";
import { mods } from "@/lib/mode";
import { handleSubmit } from "@/lib/common";
import { AddServerType, SettingSchemaType } from "@/types/addServerType";
import { useState, useRef, useEffect } from "react";
import { toast } from "react-toastify";

const GAMES = ["CS:GO", "CS2"];

const AVAILABLE_TAGS = [
  "Скины",
  "Ножи",
  "Перчатки",
  "Агенты",
  "128 Tick",
  "FPS Boost",
];

type MutationResult = {
  unwrap: () => Promise<any>;
};

type AddServerProps = {
  title: string;
  successMessage: string;
  schema: any;
  mutation: (arg: any) => MutationResult;
  serverId?: string;
};

export default function AddServer({
  title,
  successMessage,
  schema,
  mutation,
  serverId,
}: AddServerProps) {
  const ipRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const websiteRef = useRef<HTMLInputElement>(null);
  const vkRef = useRef<HTMLInputElement>(null);
  const discordRef = useRef<HTMLInputElement>(null);
  const telegramRef = useRef<HTMLInputElement>(null);
  const gameDropdownRef = useRef<HTMLDivElement>(null);
  const modDropdownRef = useRef<HTMLDivElement>(null);
  const tagsDropdownRef = useRef<HTMLDivElement>(null);

  const [selectedGame, setSelectedGame] = useState("");
  const [selectedMod, setSelectedMod] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isGameOpen, setIsGameOpen] = useState(false);
  const [isModOpen, setIsModOpen] = useState(false);
  const [isTagsOpen, setIsTagsOpen] = useState(false);

  const [validationError, setValidationError] = useState({
    errorIpPort: "",
    errorGame: "",
    errorMod: "",
    errorDescription: "",
    errorWebsite: "",
    errorVk: "",
    errorDiscord: "",
    errorTelegram: "",
    errorTags: "",
  });

  // Закрытие дропдаунов при клике вне их
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        gameDropdownRef.current &&
        !gameDropdownRef.current.contains(event.target as Node)
      ) {
        setIsGameOpen(false);
      }
      if (
        modDropdownRef.current &&
        !modDropdownRef.current.contains(event.target as Node)
      ) {
        setIsModOpen(false);
      }
      if (
        tagsDropdownRef.current &&
        !tagsDropdownRef.current.contains(event.target as Node)
      ) {
        setIsTagsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const selectGame = (game: string) => {
    setSelectedGame(game);
    setIsGameOpen(false);
  };

  const selectMod = (mod: string) => {
    setSelectedMod(mod);
    setIsModOpen(false);
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (serverId) {
      const ipVal = ipRef.current?.value?.trim() ?? "";
      const gameVal = selectedGame.trim();
      const modVal = selectedMod.trim();
      const descVal = descriptionRef.current?.value?.trim() ?? "";
      const webVal = websiteRef.current?.value?.trim() ?? "";
      const vkVal = vkRef.current?.value?.trim() ?? "";
      const discordVal = discordRef.current?.value?.trim() ?? "";
      const telegramVal = telegramRef.current?.value?.trim() ?? "";

      const updateData: SettingSchemaType & { serverId: string } = {
        ...(ipVal !== "" ? { ipPort: ipVal } : {}),
        ...(gameVal !== "" ? { game: gameVal } : {}),
        ...(modVal !== "" ? { mod: modVal } : {}),
        ...(descVal !== "" ? { description: descVal } : {}),
        ...(webVal !== "" ? { website: webVal } : {}),
        ...(vkVal !== "" ? { vk: vkVal } : {}),
        ...(discordVal !== "" ? { discord: discordVal } : {}),
        ...(telegramVal !== "" ? { telegram: telegramVal } : {}),
        ...(selectedTags.length > 0 ? { tags: selectedTags } : {}),
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
            errorVk: errors.vk || "",
            errorDiscord: errors.discord || "",
            errorTelegram: errors.telegram || "",
            errorTags: errors.tags || "",
          });
        },
        mutation,
        updateData,
        schema,
        updateData,
        (data) => {
          toast.success(data.message || successMessage);
          if (ipRef.current) ipRef.current.value = "";
          setSelectedGame("");
          setSelectedMod("");
          if (descriptionRef.current) descriptionRef.current.value = "";
          if (websiteRef.current) websiteRef.current.value = "";
          if (vkRef.current) vkRef.current.value = "";
          if (discordRef.current) discordRef.current.value = "";
          if (telegramRef.current) telegramRef.current.value = "";
          setSelectedTags([]);
        }
      );

      return;
    }

    const addData: AddServerType = {
      ipPort: ipRef.current?.value || "",
      game: selectedGame,
      mod: selectedMod,
      description: descriptionRef.current?.value || "",
      website: websiteRef.current?.value || "",
      vk: vkRef.current?.value || "",
      discord: discordRef.current?.value || "",
      telegram: telegramRef.current?.value || "",
      tags: selectedTags,
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
          errorVk: errors.vk || "",
          errorDiscord: errors.discord || "",
          errorTelegram: errors.telegram || "",
          errorTags: errors.tags || "",
        });
      },
      mutation,
      addData,
      schema,
      addData,
      (data) => {
        toast.success(data.message || "Сервер добавлен!");
        if (ipRef.current) ipRef.current.value = "";
        setSelectedGame("");
        setSelectedMod("");
        if (descriptionRef.current) descriptionRef.current.value = "";
        if (websiteRef.current) websiteRef.current.value = "";
        if (vkRef.current) vkRef.current.value = "";
        if (discordRef.current) discordRef.current.value = "";
        if (telegramRef.current) telegramRef.current.value = "";
        setSelectedTags([]);
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

            {/* Кастомный селект для игры */}
            <div className={styles.inputWrapper} ref={gameDropdownRef}>
              <div
                className={styles.customSelect}
                onClick={() => setIsGameOpen(!isGameOpen)}
              >
                <div className={styles.customSelectTrigger}>
                  {selectedGame || "Игра"}
                </div>
                {isGameOpen && (
                  <div className={styles.customOptions}>
                    {GAMES.map((game) => (
                      <div
                        key={game}
                        className={`${styles.customOption} ${
                          selectedGame === game ? styles.selected : ""
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          selectGame(game);
                        }}
                      >
                        {game}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {validationError.errorGame && (
                <p className={styles.error}>{validationError.errorGame}</p>
              )}
            </div>

            {/* Кастомный селект для мода */}
            <div className={styles.inputWrapper} ref={modDropdownRef}>
              <div
                className={styles.customSelect}
                onClick={() => setIsModOpen(!isModOpen)}
              >
                <div className={styles.customSelectTrigger}>
                  {selectedMod || "Мод игры"}
                </div>
                {isModOpen && (
                  <div className={styles.customOptions}>
                    {mods.map((mod) => (
                      <div
                        key={mod}
                        className={`${styles.customOption} ${
                          selectedMod === mod ? styles.selected : ""
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          selectMod(mod);
                        }}
                      >
                        {mod}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {validationError.errorMod && (
                <p className={styles.error}>{validationError.errorMod}</p>
              )}
            </div>

            {/* Кастомный мультиселект для тегов */}
            <div className={styles.inputWrapper} ref={tagsDropdownRef}>
              <div
                className={styles.customSelect}
                onClick={() => setIsTagsOpen(!isTagsOpen)}
              >
                <div className={styles.customSelectTrigger}>
                  {selectedTags.length === 0
                    ? "Опции сервера (необязательно)"
                    : `Выбрано: ${selectedTags.length}`}
                </div>
                {isTagsOpen && (
                  <div className={styles.customOptions}>
                    {AVAILABLE_TAGS.map((tag) => (
                      <div
                        key={tag}
                        className={`${styles.customOption} ${
                          selectedTags.includes(tag) ? styles.selected : ""
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleTag(tag);
                        }}
                      >
                        <span className={styles.checkbox}>
                          {selectedTags.includes(tag) && "✓"}
                        </span>
                        {tag}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {selectedTags.length > 0 && (
                <div className={styles.selectedTags}>
                  {selectedTags.map((tag) => (
                    <span
                      key={tag}
                      className={styles.tag}
                      onClick={() => toggleTag(tag)}
                    >
                      {tag}
                      <span className={styles.tagClose}>×</span>
                    </span>
                  ))}
                </div>
              )}
              {validationError.errorTags && (
                <p className={styles.error}>{validationError.errorTags}</p>
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

            <div className={styles.inputWrapper}>
              <input
                ref={vkRef}
                type="text"
                placeholder="VK (необязательно, https://vk.com/...)"
                className={styles.input}
              />
              {validationError.errorVk && (
                <p className={styles.error}>{validationError.errorVk}</p>
              )}
            </div>

            <div className={styles.inputWrapper}>
              <input
                ref={discordRef}
                type="text"
                placeholder="Discord (необязательно, например https://discord.gg/....)"
                className={styles.input}
              />
              {validationError.errorDiscord && (
                <p className={styles.error}>{validationError.errorDiscord}</p>
              )}
            </div>

            <div className={styles.inputWrapper}>
              <input
                ref={telegramRef}
                type="text"
                placeholder="Telegram (необязательно, https://t.me/...)"
                className={styles.input}
              />
              {validationError.errorTelegram && (
                <p className={styles.error}>{validationError.errorTelegram}</p>
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
