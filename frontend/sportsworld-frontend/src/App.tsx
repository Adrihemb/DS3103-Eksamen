import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import AthletePage from "./pages/AthletePage";
import AthleteOverviewPage from "./pages/AthleteOverviewPage";
import VenuePage from "./pages/VenuePage";
import VenueOverviewPage from "./pages/VenueOverviewPage";
import FinanceDashboard from "./pages/FinanceDashboard";

function App() {
  return (
    <BrowserRouter>
      <div>
        <h1 className="p-4 bg-blue-600 text-white text-center text-3xl">
          SportsWorld
        </h1>

        <nav className="p-4 border-b mb-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 bg-gray-100">
          <Link to="/" className="border p-2 rounded bg-white hover:bg-gray-200">
            Finance dashboard
          </Link>
          <Link to="/athletes" className="border p-2 rounded bg-white hover:bg-gray-200">
            Athletes (kjøp)
          </Link>
          <Link to="/athletes/admin" className="border p-2 rounded bg-white hover:bg-gray-200">
            Athletes (admin)
          </Link>
          <Link to="/athletes/register" className="border p-2 rounded bg-white hover:bg-gray-200">
            Athletes (registrer)
          </Link>
          <Link to="/venues" className="border p-2 rounded bg-white hover:bg-gray-200">
            Venues (oversikt)
          </Link>
          <Link to="/venues/admin" className="border p-2 rounded bg-white hover:bg-gray-200">
            Venues (admin)
          </Link>
        </nav>

        <main>
          <Routes>
            <Route path="/" element={<FinanceDashboard />} />
            <Route path="/athletes" element={<AthleteOverviewPage />} />
            <Route path="/athletes/admin" element={<AthletePage />} />
            <Route path="/athletes/register" element={<AthleteOverviewPage />} />
            <Route path="/venues" element={<VenueOverviewPage />} />
            <Route path="/venues/admin" element={<VenuePage />} />
            <Route 
              path="*" 
              element={
                <div className="p-4">
                  <h2 className="mb-4">404 - Side ikke funnet</h2>
                  <Link to="/" className="text-blue-600">Tilbake til Finance dashboard</Link>
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
