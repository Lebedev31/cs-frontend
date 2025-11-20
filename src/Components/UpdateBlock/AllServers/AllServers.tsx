"use client";

import styles from "./AllServers.module.scss";
import { GameServer } from "@/types/type";
import ServerBlockItem from "../ServerBlockItem/ServerBlockItem";
import Pagination from "@/Components/Pagination/Pagination";
// 1. Импортируем хуки навигации
import { useSearchParams, usePathname, useRouter } from "next/navigation";

export type AllServersProps = {
  data: GameServer[];
};

export default function AllServers({ data }: AllServersProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  // 2. Получаем текущую страницу из URL. Если параметра нет — по дефолту 1.
  const currentPage = Number(searchParams.get("page")) || 1;

  const serversPerPage = 10;

  // 3. Вычисляем индексы (логика остается той же)
  const indexOfLastServer = currentPage * serversPerPage;
  const indexOfFirstServer = indexOfLastServer - serversPerPage;
  const currentServers = data.slice(indexOfFirstServer, indexOfLastServer);

  // 4. Функция смены страницы теперь меняет URL, а не стейт
  const paginate = (pageNumber: number) => {
    // Создаем копию текущих параметров, чтобы не потерять фильтры (если они будут)
    const params = new URLSearchParams(searchParams.toString());

    // Устанавливаем новый номер страницы
    params.set("page", pageNumber.toString());

    // Пушим новый URL. { scroll: false } — если не хотите, чтобы страница прыгала вверх
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <>
      <div className={styles.allServers}>
        {currentServers.map((item, index) => {
          return <ServerBlockItem key={index} server={item} />;
        })}
      </div>

      <Pagination
        serversPerPage={serversPerPage}
        totalServers={data.length}
        paginate={paginate}
        currentPage={currentPage}
      />
    </>
  );
}
