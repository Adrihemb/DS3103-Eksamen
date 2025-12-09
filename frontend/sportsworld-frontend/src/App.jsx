import { useState } from "react";
import AthleteList from "./components/AthleteList";
import VenuePage from "./pages/VenuePage";
import VenueOverviewPage from "./pages/VenueOverviewPage";
import FinanceDashboard from "./components/FinanceDashboard";

function App() {
  const [activePage, setActivePage] = useState("dashboard");

  return (
    <div>
      <nav style={{ padding: "1rem", borderBottom: "2px solid #ccc" }}>
        <button onClick={() => setActivePage("dashboard")}>Dashboard</button>
        <button onClick={() => setActivePage("athletes")} style={{ marginLeft: "1rem" }}>
          Athletes
        </button>
        <button onClick={() => setActivePage("venues-overview")} style={{ marginLeft: "1rem" }}>
          Venues (oversikt)
        </button>
        <button onClick={() => setActivePage("venues-admin")} style={{ marginLeft: "1rem" }}>
          Venues (admin)
        </button>
      </nav>

      {activePage === "dashboard" && <FinanceDashboard />}
      {activePage === "athletes" && <AthleteList />}
      {activePage === "venues-overview" && <VenueOverviewPage />}
      {activePage === "venues-admin" && <VenuePage />}
    </div>
  );
}

export default App;
