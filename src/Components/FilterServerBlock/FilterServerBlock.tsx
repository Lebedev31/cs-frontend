"use client";

import styles from "./FilterServerBlock.module.scss";
import Image from "next/image";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { setServers } from "@/redux/slice/main.slice";

export default function FilterServerBlock() {
  const originalServers = useSelector(
    (state: RootState) => state.main.originalServers
  );

  const dispatch: AppDispatch = useDispatch();
  const [serverNameValue, setServerNameValue] = useState<string>("");
  const [minPlayers, setMinPlayers] = useState<string>("");
  const [maxPlayers, setMaxPlayers] = useState<string>("");
  const [mapValue, setMapValue] = useState<string>("");
  const [modeValue, setModeValue] = useState<string>("");

  // Универсальная функция фильтрации
  const applyFilters = (
    name = serverNameValue,
    min = minPlayers,
    max = maxPlayers,
    map = mapValue,
    mode = modeValue
  ) => {
    let filtered = originalServers;

    // Фильтр по названию
    if (name.trim()) {
      filtered = filtered.filter((item) =>
        item.name.toLowerCase().includes(name.toLowerCase())
      );
    }

    // Фильтр по минимальному количеству игроков
    if (min && !isNaN(Number(min))) {
      filtered = filtered.filter((item) => item.maxPlayers >= Number(min));
    }

    // Фильтр по максимальному количеству игроков
    if (max && !isNaN(Number(max))) {
      filtered = filtered.filter((item) => item.maxPlayers <= Number(max));
    }

    // Фильтр по карте
    if (map) {
      filtered = filtered.filter((item) => item.map === map);
    }

    if (mode) {
      filtered = filtered.filter((item) => item.mode === mode);
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

  const changeMapFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setMapValue(value);
    applyFilters(serverNameValue, minPlayers, maxPlayers, value);
  };

  const changeModeFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setModeValue(value);
    applyFilters(serverNameValue, minPlayers, maxPlayers, mapValue, value);
  };

  return (
    <div className={styles.filterServerBlock}>
      {/* Логотип слева */}
      <div className={styles.filterServerBlock_logo}>
        <Image width={120} height={100} src="/logo.jpg" alt="Логотип CS 1.6" />
      </div>

      {/* Фильтры справа */}
      <div className={styles.filterServerBlock_filtration}>
        <h2>Сервера</h2>
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
            <select
              className={styles.select}
              value={mapValue}
              onChange={changeMapFilter}
            >
              <option value="">Карта</option>
              <option value="de_dust2">de_dust2</option>
              <option value="de_inferno">de_inferno</option>
              <option value="de_mirage">de_mirage</option>
            </select>

            <select
              className={styles.select}
              value={modeValue}
              onChange={changeModeFilter}
            >
              <option value="">Режим</option>
              <option value="Паблик">Паблик</option>
              <option value="Тюрьма">Тюрьма</option>
              <option value="AWP">AWP</option>
              <option value="Deathmatch">Deathmatch</option>
              <option value="Surf">Surf</option>
              <option value="Zombie Mod">Zombie Mod</option>
              <option value="Zombie Escape">Zombie Escape</option>
              <option value="Murder">Murder</option>
              <option value="HvH">HvH</option>
              <option value="MatchMaking">MatchMaking</option>
              <option value="Retake">Retake</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
