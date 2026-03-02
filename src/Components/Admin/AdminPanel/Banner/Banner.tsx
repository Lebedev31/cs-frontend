/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useRef, ChangeEvent } from "react";
import styles from "./Banner.module.scss";
import AdminAccordion from "../AdminAccordion/AdminAccordion";
import { toast } from "react-toastify";
import {
  useGetAllBannersQuery,
  useCreateBannerMutation,
  useUploadBannerImageMutation,
  useDeleteBannerMutation,
  BannerData,
} from "@/redux/apiSlice/bannerApi";
import Image from "next/image";
import { apiImg } from "@/redux/api.url";

// Форматирование числа
const fmt = (n: number) => n.toLocaleString("ru-RU");

// Статус баннера
function BannerStatus({
  expiresAt,
  isActive,
}: {
  expiresAt: string;
  isActive: boolean;
}) {
  const expired = new Date(expiresAt) < new Date();
  if (!isActive || expired) {
    return (
      <span className={`${styles.badge} ${styles.badgeExpired}`}>Истёк</span>
    );
  }
  return (
    <span className={`${styles.badge} ${styles.badgeActive}`}>Активен</span>
  );
}

// Карточка существующего баннера
function BannerCard({
  banner,
  onDelete,
  isDeleting,
}: {
  banner: BannerData;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}) {
  const ctr =
    banner.impressions > 0
      ? ((banner.clicks / banner.impressions) * 100).toFixed(2)
      : "0.00";

  return (
    <div className={styles.card}>
      {/* Превью */}
      <div className={styles.cardPreview}>
        <img src={`${apiImg}${banner.imageUrl}`} alt="Баннер" />
      </div>

      {/* Инфо */}
      <div className={styles.cardInfo}>
        <div className={styles.cardRow}>
          <BannerStatus
            expiresAt={banner.expiresAt}
            isActive={banner.isActive}
          />
          <span className={styles.cardDate}>
            до {new Date(banner.expiresAt).toLocaleDateString("ru-RU")}
          </span>
        </div>

        <a
          href={banner.linkUrl}
          className={styles.cardLink}
          target="_blank"
          rel="nofollow noopener noreferrer"
          title={banner.linkUrl}
        >
          {banner.linkUrl.length > 40
            ? banner.linkUrl.slice(0, 40) + "…"
            : banner.linkUrl}
        </a>

        {/* Статистика */}
        <div className={styles.stats}>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Показы</span>
            <span className={styles.statValue}>{fmt(banner.impressions)}</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Клики</span>
            <span className={styles.statValue}>{fmt(banner.clicks)}</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>CTR</span>
            <span className={`${styles.statValue} ${styles.statCtr}`}>
              {ctr}%
            </span>
          </div>
        </div>

        <button
          className={styles.deleteBtn}
          onClick={() => onDelete(banner._id)}
          disabled={isDeleting}
        >
          Удалить
        </button>
      </div>
    </div>
  );
}

// Форма создания баннера
function CreateBannerForm({ onSuccess }: { onSuccess: () => void }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>("");
  const [linkUrl, setLinkUrl] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  const [uploadImage, { isLoading: isUploading }] =
    useUploadBannerImageMutation();
  const [createBanner, { isLoading: isCreating }] = useCreateBannerMutation();

  // Минимальная дата — сегодня
  const today = new Date().toISOString().split("T")[0];

  const handleFile = async (file: File) => {
    // Проверка типа
    if (!["image/jpeg", "image/png", "image/gif"].includes(file.type)) {
      toast.error("Поддерживаются только .jpg, .png, .gif");
      return;
    }
    // Проверка размера (макс 5 МБ)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Максимальный размер файла — 5 МБ");
      return;
    }

    // Локальный превью
    const reader = new FileReader();
    reader.onload = (e) => setPreviewUrl(e.target?.result as string);
    reader.readAsDataURL(file);

    // Загрузка на сервер
    const formData = new FormData();
    formData.append("image", file);
    try {
      const result = await uploadImage(formData).unwrap();
      if (result.data?.url) {
        setUploadedImageUrl(result.data.url);
        toast.success("Изображение загружено");
      }
    } catch {
      toast.error("Ошибка загрузки изображения");
      setPreviewUrl("");
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleSubmit = async () => {
    if (!uploadedImageUrl) {
      toast.error("Загрузите изображение");
      return;
    }
    if (!linkUrl.trim()) {
      toast.error("Введите ссылку");
      return;
    }
    if (!expiresAt) {
      toast.error("Выберите дату окончания");
      return;
    }

    try {
      await createBanner({
        imageUrl: uploadedImageUrl,
        linkUrl: linkUrl.trim(),
        expiresAt: new Date(expiresAt).toISOString(),
      }).unwrap();
      toast.success("Баннер создан!");
      // Сброс формы
      setPreviewUrl("");
      setUploadedImageUrl("");
      setLinkUrl("");
      setExpiresAt("");
      if (fileRef.current) fileRef.current.value = "";
      onSuccess();
    } catch {
      toast.error("Ошибка создания баннера");
    }
  };

  return (
    <div className={styles.form}>
      <h4 className={styles.formTitle}>Создать баннер</h4>

      {/* Загрузка изображения */}
      <div className={styles.formGroup}>
        <label className={styles.formLabel}>
          Изображение (.jpg, .png, .gif, макс. 5 МБ)
        </label>
        <div
          className={`${styles.dropzone} ${isDragging ? styles.dropzoneDragging : ""} ${previewUrl ? styles.dropzoneHasImage : ""}`}
          onClick={() => fileRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
        >
          {previewUrl ? (
            <div className={styles.dropzonePreview}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewUrl}
                alt="Превью"
                className={styles.previewImg}
              />
              {isUploading && (
                <div className={styles.uploadingOverlay}>
                  <span>Загрузка...</span>
                </div>
              )}
            </div>
          ) : (
            <div className={styles.dropzonePlaceholder}>
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              <span>Перетащите файл или нажмите для выбора</span>
            </div>
          )}
        </div>
        <input
          ref={fileRef}
          type="file"
          accept=".jpg,.jpeg,.png,.gif"
          onChange={handleInputChange}
          className={styles.hiddenInput}
        />
      </div>

      {/* Ссылка */}
      <div className={styles.formGroup}>
        <label className={styles.formLabel}>URL ссылки (куда ведёт клик)</label>
        <input
          type="url"
          className={styles.formInput}
          placeholder="https://example.com"
          value={linkUrl}
          onChange={(e) => setLinkUrl(e.target.value)}
        />
      </div>

      {/* Срок действия */}
      <div className={styles.formGroup}>
        <label className={styles.formLabel}>Срок действия (до)</label>
        <input
          type="date"
          className={styles.formInput}
          min={today}
          value={expiresAt}
          onChange={(e) => setExpiresAt(e.target.value)}
        />
      </div>

      <button
        className={styles.submitBtn}
        onClick={handleSubmit}
        disabled={isCreating || isUploading || !uploadedImageUrl}
      >
        {isCreating ? "Создание..." : "Создать баннер"}
      </button>
    </div>
  );
}

// Главный компонент секции
export default function Banners() {
  const [isOpen, setIsOpen] = useState(false);
  const { data, isLoading, refetch } = useGetAllBannersQuery(undefined, {
    skip: !isOpen,
  });
  const [deleteBanner, { isLoading: isDeleting }] = useDeleteBannerMutation();

  const banners: BannerData[] = Array.isArray(data?.data) ? data.data : [];

  const handleToggle = (open: boolean) => setIsOpen(open);

  const handleDelete = async (id: string) => {
    if (!confirm("Удалить баннер?")) return;
    try {
      await deleteBanner({ id }).unwrap();
      toast.success("Баннер удалён");
    } catch {
      toast.error("Ошибка удаления");
    }
  };

  return (
    <AdminAccordion
      title="Управление рекламой"
      icon="📢"
      onToggle={handleToggle}
    >
      <div className={styles.layout}>
        {/* Левая колонка — форма */}
        <div className={styles.left}>
          <CreateBannerForm onSuccess={refetch} />
        </div>

        {/* Правая колонка — список */}
        <div className={styles.right}>
          <h4 className={styles.listTitle}>
            Все баннеры {banners.length > 0 && `(${banners.length})`}
          </h4>

          {isLoading ? (
            <p className={styles.loading}>Загрузка...</p>
          ) : banners.length === 0 ? (
            <p className={styles.empty}>Баннеров пока нет</p>
          ) : (
            <div className={styles.list}>
              {banners.map((banner) => (
                <BannerCard
                  key={banner._id}
                  banner={banner}
                  onDelete={handleDelete}
                  isDeleting={isDeleting}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminAccordion>
  );
}
