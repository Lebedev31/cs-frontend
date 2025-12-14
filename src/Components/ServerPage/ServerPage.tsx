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
import ServerPageSkeleton from "./ServerPageSkeleton/ServerPageSkeleton";
import { safePoints } from "../UpdateBlock/ServerBlockItem/ServerBlockItem";
import Play from "../UpdateBlock/Elements/Play/Play";
import SocialMediaBlock from "./SocialMediaBlock/SocialMediaBlock";

export default function ServerPage() {
  const { id } = useParams();
  const serverList = useSelector((state: RootState) => state.main.servers);
  const [server, setServer] = useState<GameServer | null>(null);
  const [trigger, { isFetching }] = useLazyGetServerByIdQuery();
  const [increaseRating] = useIncreaseRatingMutation();
  const [balls, setBalls] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const setPremiumBalls = (server: GameServer) => {
    return (
      server.service.balls?.listService?.reduce(
        (acc, item) => acc + item.quantity,
        0
      ) || 0
    );
  };

  useEffect(() => {
    if (!id) return;

    const newId = id as string;
    const decodedId = decodeURIComponent(newId);
    const ipAndPortArr = decodedId.split(":");

    const foundInRedux = serverList.find(
      (item) =>
        item.ip === ipAndPortArr[0] && item.port.toString() === ipAndPortArr[1]
    );

    if (foundInRedux) {
      setServer(foundInRedux);
      setBalls(foundInRedux.rating + setPremiumBalls(foundInRedux));
    } else {
      getByServer(decodedId);
    }
  }, [id, serverList]);

  async function getByServer(serverId: string) {
    try {
      const result = await trigger({ id: serverId });
      if (result.data?.data) {
        setServer(result.data.data);
        setBalls(safePoints(result.data.data));
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
      if (result.data && result.data.rating !== undefined) {
        console.log(result.data.rating);
        setBalls(setPremiumBalls(server) + result.data.rating);
      }
    } catch (error) {
      console.log(error);
      toast.error("Авторизируйтесь, чтобы повысить рейтинг сервера");
    }
  };

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  // Функция для определения цвета пинга
  const getPingColor = (ping: number) => {
    if (ping < 50) return styles.pingGood;
    if (ping < 100) return styles.pingMedium;
    return styles.pingBad;
  };

  if (!server || isFetching) {
    return (
      <div className={styles.server_page}>
        <ServerPageSkeleton />
      </div>
    );
  }

  const percentage =
    Math.round((server.players / server.maxPlayers) * 100) || 0;

  return (
    <div className={styles.server_page}>
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        serverId={decodeURIComponent(id as string)}
      />

      <div className={styles.wrapper}>
        <h1 className={styles.title}>{server.name}</h1>
        <div className={styles.server_info}>
          <div className={styles.left_column}>
            <div className={styles.map_card}>
              <div className={styles.map_image}>
                <Image
                  fill
                  alt="картинка карты"
                  style={{ objectFit: "cover" }}
                  src={`${getMapImagePath(server.map || "", server.game)}`}
                  sizes="(max-width: 768px) 100vw, 350px"
                />
              </div>
              <div className={styles.map_title}>{server.map}</div>
            </div>
            <div className={styles.progress_card}>
              <div className={styles.progress_text}>
                <span className={styles.players_label}>
                  Количество игроков:
                </span>{" "}
                <span className={styles.players_count}>
                  {server.players}/{server.maxPlayers} ~ {percentage}%
                </span>
              </div>
              <div className={styles.progress_bar}>
                <div
                  className={styles.progress_fill}
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>
            <div className={styles.tags_card}>
              <div className={styles.tags_title}>Опции:</div>
              <div className={styles.tags_list}>
                {server.tags && server.tags.length > 0 ? (
                  server.tags.map((tag, index) => (
                    <span key={index} className={styles.tag_item}>
                      {tag}
                    </span>
                  ))
                ) : (
                  <span className={styles.no_tags}>Опции отсутствуют</span>
                )}
              </div>
            </div>

            <div className={styles.rating_card}>
              <div className={styles.rating_value}>{balls}</div>
              <div className={styles.rating_img} style={{ cursor: "pointer" }}>
                <div className={styles.img_block}>
                  <Image
                    width={50}
                    height={50}
                    alt="повысить рейтинг"
                    src={"/стрелочка.png"}
                    onClick={rating}
                  />
                </div>
              </div>
            </div>
            {server.service?.vip?.status ? (
              <div className={styles.vip_crown}>
                <Image
                  fill
                  src={"/vip.png"}
                  style={{ objectFit: "cover" }}
                  alt="vip"
                />
              </div>
            ) : null}
          </div>
          <div className={styles.right_wrapper}>
            <div className={styles.center_right_wrapper}>
              <div className={styles.center_column}>
                <div className={styles.server_header}>
                  <div className={styles.server_info_grid}>
                    <div className={styles.info_item}>
                      <span className={styles.info_label}>Игра:</span>
                      <span className={styles.info_value}>{server.game}</span>
                    </div>
                    <div className={styles.info_item}>
                      <span className={styles.info_label}>Адрес:</span>
                      <div className={styles.address_value}>
                        <span
                          className={`fi fi-${server.country.toLowerCase()} ${
                            styles.countryFlag
                          }`}
                        ></span>
                        {`${server.ip}:${server.port}`}
                        <CoppyButton
                          ip={server.ip}
                          port={String(server.port)}
                        />
                        <Play
                          width="12"
                          height="12"
                          ip={server.ip}
                          port={server.port}
                        />
                      </div>
                    </div>
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
                      <span className={styles.info_label}>Добавлен:</span>
                      <span className={styles.info_value}>
                        {getFormatData(server.createdAt).formattedDate}
                      </span>
                    </div>
                    <div className={styles.info_item}>
                      <span className={styles.info_label}>Владелец:</span>
                      <span className={styles.owner_nick}>
                        {server.ownerLogin || (
                          <span className={styles.info_value}>
                            Владелец отсутсвует
                          </span>
                        )}
                      </span>
                      <span
                        onClick={handleOpenModal}
                        className={styles.owner_link}
                      >
                        (Это Вы?)
                      </span>
                    </div>
                    <div className={styles.info_item}>
                      <span className={styles.info_label}>Сайт сервера:</span>
                      {!server.website ? (
                        <span className={styles.info_value}>
                          Сайт отсутствует
                        </span>
                      ) : (
                        <a
                          className={styles.info_website}
                          target="_blank"
                          href={server.website}
                        >
                          {server.website}
                        </a>
                      )}
                    </div>
                    <div className={styles.info_item}>
                      <span className={styles.info_label}>Мод:</span>
                      <span className={styles.info_value}>{server.mode}</span>
                    </div>

                    <div className={styles.info_item}>
                      <span className={styles.info_label}>Пинг:</span>
                      <span className={styles.info_value}>
                        <span
                          className={`${styles.ping_in_line} ${getPingColor(
                            server.ping
                          )}`}
                        >
                          {server.ping} ms
                        </span>
                      </span>
                    </div>
                    <div className={styles.info_item}>
                      <span className={styles.info_label}>
                        Социальные сети:
                      </span>
                      <SocialMediaBlock
                        vk={server.vk}
                        discord={server.discord}
                        telegram={server.telegram}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.right_column}>
                <div className={styles.players_card}>
                  <div className={styles.players_title}>Список игроков</div>
                  <div className={styles.table_container}>
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
                              <td>
                                {item?.name === "" ? "unnamed" : item?.name}
                              </td>
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
            </div>
            <div className={styles.description_card}>
              <div className={styles.description_title}>Описание</div>
              <p
                className={`${styles.description_text} ${
                  !server.description ? styles.description_missing : ""
                }`}
              >
                {server.description || "Описания нет"}
              </p>
            </div>
          </div>
        </div>
        <CommentsBlock serverId={server.serverId} />
      </div>
    </div>
  );
}
