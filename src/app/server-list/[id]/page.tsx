import FilterServerBlock from "@/Components/FilterServerBlock/FilterServerBlock";
import UpdateBlock from "@/Components/UpdateBlock/UpdateBlock";

export default function ServerListPage() {
  return (
    <div style={{ paddingLeft: "15px", paddingRight: "15px" }}>
      <FilterServerBlock />
      <UpdateBlock />
    </div>
  );
}
