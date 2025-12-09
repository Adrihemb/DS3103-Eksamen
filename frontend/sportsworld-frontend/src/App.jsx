import { useState } from "react";
import AthleteList from "./components/AthleteList";
import VenuePage from "./pages/VenuePage";
import VenueOverviewPage from "./pages/VenueOverviewPage";

function App() {
  const [activePage, setActivePage] = useState("venues-overview");

  return (
    <div>
      <nav style={{ padding: "1rem", borderBottom: "2px solid #ccc" }}>
        <button onClick={() => setActivePage("athletes")}>Athletes</button>
        <button onClick={() => setActivePage("venues-overview")} style={{ marginLeft: "1rem" }}>
          Venues (oversikt)
        </button>
        <button onClick={() => setActivePage("venues-admin")} style={{ marginLeft: "1rem" }}>
          Venues (admin)
        </button>
      </nav>

      {activePage === "athletes" && <AthleteList />}
      {activePage === "venues-overview" && <VenueOverviewPage />}
      {activePage === "venues-admin" && <VenuePage />}
    </div>
  );
}

export default App;
