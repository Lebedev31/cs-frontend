"use client";
import Image from "next/image";
import { Game } from "@/types/type";
import styles from "./Main.module.scss";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { setSelectedServer } from "@/redux/slice/main.slice";
const games = [
  {
    id: 1,
    name: "CS:GO" as Game,
    image: "/csgo.png",
  },
  {
    id: 2,
    name: "CS2" as Game,
    image: "/cs2.png",
  },
];

export default function Main() {
  const dispatch: AppDispatch = useDispatch();
  function setEndpoint(typeGame: Game) {
    localStorage.setItem("typeGame", typeGame);
    dispatch(setSelectedServer(typeGame));
  }
  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        {games.map((game) => (
          <Link href={"/server-list"} key={game.id}>
            <div className={styles.card} onClick={() => setEndpoint(game.name)}>
              <div className={styles.imageContainer}>
                {/* Компонент Image с prop "fill".
                  sizes обязателен для fill для оптимизации (указывает браузеру размер картинки).
              */}
                <Image
                  src={game.image}
                  alt={game.name}
                  fill
                  className={styles.gameImage}
                  priority={game.id <= 2} // Приоритетная загрузка для первых элементов (опционально)
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              <div className={styles.content}>
                <h2 className={styles.gameName}>{game.name}</h2>
                <div className={styles.info}></div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
