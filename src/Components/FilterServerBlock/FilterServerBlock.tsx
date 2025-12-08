"use client";
/* eslint-disable @next/next/no-img-element */
import styles from "./FilterServerBlock.module.scss";
import Image from "next/image";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { useState } from "react";
import { setServers } from "@/redux/slice/main.slice";
import { mods } from "@/lib/mode";

// Определяем доступные теги для фильтрации
const AVAILABLE_TAGS = [
  { label: "Скины", keywords: ["skin", "skins", "ws"] },
  { label: "Ножи", keywords: ["knife", "knive", "!knife", "ножи", "нож"] },
  {
    label: "Перчатки",
    keywords: ["glove", "gloves", "!glove", "!gloves", "gl", "перчатки"],
  },
  { label: "Агенты", keywords: ["agent", "agents", "агенты"] },
  { label: "128 Tick", keywords: ["128", "128tick", "128tr", "128tik"] },
  { label: "FPS Boost", keywords: ["fps", "boost", "фпс"] },
];

// Функция для извлечения тегов из массива tags сервера
function extractMatchingTags(serverTags: string[]): string[] {
  const matched: string[] = [];

  AVAILABLE_TAGS.forEach((tag) => {
    const hasMatch = serverTags.some((serverTag) =>
      tag.keywords.some((keyword) =>
        serverTag.toLowerCase().includes(keyword.toLowerCase())
      )
    );

    if (hasMatch) {
      matched.push(tag.label);
    }
  });

  return matched;
}

export default function FilterServerBlock() {
  const originalServers = useSelector(
    (state: RootState) => state.main.originalServers
  );
  const selected = useSelector((state: RootState) => state.main.selectedServer);
  const dispatch: AppDispatch = useDispatch();

  const [serverNameValue, setServerNameValue] = useState<string>("");
  const [minPlayers, setMinPlayers] = useState<string>("");
  const [maxPlayers, setMaxPlayers] = useState<string>("");
  const [mapValue, setMapValue] = useState<string>("");
  const [modeValue, setModeValue] = useState<string>("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Универсальная функция фильтрации
  const applyFilters = (
    name = serverNameValue,
    min = minPlayers,
    max = maxPlayers,
    map = mapValue,
    mode = modeValue,
    tags = selectedTags
  ) => {
    let filtered = originalServers;

    // Фильтр по названию
    if (name.trim()) {
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(name.toLowerCase()) ||
          item.id.includes(name.toLowerCase())
      );
    }

    // Фильтр по минимальному количеству игроков
    if (min && !isNaN(Number(min))) {
      filtered = filtered.filter((item) => item.players >= Number(min));
    }

    // Фильтр по максимальному количеству игроков
    if (max && !isNaN(Number(max))) {
      filtered = filtered.filter((item) => item.players <= Number(max));
    }

    // Фильтр по карте
    if (map.trim()) {
      filtered = filtered.filter((item) =>
        item.map.toLowerCase().includes(map.toLowerCase())
      );
    }

    // Фильтр по режиму
    if (mode) {
      filtered = filtered.filter((item) => item.mode === mode);
    }

    // Фильтр по тегам (ВСЕ выбранные теги должны присутствовать)
    if (tags.length > 0) {
      filtered = filtered.filter((server) => {
        const serverMatchedTags = extractMatchingTags(server.tags || []);
        // Проверяем, что все выбранные теги присутствуют у сервера
        return tags.every((tag) => serverMatchedTags.includes(tag));
      });
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

  // Обработчик клика по тегу
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
      newSelectedTags
    );
  };

  return (
    <div className={styles.filterServerBlock}>
      {/* Логотип слева */}
      <div className={styles.filterServerBlock_logo}>
        <Image
          src={selected === "CS2" ? "/cs2_logo (1).jpeg" : "/csgo_logo.jpg"}
          alt="картинка"
          fill
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>

      {/* Фильтры справа */}
      <div className={styles.filterServerBlock_filtration}>
        <h2>Сервера {selected === "CS:GO" ? "CS GO" : selected}</h2>

        <div className={styles.filterServerBlock_flex}>
          {/* Блок: Поиск + Мин/Макс игроков */}
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

          {/* Блок: Карта + Режим */}
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
              {mods.map((item) => {
                return (
                  <option key={item} value={item}>
                    {item}
                  </option>
                );
              })}
            </select>
          </div>
        </div>
        {/* Теги */}
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
  );
}
