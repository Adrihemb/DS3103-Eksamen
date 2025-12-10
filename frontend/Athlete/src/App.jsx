import { useState } from "react";
import "./App.css";
import AthleteList from "./components/AthleteList";
import AdminAthletes from "./components/AdminAthletes";
import RegisterAthlete from "./components/RegisterAthlete";

function App() {
  const [activePage, setActivePage] = useState("shop"); // "shop" | "admin" | "register"

  return (
    <div className="app-container">
      <header>
        <h1>SportsWorld – Athletes</h1>
        <p>Velg, administrer og registrer idrettsutøvere.</p>

        {/* Enkel “meny” på toppen */}
        <nav style={{ marginTop: "1rem", marginBottom: "1rem" }}>
          <button
            onClick={() => setActivePage("shop")}
            style={{
              marginRight: "0.5rem",
              padding: "0.5rem 1rem",
              fontWeight: activePage === "shop" ? "bold" : "normal",
            }}
          >
            Kjøp/oversikt
          </button>
          <button
            onClick={() => setActivePage("admin")}
            style={{
              marginRight: "0.5rem",
              padding: "0.5rem 1rem",
              fontWeight: activePage === "admin" ? "bold" : "normal",
            }}
          >
            Administer athletes
          </button>
          <button
            onClick={() => setActivePage("register")}
            style={{
              padding: "0.5rem 1rem",
              fontWeight: activePage === "register" ? "bold" : "normal",
            }}
          >
            Register potential athlete
          </button>
        </nav>
      </header>

      <main>
        {activePage === "shop" && <AthleteList />}
        {activePage === "admin" && <AdminAthletes />}
        {activePage === "register" && <RegisterAthlete />}
      </main>

      <footer>
        <p>&copy; {new Date().getFullYear()} SportsWorld</p>
      </footer>
    </div>
  );
}

export default App;
