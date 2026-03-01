"use client";

import { useState, useEffect } from "react";
import styles from "./Users.module.scss";
import Pagination from "@/Components/Pagination/Pagination";
import AdminAccordion from "../AdminAccordion/AdminAccordion";
import AdminSearch from "../AdminSearch/AdminSearch";
import {
  useLazyGetUsersQuery,
  useDeleteUserMutation,
  useUpdateBalanceMutation,
  useBlockingMutation,
  AdminUsers,
} from "@/redux/apiSlice/adminApi";
import { useAdminSearch } from "../AdminSearch/useAdminSearch";
import { handleToastError } from "@/lib/common";

type BalanceMap = Record<string, string>;

export default function Users() {
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  const [balanceInputs, setBalanceInputs] = useState<BalanceMap>({});
  const [prevBalances, setPrevBalances] = useState<BalanceMap>({});

  const [fetchUsers, { data: usersData }] = useLazyGetUsersQuery();
  const [deleteUser] = useDeleteUserMutation();
  const [updateBalance] = useUpdateBalanceMutation();
  const [blocking] = useBlockingMutation();

  const users: AdminUsers[] = usersData?.data
    ? Array.isArray(usersData.data)
      ? usersData.data
      : [usersData.data]
    : [];

  const { query, setQuery, filtered } = useAdminSearch("users", users);

  // Сбрасываем страницу при новом поиске
  useEffect(() => {
    setCurrentPage(1);
  }, [query]);

  const handleToggle = (open: boolean) => {
    if (open) fetchUsers();
  };

  const refetch = () => fetchUsers();

  useEffect(() => {
    if (users.length) {
      const initial: BalanceMap = {};
      users.forEach((u) => {
        initial[u.userId] = String(u.payment.balance ?? 0);
      });
      setBalanceInputs(initial);
      setPrevBalances(initial);
    }
  }, [usersData]);

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filtered.slice(indexOfFirstUser, indexOfLastUser);

  const validateBalance = (value: string): boolean => {
    if (value === "" || value === "0") return true;
    if (!/^\d+$/.test(value)) return false;
    const num = parseInt(value, 10);
    return num >= 0 && num <= 1_000_000;
  };

  const handleBalanceChange = (userId: string, value: string) => {
    if (/[.,\-]/.test(value)) return;
    if (value !== "" && parseInt(value, 10) > 1_000_000) return;
    setBalanceInputs((prev) => ({ ...prev, [userId]: value }));
  };

  const handleBalanceBlur = async (userId: string) => {
    const raw = balanceInputs[userId] ?? "";

    if (!validateBalance(raw)) {
      setBalanceInputs((prev) => ({
        ...prev,
        [userId]: prevBalances[userId] ?? "0",
      }));
      return;
    }

    const newBalance = raw === "" ? 0 : parseInt(raw, 10);
    const prevValue = prevBalances[userId] ?? "0";

    if (newBalance === parseInt(prevValue, 10)) return;

    try {
      await updateBalance({ userId, newBalance }).unwrap();
      setPrevBalances((prev) => ({ ...prev, [userId]: String(newBalance) }));
    } catch {
      setBalanceInputs((prev) => ({ ...prev, [userId]: prevValue }));
    }
  };

  const handleToggleBlock = async (userId: string, isBlocking: boolean) => {
    try {
      await blocking({ userId, block: !isBlocking }).unwrap();
      refetch();
    } catch (e) {
      handleToastError(e);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Удалить аккаунт безвозвратно?")) return;
    try {
      await deleteUser({ id: userId }).unwrap();
      refetch();
    } catch (e) {
      handleToastError(e);
    }
  };

  return (
    <AdminAccordion
      title="Управление пользователями"
      icon="👤"
      onToggle={handleToggle}
    >
      <AdminSearch
        query={query}
        onChange={setQuery}
        placeholder="Поиск по логину..."
      />

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Никнейм</th>
              <th>Email</th>
              <th>Баланс</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.length === 0 ? (
              <tr>
                <td colSpan={5} className={styles.empty}>
                  Ничего не найдено
                </td>
              </tr>
            ) : (
              currentUsers.map((user) => (
                <tr
                  key={user.userId}
                  className={user.isBlocking ? styles.row_blocked : ""}
                >
                  <td>{user.userId}</td>
                  <td className={styles.nickname}>{user.login}</td>
                  <td className={styles.email}>{user.email}</td>
                  <td>
                    <input
                      type="number"
                      className={styles.balanceInput}
                      value={balanceInputs[user.userId] ?? ""}
                      placeholder="0"
                      min={0}
                      max={1_000_000}
                      step={1}
                      onChange={(e) =>
                        handleBalanceChange(user.userId, e.target.value)
                      }
                      onBlur={() => handleBalanceBlur(user.userId)}
                    />
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <button
                        className={`${styles.btn} ${styles.btn_block}`}
                        onClick={() =>
                          handleToggleBlock(user.userId, user.isBlocking)
                        }
                      >
                        {user.isBlocking ? "Разблок." : "Блок"}
                      </button>
                      <button
                        className={`${styles.btn} ${styles.btn_delete}`}
                        onClick={() => handleDeleteUser(user.userId)}
                      >
                        Удалить
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        serversPerPage={usersPerPage}
        totalServers={filtered.length}
        currentPage={currentPage}
        paginate={setCurrentPage}
      />
    </AdminAccordion>
  );
}
