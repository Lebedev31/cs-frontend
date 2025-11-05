import styles from "./Play.module.scss";

type PlayProps = {
  width: string;
  height: string;
  ip: string;
  port: string;
};

export default function Play({ width, height, ip, port }: PlayProps) {
  const playGame = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    const play = `steam://connect/${ip}:${port}`;
    window.location.href = play;
  };
  return (
    <button className={styles.playButton} onClick={playGame}>
      <svg
        width={`${width}`}
        height={`${height}`}
        viewBox="0 0 24 24"
        fill="none"
      >
        <polygon points="5,3 19,12 5,21" fill="currentColor" />
      </svg>
    </button>
  );
}
