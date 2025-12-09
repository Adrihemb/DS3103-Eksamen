import AthleteList from "./components/AthleteList";
import FinanceDashboard from "./components/FinanceDashboard";

function App() {
  return (
    <div style={{ padding: "1rem" }}>
      <h1>SportsWorld</h1>

      {/* Page 3: Dashboard for finances and purchase */}
      <FinanceDashboard />

      <hr />

      {/* Page 1: Administering athletes (per nå bare listevisning) */}
      <AthleteList />
    </div>
  );
}

export default App;
