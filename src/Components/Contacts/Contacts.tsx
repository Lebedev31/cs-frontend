"use client";
import styles from "./Contacts.module.scss";
import { handleSubmit } from "@/lib/common";
import { ContactsSchema, Contacts as ContactsType } from "@/types/type";
import { useMessageMutation } from "@/redux/apiSlice/contactsApi";
import { useState, useRef } from "react";
import { toast } from "react-toastify";

export default function Contacts() {
  const [sendMessage] = useMessageMutation();
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);

  const [validationError, setValidationError] = useState({
    errorName: "",
    errorEmail: "",
    errorDescription: "",
  });

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    const formData: ContactsType = {
      name: nameRef.current?.value || "",
      email: emailRef.current?.value || "",
      description: descriptionRef.current?.value || "",
    };

    handleSubmit(
      e,
      (errors) => {
        setValidationError({
          errorName: errors.name || "",
          errorEmail: errors.email || "",
          errorDescription: errors.description || "",
        });
      },
      sendMessage,
      formData,
      ContactsSchema,
      formData,
      (data) => {
        toast.success(data.message || "Сообщение отправлено!");
        if (nameRef.current) nameRef.current.value = "";
        if (emailRef.current) emailRef.current.value = "";
        if (descriptionRef.current) descriptionRef.current.value = "";
      }
    );
  };

  return (
    <div className={styles.page}>
      <div className={styles.wrapper}>
        <h1 className={styles.title}>Контакты</h1>

        <form className={styles.form} onSubmit={onSubmit}>
          <div className={styles.inputWrapper}>
            <input
              ref={nameRef}
              type="text"
              placeholder="Имя"
              className={styles.input}
            />
            {validationError.errorName && (
              <p className={styles.error}>{validationError.errorName}</p>
            )}
          </div>

          <div className={styles.inputWrapper}>
            <input
              ref={emailRef}
              type="email"
              placeholder="Email"
              className={styles.input}
            />
            {validationError.errorEmail && (
              <p className={styles.error}>{validationError.errorEmail}</p>
            )}
          </div>

          <div className={styles.inputWrapper}>
            <textarea
              ref={descriptionRef}
              placeholder="Ваше сообщение"
              className={styles.textarea}
            />
            {validationError.errorDescription && (
              <p className={styles.error}>{validationError.errorDescription}</p>
            )}
          </div>

          <button type="submit" className={styles.button}>
            Отправить
          </button>
        </form>

        <div className={styles.contactInfo}>
          <h3 className={styles.infoTitle}>Контактные данные:</h3>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Email</span>
            <span className={styles.infoValue}>support@csrating.com</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>ВК</span>
            <span className={styles.infoValue}>vk.com/csrating</span>
          </div>
        </div>
      </div>
    </div>
  );
}
