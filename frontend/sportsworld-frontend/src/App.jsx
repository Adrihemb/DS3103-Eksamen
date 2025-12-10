import { useState } from "react";
import AthleteList from "./components/AthleteList";
import AdminAthletes from "./components/AdminAthletes";
import RegisterAthlete from "./components/RegisterAthlete";
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
          Athletes (kjøp)
        </button>
        <button onClick={() => setActivePage("athletes-admin")} style={{ marginLeft: "1rem" }}>
          Athletes (admin)
        </button>
        <button onClick={() => setActivePage("athletes-register")} style={{ marginLeft: "1rem" }}>
          Athletes (registrer)
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
      {activePage === "athletes-admin" && <AdminAthletes />}
      {activePage === "athletes-register" && <RegisterAthlete />}
      {activePage === "venues-overview" && <VenueOverviewPage />}
      {activePage === "venues-admin" && <VenuePage />}
    </div>
  );
}

export default App;
