import styles from "./AdminPanel.module.scss";
import StatisticServers from "./StatisticServers/StatisticServer";
import Users from "./Users/Users";
import Servers from "./Servers/Servers";
import Infos from "./Infos/Infos";
import Banners from "./Banner/Banner";

export default function AdminPanel() {
  return (
    <div className={styles.admin_panel}>
      <StatisticServers />
      <Users />
      <Servers />
      <Infos />
      <Banners />
    </div>
  );
}
