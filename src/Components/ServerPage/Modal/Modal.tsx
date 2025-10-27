"use client";
import { toast } from "react-toastify";
import styles from "./Modal.module.scss";
import { useConfirmServerMutation } from "@/redux/apiSlice/addServerApi";
import { handleToastError } from "@/lib/common";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  serverId: string;
}

export default function Modal({ isOpen, onClose, serverId }: ModalProps) {
  const [triger] = useConfirmServerMutation();
  if (!isOpen) return null;

  const confirmServer = async () => {
    try {
      const result = await triger({ serverId }).unwrap();
      if (result && result.statusCode >= 200) {
        toast.success("Вы успешно подтвердили свой сервер");
      }
    } catch (error) {
      console.log(error);
      handleToastError(error);
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>
          ✕
        </button>

        <h2 className={styles.title}>Подтвердите права</h2>

        <p className={styles.description}>
          Для подтверждения сервера в течении 5 минут смените название на
          server, после чего нажмите на кнопку{" "}
          <span style={{ color: "green" }}>&quot;Проверить статус&quot;</span>.
          При успешном подтверждении данный сервер будет привязан к вашему
          аккаунту. Данная услуга доступна только авторизированному
          пользователю.
        </p>

        <button onClick={confirmServer} className={styles.confirmButton}>
          Проверить статус
        </button>
      </div>
    </div>
  );
}
