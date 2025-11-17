"use client";
import styles from "../../SettingAccount.module.scss";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useAddAvatarMutation } from "@/redux/apiSlice/settingAccountApi";
import { handleToastError } from "@/lib/common";
import { apiImg } from "@/redux/api.url";

type UploadImgProps = {
  avatarUrl: string;
};

export default function UploadImg({ avatarUrl }: UploadImgProps) {
  const [addAvatar, { isLoading }] = useAddAvatarMutation();
  const [avatar, setAvatar] = useState<string | null>(null);
  useEffect(() => {
    if (avatarUrl) {
      setAvatar(avatarUrl);
    }
  }, [avatarUrl]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.currentTarget;
    const file = e.target.files?.[0] ?? null;
    if (!file) {
      return;
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.warn("Файл слишком большой. Максимум 5 МБ.");
      // очищаем input, чтобы пользователь мог выбрать снова
      e.currentTarget.value = "";
      return;
    }

    try {
      const result = await addAvatar({ file }).unwrap();
      if (result.statusCode >= 200) {
        setAvatar(result.data || null);
        toast.success("Аватарка успешно загружена");
      }
    } catch (error) {
      handleToastError(error);
    } finally {
      input.value = "";
    }
  };

  return (
    <div className={styles.avatar_block}>
      <div className={styles.avatar_preview}>
        {avatar ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            className={styles.avatar_img}
            src={`${avatar.startsWith("http") ? avatar : apiImg + avatar}`}
            alt=""
          />
        ) : (
          <span style={{ fontSize: 17 }}>
            {isLoading ? "Идет загрузка..." : "Установите аватарку"}
          </span>
        )}
      </div>
      <label className={styles.avatar_change}>
        Изменить аватарку
        <input type="file" onChange={handleFileChange} hidden />
      </label>
    </div>
  );
}
