"use client";
import React from "react";
import styles from "./PremiumServerList.module.scss";
import { GameServer } from "@/types/type";
import { getFormatData } from "@/lib/common";

type Props = {
  servers: GameServer[];
};

export default function PremiumServerList({ servers }: Props) {
  if (!servers || servers.length === 0) {
    return <p className={styles.empty}>Нет серверов с премиум-услугами</p>;
  }

  return (
    <div className={styles.list}>
      {servers.map((srv) => (
        <div className={styles.serverBlock} key={srv.id}>
          <h3 className={styles.serverName}>{srv.name}</h3>
          <div className={styles.servicesColumn}>
            {/* order: vip, top, color, balls */}

            {srv.service?.vip?.status && (
              <div className={styles.serviceItem}>
                <div className={styles.serviceLeft}>
                  <span className={styles.serviceTitle}>VIP:</span>
                  <span className={styles.serviceTerm}>
                    Окончание услуги -{" "}
                    {
                      getFormatData(srv.service.vip.term.toString())
                        .formattedDate
                    }
                  </span>
                </div>
              </div>
            )}

            {srv.service?.top?.status && (
              <div className={styles.serviceItem}>
                <div className={styles.serviceLeft}>
                  <span className={styles.serviceTitle}>ТОП:</span>
                  <span className={styles.serviceTerm}>
                    Окончание услуги -{" "}
                    {
                      getFormatData(srv.service.top.term.toString())
                        .formattedDate
                    }
                  </span>
                </div>
              </div>
            )}

            {srv.service?.color?.status && (
              <div className={styles.serviceItem}>
                <div className={styles.serviceLeft}>
                  <span className={styles.serviceTitle}>Цвет:</span>
                  <span className={styles.serviceTerm}>
                    Окончание услуги -{" "}
                    {
                      getFormatData(srv.service.color.term.toString())
                        .formattedDate
                    }
                  </span>
                </div>
                <div className={styles.colorMeta}>
                  <span
                    className={styles.colorSwatch}
                    style={{ background: srv.service.color.colorName }}
                  />
                  <span className={styles.colorHex}>
                    {srv.service.color.colorName}
                  </span>
                </div>
              </div>
            )}

            {srv.service?.balls?.status &&
              Array.isArray(srv.service.balls.listService) &&
              srv.service.balls.listService.map((item, idx) => (
                <div className={styles.serviceItem} key={`balls-${idx}`}>
                  <div className={styles.serviceLeft}>
                    <span className={styles.serviceTitle}>Баллы:</span>
                    <span className={styles.serviceTerm}>
                      Окончание услуги -{" "}
                      {getFormatData(item.term.toString()).formattedDate}
                    </span>
                  </div>
                  <div className={styles.colorMeta}>
                    <span className={styles.ballsBadge}>{item.quantity}</span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}
