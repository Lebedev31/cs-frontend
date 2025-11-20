"use client";
import styles from "./ServerPage.module.scss";
import { useParams } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import "flag-icons/css/flag-icons.min.css";
import CoppyButton from "../UpdateBlock/Elements/CopyButton/CoppyButton";
import CommentsBlock from "./CommentsBlock/CommentsBlock";
import { useState, useEffect } from "react";
import { useLazyGetServerByIdQuery } from "@/redux/apiSlice/csServerApi";
import { GameServer } from "@/types/type";
import { toast } from "react-toastify";
import Image from "next/image";
import { useIncreaseRatingMutation } from "@/redux/apiSlice/ratingApi";
import { getMapImagePath, getFormatData } from "@/lib/common";
import Modal from "./Modal/Modal";
// Импортируем скелетон
import ServerPageSkeleton from "./ServerPageSkeleton/ServerPageSkeleton";

export default function ServerPage() {
  const { id } = useParams();
  const serverList = useSelector((state: RootState) => state.main.servers);
  // Инициализируем как null, чтобы четко понимать, когда данных нет
  const [server, setServer] = useState<GameServer | null>(null);
  const [trigger, { isFetching }] = useLazyGetServerByIdQuery();
  const [increaseRating] = useIncreaseRatingMutation();
  const [balls, setBalls] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    if (!id) return;

    const newId = id as string;
    const decodedId = decodeURIComponent(newId);
    const ipAndPortArr = decodedId.split(":");

    // 1. Сначала ищем в Redux (быстрый доступ)
    const foundInRedux = serverList.find(
      (item) =>
        item.ip === ipAndPortArr[0] && item.port.toString() === ipAndPortArr[1]
    );

    if (foundInRedux) {
      setServer(foundInRedux);
      setBalls(foundInRedux.rating);
    } else {
      // 2. Если нет в Redux, запрашиваем через API
      getByServer(decodedId);
    }

    // Убрал 'server' из зависимостей, чтобы избежать бесконечного цикла,
    // если объект server меняется (ссылка на объект)
  }, [id, serverList]);

  async function getByServer(serverId: string) {
    try {
      const result = await trigger({ id: serverId });
      if (result.data?.data) {
        setServer(result.data.data);
        setBalls(result.data.data.rating);
      } else if (result.isError) {
        toast.error("Не удалось найти сервер");
      }
    } catch (error) {
      console.log(error);
      toast.error("Произошла ошибка при получении данных");
    }
  }

  const rating = async () => {
    if (!server) return;
    try {
      const result = await increaseRating({
        serverId: server.serverId,
      }).unwrap();
      if (result.data) {
        setBalls(result.data.rating);
        toast.success("Рейтинг повышен!");
      }
    } catch (error) {
      console.log(error);
      toast.error("Авторизируйтесь, чтобы повысить рейтинг сервера");
    }
  };

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  // ЛОГИКА ОТОБРАЖЕНИЯ:
  // Если сервер еще null ИЛИ идет загрузка из API -> показываем Скелетон
  if (!server || isFetching) {
    return (
      <div className={styles.server_page}>
        <ServerPageSkeleton />
      </div>
    );
  }
  return (
    <div className={styles.server_page}>
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        serverId={decodeURIComponent(id as string)}
      />
      <div className={styles.wrapper}>
        <div className={styles.server_info}>
          {/* Левая панель */}
          <div className={styles.aside}>
            {/* Карточка карты */}
            <div className={styles.map_card}>
              <div className={styles.map_title}>{server.map}</div>
              <div className={styles.map_image}>
                <Image
                  fill
                  alt="картинка карты"
                  style={{ objectFit: "cover" }}
                  src={`${getMapImagePath(server.map || "", server.game)}`}
                  // Добавил sizes для оптимизации Next.js Image
                  sizes="(max-width: 768px) 100vw, 350px"
                />
              </div>
            </div>

            {/* Список игроков */}
            <div className={styles.players_card}>
              <div className={styles.players_title}>Список игроков</div>
              <div
                className={styles.table_container}
                style={{ overflowY: "auto", maxHeight: "300px" }}
              >
                <table className={styles.players_table}>
                  <thead>
                    <tr>
                      <th>№</th>
                      <th>Ник</th>
                      <th>Счёт</th>
                    </tr>
                  </thead>
                  <tbody>
                    {server.playersList?.length > 0 ? (
                      server.playersList.map((item, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{item?.name === "" ? "unnamed" : item?.name}</td>
                          <td>{item?.raw ? item?.raw.score : 0}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={3}
                          style={{ textAlign: "center", padding: "20px" }}
                        >
                          Игроков нет
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Основной контент */}
          <div className={styles.main_content}>
            {/* Заголовок сервера */}
            <div className={styles.server_header}>
              <div className={styles.server_title}>{server.name}</div>

              <div className={styles.server_address}>
                <div className={styles.countryFlag}>
                  <span className={`fi fi-${server.country}`}></span>{" "}
                </div>
                <p
                  className={styles.address_value}
                >{`${server.ip}:${server.port}`}</p>
                <CoppyButton ip={server.ip} port={String(server.port)} />
              </div>

              <div className={styles.server_info_grid}>
                <div className={styles.info_item}>
                  <span className={styles.info_label}>Статус сервера:</span>
                  <span
                    className={`${styles.info_value} ${
                      server.isOnline ? styles.online : styles.offline
                    }`}
                  >
                    {server.isOnline ? "Включен" : "Выключен"}
                  </span>
                </div>

                <div className={styles.info_item}>
                  <span className={styles.info_label}>Игра:</span>
                  <span className={styles.info_value}>{server.game}</span>
                </div>

                <div className={styles.info_item}>
                  <span className={styles.info_label}>Мод: </span>
                  <span className={styles.info_value}>{server.mode}</span>
                </div>

                <div className={styles.info_item}>
                  <span className={styles.info_label}>Игроки:</span>
                  <span
                    className={styles.player_count}
                  >{`${server.players}/${server.maxPlayers}`}</span>
                </div>

                <div className={styles.info_item}>
                  <span className={styles.info_label}>Сайт сервера:</span>
                  <span className={styles.info_website}>
                    {server.website || "---"}
                  </span>
                </div>

                <div className={styles.info_item}>
                  <span className={styles.info_label}>Добавлен:</span>
                  {
                    <span className={styles.info_value}>
                      {getFormatData(server.createdAt).formattedDate}
                    </span>
                  }
                </div>
              </div>
            </div>

            {/* Владелец */}
            <div className={styles.owner_section}>
              <div className={styles.owner_title}>Владелец:</div>
              <div className={styles.owner_info}>
                <span className={styles.owner_nick}>
                  {server.ownerLogin || "Нет владельца"}
                </span>
                <span onClick={handleOpenModal} className={styles.owner_link}>
                  Я владелец/подтвердить сервер
                </span>
              </div>
            </div>

            {/* Рейтинг и Описание */}
            <div className={styles.block_flex}>
              <div className={styles.rating_section}>
                <h3 className={styles.rating_title}>Рейтинг сервера:</h3>
                <div className={styles.rating_value}>{balls}</div>
                <h4 className={styles.rating_title}>
                  Повысить рейтинг сервера
                </h4>
                <div
                  className={styles.rating_img}
                  style={{ cursor: "pointer" }}
                >
                  <Image
                    width={50}
                    height={50}
                    alt="повысить рейтинг"
                    src={"/стрелочка.png"}
                    onClick={rating}
                  />
                </div>
              </div>

              <div className={styles.rating_section}>
                <h3 className={styles.rating_title}>Описание сервера:</h3>
                <p className={styles.description_text}>
                  {server.description || "Описание отсутствует"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Нижняя секция */}
        <div>
          {server.service?.vip?.status ? (
            <div className={styles.statusBadge}>VIP</div>
          ) : null}
          <CommentsBlock serverId={server.serverId} />
        </div>
      </div>
    </div>
  );
}
