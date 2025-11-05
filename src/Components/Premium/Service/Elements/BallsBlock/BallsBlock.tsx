import React, { useState } from "react";
import styles from "../ColorBlock/ColorBlock.module.scss";
import { ballsArr, BallsLiteral } from "@/types/service.type";

type BallsProps = {
  setBalls: (balls: BallsLiteral) => void;
  initialBalls?: BallsLiteral;
};

export default function BallsBlock({ setBalls, initialBalls }: BallsProps) {
  const [selectedBalls, setSelectedBalls] = useState<BallsLiteral | undefined>(
    initialBalls
  );

  const handleBallClick = (value: BallsLiteral) => {
    setSelectedBalls(value);
    setBalls(value);
  };

  return (
    <div className={styles.colorGrid}>
      {ballsArr.map((val) => {
        const isSelected = val === selectedBalls;
        return (
          <div
            key={val}
            onClick={() => handleBallClick(val as BallsLiteral)}
            className={`${styles.ballsItem} ${
              isSelected ? styles.selected : ""
            }`}
          >
            <span className={styles.hexCode}>{val}</span>
          </div>
        );
      })}
    </div>
  );
}
