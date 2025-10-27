import styles from "./PlayersInfo.module.scss";

type PlayersInfoProps = {
  players: number;
  maxPlayers: number;
};

export default function PlayersInfo({ players, maxPlayers }: PlayersInfoProps) {
  return (
    <div className={styles.playersInfo}>
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        className={styles.playersIcon}
      >
        <path
          d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
          stroke="currentColor"
          strokeWidth="2"
        />
        <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" />
      </svg>
      <span className={styles.players}>
        {players}/{maxPlayers}
      </span>
    </div>
  );
}
