"use client";
/* eslint-disable @next/next/no-img-element */
import styles from "./FilterServerBlock.module.scss";
import Image from "next/image";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { useState } from "react";
import { setServers } from "@/redux/slice/main.slice";
import { mods } from "@/lib/mode";

const AVAILABLE_TAGS = [
  { label: "Скины" },
  { label: "Ножи" },
  { label: "Перчатки" },
  { label: "Агенты" },
  { label: "128 Tick" },
  { label: "FPS Boost" },
];

export default function FilterServerBlock() {
  const originalServers = useSelector(
    (state: RootState) => state.main.originalServers,
  );
  const selected = useSelector((state: RootState) => state.main.selectedServer);
  const dispatch: AppDispatch = useDispatch();

  const [serverNameValue, setServerNameValue] = useState<string>("");
  const [minPlayers, setMinPlayers] = useState<string>("");
  const [maxPlayers, setMaxPlayers] = useState<string>("");
  const [mapValue, setMapValue] = useState<string>("");
  const [modeValue, setModeValue] = useState<string>("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  const applyFilters = (
    name = serverNameValue,
    min = minPlayers,
    max = maxPlayers,
    map = mapValue,
    mode = modeValue,
    tags = selectedTags,
  ) => {
    let filtered = originalServers;

    if (name.trim()) {
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(name.toLowerCase()) ||
          item.id.includes(name.toLowerCase()),
      );
    }
    if (min && !isNaN(Number(min))) {
      filtered = filtered.filter((item) => item.players >= Number(min));
    }
    if (max && !isNaN(Number(max))) {
      filtered = filtered.filter((item) => item.players <= Number(max));
    }
    if (map.trim()) {
      filtered = filtered.filter((item) =>
        item.map.toLowerCase().includes(map.toLowerCase()),
      );
    }
    if (mode) {
      filtered = filtered.filter((item) => item.mode === mode);
    }
    if (tags.length > 0) {
      filtered = filtered.filter((server) =>
        tags.every((tag) =>
          server.tags?.some((serverTag) =>
            serverTag.toLowerCase().includes(tag.toLowerCase()),
          ),
        ),
      );
    }

    dispatch(setServers(filtered));
  };

  const changeNameFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setServerNameValue(value);
    applyFilters(value);
  };

  const changeMinPlayers = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMinPlayers(value);
    applyFilters(serverNameValue, value);
  };

  const changeMaxPlayers = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMaxPlayers(value);
    applyFilters(serverNameValue, minPlayers, value);
  };

  const changeMapFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMapValue(value);
    applyFilters(serverNameValue, minPlayers, maxPlayers, value);
  };

  const changeModeFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setModeValue(value);
    applyFilters(serverNameValue, minPlayers, maxPlayers, mapValue, value);
  };

  const toggleTag = (tagLabel: string) => {
    const newSelectedTags = selectedTags.includes(tagLabel)
      ? selectedTags.filter((t) => t !== tagLabel)
      : [...selectedTags, tagLabel];

    setSelectedTags(newSelectedTags);
    applyFilters(
      serverNameValue,
      minPlayers,
      maxPlayers,
      mapValue,
      modeValue,
      newSelectedTags,
    );
  };

  // Количество активных доп. фильтров для отображения в кнопке дропдауна
  const activeFiltersCount =
    (minPlayers ? 1 : 0) +
    (maxPlayers ? 1 : 0) +
    (mapValue ? 1 : 0) +
    (modeValue ? 1 : 0) +
    selectedTags.length;

  return (
    <>
      <div className={styles.filterServerBlock}>
        {/* Логотип — скрывается на 850px */}
        <div className={styles.filterServerBlock_logo}>
          <Image
            src={selected === "CS2" ? "/cs2-icon-1.jpg" : "/csgo_logo.jpg"}
            alt="картинка"
            fill
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>

        {/* Фильтры */}
        <div className={styles.filterServerBlock_filtration}>
          <h2>Сервера {selected === "CS:GO" ? "CS GO" : selected}</h2>

          <div className={styles.filterServerBlock_flex}>
            {/* Блок 1: Поиск + Мин/Макс — поиск всегда виден, мин/макс скрыты на 600px */}
            <div className={styles.filterServerBlock_block}>
              <input
                type="text"
                placeholder="Название или адрес сервера"
                className={styles.input}
                value={serverNameValue}
                onChange={changeNameFilter}
              />
              <div className={styles.inputGroup}>
                <input
                  type="number"
                  placeholder="Мин. игроков"
                  className={styles.input}
                  value={minPlayers}
                  onChange={changeMinPlayers}
                />
                <input
                  type="number"
                  placeholder="Макс. игроков"
                  className={styles.input}
                  value={maxPlayers}
                  onChange={changeMaxPlayers}
                />
              </div>
            </div>

            {/* Блок 2: Карта + Режим — скрыт на 600px */}
            <div className={styles.filterServerBlock_block}>
              <input
                type="text"
                placeholder="Поиск по карте"
                className={styles.input}
                value={mapValue}
                onChange={changeMapFilter}
              />
              <select
                className={styles.select}
                value={modeValue}
                onChange={changeModeFilter}
              >
                <option value="">Режим</option>
                {mods.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Теги — скрыты на 600px */}
          <div className={styles.tagsContainer}>
            {AVAILABLE_TAGS.map((tag) => (
              <button
                key={tag.label}
                className={`${styles.tagButton} ${
                  selectedTags.includes(tag.label) ? styles.tagActive : ""
                }`}
                onClick={() => toggleTag(tag.label)}
              >
                {tag.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Дропдаун — виден только на 600px и меньше */}
      <div className={styles.dropdownWrapper}>
        <button
          className={`${styles.dropdownToggle} ${isDropdownOpen ? styles.open : ""}`}
          onClick={() => setIsDropdownOpen((prev) => !prev)}
        >
          <span>
            Фильтры{activeFiltersCount > 0 ? ` (${activeFiltersCount})` : ""}
          </span>
          <span
            className={`${styles.toggleIcon} ${isDropdownOpen ? styles.rotated : ""}`}
          >
            ▼
          </span>
        </button>

        {isDropdownOpen && (
          <div className={styles.dropdownContent}>
            {/* Мин/Макс игроков */}
            <span className={styles.dropdownLabel}>Количество игроков</span>
            <div className={styles.inputGroup}>
              <input
                type="number"
                placeholder="Мин."
                className={styles.input}
                value={minPlayers}
                onChange={changeMinPlayers}
              />
              <input
                type="number"
                placeholder="Макс."
                className={styles.input}
                value={maxPlayers}
                onChange={changeMaxPlayers}
              />
            </div>

            {/* Карта */}
            <span className={styles.dropdownLabel}>Карта</span>
            <input
              type="text"
              placeholder="Поиск по карте"
              className={styles.input}
              value={mapValue}
              onChange={changeMapFilter}
            />

            {/* Режим */}
            <span className={styles.dropdownLabel}>Режим</span>
            <select
              className={styles.select}
              value={modeValue}
              onChange={changeModeFilter}
            >
              <option value="">Все режимы</option>
              {mods.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            {/* Теги */}
            <span className={styles.dropdownLabel}>Теги</span>
            <div className={styles.dropdownTagsContainer}>
              {AVAILABLE_TAGS.map((tag) => (
                <button
                  key={tag.label}
                  className={`${styles.tagButton} ${
                    selectedTags.includes(tag.label) ? styles.tagActive : ""
                  }`}
                  onClick={() => toggleTag(tag.label)}
                >
                  {tag.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
