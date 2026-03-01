"use client";

import { useState } from "react";
import styles from "./Servers.module.scss";
import Pagination from "@/Components/Pagination/Pagination";
import AdminAccordion from "../AdminAccordion/AdminAccordion";
import AdminComments from "./AdminComment/AdminComment";
import AdminServices from "./AdminServices/AdminServices";
import AddServerModal from "./AddServerModal/AddServerModal";
import AdminSearch from "../AdminSearch/AdminSearch";
import React from "react";
import {
  useLazyGetServersQuery,
  useDeleteServerMutation,
  useAddServerMutation,
  AdminServer,
} from "@/redux/apiSlice/adminApi";
import { useAdminSearch } from "../AdminSearch/useAdminSearch";

export default function Servers() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedRow, setExpandedRow] = useState<{
    id: string;
    tab: "comments" | "services";
  } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const serversPerPage = 5;

  const [fetchServers, { data: serversData }] = useLazyGetServersQuery();
  const [deleteServer] = useDeleteServerMutation();
  const [addServer] = useAddServerMutation();

  const servers: AdminServer[] = serversData?.data
    ? Array.isArray(serversData.data)
      ? serversData.data
      : [serversData.data]
    : [];

  const { query, setQuery, filtered } = useAdminSearch("servers", servers);

  const handleToggle = (open: boolean) => {
    if (open) fetchServers();
  };

  // Сброс страницы при поиске
  const handleSearch = (value: string) => {
    setQuery(value);
    setCurrentPage(1);
  };

  const indexOfLast = currentPage * serversPerPage;
  const indexOfFirst = indexOfLast - serversPerPage;
  const currentServers = filtered.slice(indexOfFirst, indexOfLast);

  const handleDeleteServer = async (id: string) => {
    if (!confirm("Удалить сервер?")) return;
    try {
      await deleteServer({ id }).unwrap();
    } catch (e) {
      console.error("Ошибка удаления сервера", e);
    }
  };

  const toggleExpand = (id: string, tab: "comments" | "services") => {
    if (expandedRow?.id === id && expandedRow.tab === tab) {
      setExpandedRow(null);
    } else {
      setExpandedRow({ id, tab });
    }
  };

  return (
    <AdminAccordion
      title="Управление серверами"
      icon="🖥️"
      onToggle={handleToggle}
    >
      <button className={styles.addBtn} onClick={() => setIsModalOpen(true)}>
        + Добавить сервер
      </button>

      <AdminSearch
        query={query}
        onChange={handleSearch}
        placeholder="Поиск по IP:Port..."
      />

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>IP Адрес</th>
              <th>Услуги</th>
              <th>Комментарии</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {currentServers.length === 0 ? (
              <tr>
                <td colSpan={5} className={styles.empty}>
                  Ничего не найдено
                </td>
              </tr>
            ) : (
              currentServers.map((server) => (
                <React.Fragment key={server._id}>
                  <tr
                    className={
                      expandedRow?.id === server._id ? styles.rowActive : ""
                    }
                  >
                    <td>{server._id}</td>
                    <td className={styles.ip}>
                      {server.ip}:{server.port}
                    </td>
                    <td>
                      <button
                        className={styles.commentBtn}
                        onClick={() => toggleExpand(server._id, "services")}
                      >
                        Премиум{" "}
                        {expandedRow?.id === server._id &&
                        expandedRow.tab === "services"
                          ? "▲"
                          : "▼"}
                      </button>
                    </td>
                    <td>
                      <button
                        className={styles.commentBtn}
                        onClick={() => toggleExpand(server._id, "comments")}
                      >
                        {expandedRow?.id === server._id &&
                        expandedRow.tab === "comments"
                          ? "Скрыть ▲"
                          : "Открыть ▼"}
                      </button>
                    </td>
                    <td>
                      <button
                        className={styles.btnDanger}
                        onClick={() => handleDeleteServer(server._id)}
                      >
                        Удалить
                      </button>
                    </td>
                  </tr>

                  {expandedRow?.id === server._id && (
                    <tr>
                      <td colSpan={5} className={styles.commentCell}>
                        {expandedRow.tab === "comments" ? (
                          <AdminComments id={server._id} />
                        ) : (
                          <AdminServices
                            serverId={server._id}
                            initialServices={server.service}
                          />
                        )}
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        serversPerPage={serversPerPage}
        totalServers={filtered.length}
        currentPage={currentPage}
        paginate={setCurrentPage}
      />

      <AddServerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        mutation={addServer}
      />
    </AdminAccordion>
  );
}
