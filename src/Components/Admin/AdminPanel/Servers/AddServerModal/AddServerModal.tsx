"use client";

import { useState, useRef, useEffect } from "react";
import styles from "./AddServer.module.scss";
import { mods } from "@/lib/mode";
import { AddServerSchema, AddServerType } from "@/types/addServerType";
import { toast } from "react-toastify";
import { handleSubmit } from "@/lib/common";

const GAMES = ["CS:GO", "CS2"];

const AVAILABLE_TAGS = [
  "Скины",
  "Ножи",
  "Перчатки",
  "Агенты",
  "128 Tick",
  "FPS Boost",
];

type Props = {
  isOpen: boolean;
  onClose: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mutation: (arg: AddServerType) => { unwrap: () => Promise<any> };
};

type ValidationErrors = {
  errorIpPort: string;
  errorGame: string;
  errorMod: string;
  errorDescription: string;
  errorWebsite: string;
  errorVk: string;
  errorDiscord: string;
  errorTelegram: string;
  errorTags: string;
};

const EMPTY_ERRORS: ValidationErrors = {
  errorIpPort: "",
  errorGame: "",
  errorMod: "",
  errorDescription: "",
  errorWebsite: "",
  errorVk: "",
  errorDiscord: "",
  errorTelegram: "",
  errorTags: "",
};

export default function AddServerModal({ isOpen, onClose, mutation }: Props) {
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
  const [validationError, setValidationError] =
    useState<ValidationErrors>(EMPTY_ERRORS);

  // Закрытие дропдаунов при клике вне
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        gameDropdownRef.current &&
        !gameDropdownRef.current.contains(event.target as Node)
      )
        setIsGameOpen(false);
      if (
        modDropdownRef.current &&
        !modDropdownRef.current.contains(event.target as Node)
      )
        setIsModOpen(false);
      if (
        tagsDropdownRef.current &&
        !tagsDropdownRef.current.contains(event.target as Node)
      )
        setIsTagsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Блокируем скролл страницы когда модалка открыта
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const resetForm = () => {
    if (ipRef.current) ipRef.current.value = "";
    if (descriptionRef.current) descriptionRef.current.value = "";
    if (websiteRef.current) websiteRef.current.value = "";
    if (vkRef.current) vkRef.current.value = "";
    if (discordRef.current) discordRef.current.value = "";
    if (telegramRef.current) telegramRef.current.value = "";
    setSelectedGame("");
    setSelectedMod("");
    setSelectedTags([]);
    setValidationError(EMPTY_ERRORS);
    setIsGameOpen(false);
    setIsModOpen(false);
    setIsTagsOpen(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
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
      AddServerSchema,
      addData,
      (data) => {
        toast.success(data.message || "Сервер добавлен!");
        resetForm();
        onClose();
      },
    );
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={handleClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h3>Добавить новый сервер</h3>
          <button className={styles.closeBtn} onClick={handleClose}>
            ×
          </button>
        </div>

        <div className={styles.body}>
          <form className={styles.form} onSubmit={onSubmit}>
            {/* IP:Port */}
            <div className={styles.inputGroup}>
              <label>IP адрес и Порт</label>
              <input
                ref={ipRef}
                type="text"
                placeholder="192.168.1.1:27015"
                className={validationError.errorIpPort ? styles.inputError : ""}
              />
              {validationError.errorIpPort && (
                <span className={styles.errorText}>
                  {validationError.errorIpPort}
                </span>
              )}
            </div>

            {/* Игра */}
            <div className={styles.inputGroup} ref={gameDropdownRef}>
              <label>Игра</label>
              <div
                className={styles.customSelect}
                onClick={() => setIsGameOpen(!isGameOpen)}
              >
                <div className={styles.customSelectTrigger}>
                  {selectedGame || "Выберите игру"}
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
                          setSelectedGame(game);
                          setIsGameOpen(false);
                        }}
                      >
                        {game}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {validationError.errorGame && (
                <span className={styles.errorText}>
                  {validationError.errorGame}
                </span>
              )}
            </div>

            {/* Мод */}
            <div className={styles.inputGroup} ref={modDropdownRef}>
              <label>Мод игры</label>
              <div
                className={styles.customSelect}
                onClick={() => setIsModOpen(!isModOpen)}
              >
                <div className={styles.customSelectTrigger}>
                  {selectedMod || "Выберите мод"}
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
                          setSelectedMod(mod);
                          setIsModOpen(false);
                        }}
                      >
                        {mod}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {validationError.errorMod && (
                <span className={styles.errorText}>
                  {validationError.errorMod}
                </span>
              )}
            </div>

            {/* Теги */}
            <div className={styles.inputGroup} ref={tagsDropdownRef}>
              <label>Опции сервера (необязательно)</label>
              <div
                className={styles.customSelect}
                onClick={() => setIsTagsOpen(!isTagsOpen)}
              >
                <div className={styles.customSelectTrigger}>
                  {selectedTags.length === 0
                    ? "Выберите теги"
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
            </div>

            {/* Описание */}
            <div className={styles.inputGroup}>
              <label>Описание (необязательно)</label>
              <textarea
                ref={descriptionRef}
                placeholder="Описание сервера"
                className={styles.textarea}
              />
            </div>

            {/* Доп. поля */}
            <div className={styles.inputGroup}>
              <label>Сайт (необязательно)</label>
              <input ref={websiteRef} type="text" placeholder="https://..." />
            </div>

            <div className={styles.inputGroup}>
              <label>VK (необязательно)</label>
              <input ref={vkRef} type="text" placeholder="https://vk.com/..." />
            </div>

            <div className={styles.inputGroup}>
              <label>Discord (необязательно)</label>
              <input
                ref={discordRef}
                type="text"
                placeholder="https://discord.gg/..."
              />
            </div>

            <div className={styles.inputGroup}>
              <label>Telegram (необязательно)</label>
              <input
                ref={telegramRef}
                type="text"
                placeholder="https://t.me/..."
              />
            </div>

            <button type="submit" className={styles.submitBtn}>
              Добавить сервер
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
