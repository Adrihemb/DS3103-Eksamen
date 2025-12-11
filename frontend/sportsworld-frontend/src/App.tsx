import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import AthleteList from "./components/AthleteList.jsx";
import AdminAthletes from "./components/AdminAthletes.jsx";
import RegisterAthlete from "./components/RegisterAthlete.jsx";
import VenuePage from "./pages/VenuePage";
import VenueOverviewPage from "./pages/VenueOverviewPage";
import FinanceDashboard from "./pages/FinanceDashboard";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <h1 className="text-center py-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-3xl font-bold m-0">
          SportsWorld
        </h1>

        <nav className="px-4 py-3 border-b-2 border-gray-300 flex gap-4 flex-wrap bg-white shadow-sm">
          <Link to="/" className="px-4 py-2 no-underline text-gray-800 hover:bg-gray-100 rounded transition-colors">
            Finance
          </Link>
          <Link to="/athletes" className="px-4 py-2 no-underline text-gray-800 hover:bg-gray-100 rounded transition-colors">
            Athletes (kjøp)
          </Link>
          <Link to="/athletes/admin" className="px-4 py-2 no-underline text-gray-800 hover:bg-gray-100 rounded transition-colors">
            Athletes (admin)
          </Link>
          <Link to="/athletes/register" className="px-4 py-2 no-underline text-gray-800 hover:bg-gray-100 rounded transition-colors">
            Athletes (registrer)
          </Link>
          <Link to="/venues" className="px-4 py-2 no-underline text-gray-800 hover:bg-gray-100 rounded transition-colors">
            Venues (oversikt)
          </Link>
          <Link to="/venues/admin" className="px-4 py-2 no-underline text-gray-800 hover:bg-gray-100 rounded transition-colors">
            Venues (admin)
          </Link>
        </nav>

        <main className="p-8 max-w-7xl mx-auto">
          <Routes>
            <Route path="/" element={<FinanceDashboard />} />
            <Route path="/athletes" element={<AthleteList />} />
            <Route path="/athletes/admin" element={<AdminAthletes />} />
            <Route path="/athletes/register" element={<RegisterAthlete />} />
            <Route path="/venues" element={<VenueOverviewPage />} />
            <Route path="/venues/admin" element={<VenuePage />} />
            <Route 
              path="*" 
              element={
                <div className="text-center p-8 bg-white rounded-lg shadow">
                  <h2 className="text-2xl font-bold mb-4">404 - Side ikke funnet</h2>
                  <p className="mb-4">
                    <Link to="/" className="text-blue-600 hover:underline">Tilbake til Dashboard</Link>
                  </p>
                </div>
              } 
            />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
