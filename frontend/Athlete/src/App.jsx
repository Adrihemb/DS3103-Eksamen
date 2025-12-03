import "./App.css";
import AthleteList from "./components/AthleteList";

function App() {
  return (
    <div className="app-container">
      <header>
        <h1>SportsWorld – Athletes</h1>
        <p>Velg og kjøp idrettsutøvere til laget ditt.</p>
      </header>

      <main>
        <AthleteList />
      </main>

      <footer>
        <p>&copy; {new Date().getFullYear()} SportsWorld</p>
      </footer>
    </div>
  );
}

export default App;
