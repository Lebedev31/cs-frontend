"use client";
/* eslint-disable @next/next/no-img-element */
import styles from "./FilterServerBlock.module.scss";
import Image from "next/image";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { useState } from "react";
import { setServers } from "@/redux/slice/main.slice";
import {
  setServerName,
  setMinPlayers,
  setMaxPlayers,
  setMap,
  setMode,
  setTags,
} from "@/redux/slice/filter.slice";
import { mods } from "@/lib/mode";
import { useRouter, usePathname } from "next/navigation";

const AVAILABLE_TAGS = [
  { label: "Скины" },
  { label: "Ножи" },
  { label: "Перчатки" },
  { label: "Агенты" },
  { label: "128 Tick" },
  { label: "FPS Boost" },
];

const includesCI = (source: string, query: string) =>
  source.toLowerCase().includes(query.toLowerCase());

export default function FilterServerBlock() {
  const originalServers = useSelector(
    (state: RootState) => state.main.originalServers,
  );
  const selected = useSelector((state: RootState) => state.main.selectedServer);
  const filters = useSelector((state: RootState) => state.filter);
  const dispatch: AppDispatch = useDispatch();
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const router = useRouter();
  const pathname = usePathname();

  const resetPage = () => {
    const params = new URLSearchParams(window.location.search);
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const applyFilters = (
    name = filters.serverName,
    min = filters.minPlayers,
    max = filters.maxPlayers,
    map = filters.map,
    mode = filters.mode,
    tags = filters.tags,
  ) => {
    let filtered = originalServers;

    if (name.trim()) {
      filtered = filtered.filter(
        (item) => includesCI(item.name, name) || includesCI(item.id, name),
      );
    }
    if (min && !isNaN(Number(min))) {
      filtered = filtered.filter((item) => item.players >= Number(min));
    }
    if (max && !isNaN(Number(max))) {
      filtered = filtered.filter((item) => item.players <= Number(max));
    }
    if (map.trim()) {
      filtered = filtered.filter((item) => includesCI(item.map, map));
    }
    if (mode) {
      filtered = filtered.filter((item) => includesCI(item.mode, mode));
    }
    if (tags.length > 0) {
      filtered = filtered.filter((server) =>
        tags.every((tag) =>
          server.tags?.some((serverTag) => includesCI(serverTag, tag)),
        ),
      );
    }

    dispatch(setServers(filtered));
  };

  const changeNameFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    dispatch(setServerName(value));
    applyFilters(value);
    resetPage();
  };

  const changeMinPlayers = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    dispatch(setMinPlayers(value));
    applyFilters(filters.serverName, value);
    resetPage();
  };

  const changeMaxPlayers = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    dispatch(setMaxPlayers(value));
    applyFilters(filters.serverName, filters.minPlayers, value);
    resetPage();
  };

  const changeMapFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    dispatch(setMap(value));
    applyFilters(
      filters.serverName,
      filters.minPlayers,
      filters.maxPlayers,
      value,
    );
    resetPage();
  };

  const changeModeFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    dispatch(setMode(value));
    applyFilters(
      filters.serverName,
      filters.minPlayers,
      filters.maxPlayers,
      filters.map,
      value,
    );
    resetPage();
  };

  const toggleTag = (tagLabel: string) => {
    const newTags = filters.tags.includes(tagLabel)
      ? filters.tags.filter((t) => t !== tagLabel)
      : [...filters.tags, tagLabel];

    dispatch(setTags(newTags));
    applyFilters(
      filters.serverName,
      filters.minPlayers,
      filters.maxPlayers,
      filters.map,
      filters.mode,
      newTags,
    );
    resetPage();
  };

  const activeFiltersCount =
    (filters.minPlayers ? 1 : 0) +
    (filters.maxPlayers ? 1 : 0) +
    (filters.map ? 1 : 0) +
    (filters.mode ? 1 : 0) +
    filters.tags.length;

  return (
    <>
      <div className={styles.filterServerBlock}>
        <div className={styles.filterServerBlock_logo}>
          <Image
            src={selected === "CS2" ? "/cs2-icon-1.jpg" : "/csgo_logo.jpg"}
            alt="картинка"
            fill
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>

        <div className={styles.filterServerBlock_filtration}>
          <h2>Сервера {selected === "CS:GO" ? "CS GO" : selected}</h2>

          <div className={styles.filterServerBlock_flex}>
            <div className={styles.filterServerBlock_block}>
              <input
                type="text"
                placeholder="Название или адрес сервера"
                className={styles.input}
                value={filters.serverName}
                onChange={changeNameFilter}
              />
              <div className={styles.inputGroup}>
                <input
                  type="number"
                  placeholder="Мин. игроков"
                  className={styles.input}
                  value={filters.minPlayers}
                  onChange={changeMinPlayers}
                />
                <input
                  type="number"
                  placeholder="Макс. игроков"
                  className={styles.input}
                  value={filters.maxPlayers}
                  onChange={changeMaxPlayers}
                />
              </div>
            </div>

            <div className={styles.filterServerBlock_block}>
              <input
                type="text"
                placeholder="Поиск по карте"
                className={styles.input}
                value={filters.map}
                onChange={changeMapFilter}
              />
              <select
                className={styles.select}
                value={filters.mode}
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

          <div className={styles.tagsContainer}>
            {AVAILABLE_TAGS.map((tag) => (
              <button
                key={tag.label}
                className={`${styles.tagButton} ${
                  filters.tags.includes(tag.label) ? styles.tagActive : ""
                }`}
                onClick={() => toggleTag(tag.label)}
              >
                {tag.label}
              </button>
            ))}
          </div>
        </div>
      </div>

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
            <span className={styles.dropdownLabel}>Количество игроков</span>
            <div className={styles.inputGroup}>
              <input
                type="number"
                placeholder="Мин."
                className={styles.input}
                value={filters.minPlayers}
                onChange={changeMinPlayers}
              />
              <input
                type="number"
                placeholder="Макс."
                className={styles.input}
                value={filters.maxPlayers}
                onChange={changeMaxPlayers}
              />
            </div>

            <span className={styles.dropdownLabel}>Карта</span>
            <input
              type="text"
              placeholder="Поиск по карте"
              className={styles.input}
              value={filters.map}
              onChange={changeMapFilter}
            />

            <span className={styles.dropdownLabel}>Режим</span>
            <select
              className={styles.select}
              value={filters.mode}
              onChange={changeModeFilter}
            >
              <option value="">Все режимы</option>
              {mods.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            <span className={styles.dropdownLabel}>Теги</span>
            <div className={styles.dropdownTagsContainer}>
              {AVAILABLE_TAGS.map((tag) => (
                <button
                  key={tag.label}
                  className={`${styles.tagButton} ${
                    filters.tags.includes(tag.label) ? styles.tagActive : ""
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
