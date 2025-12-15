import { useEffect, useState } from "react";
import AthleteService from "../services/AthleteService";
import type { IAthlete } from "../types/athleteTypes";
import { IMAGE_URL } from "../global";

/**
 * AthleteOverviewPage - Main public page for browsing and purchasing athletes
 * 
 * Features:
 * - Display all athletes in a responsive grid (2-4-5 columns)
 * - Search athletes by name
 * - Filter by purchase status (All, Available, Purchased)
 * - Buy/Sell functionality
 * - Display total coins spent on purchased athletes
 */
function AthleteOverviewPage() {
  // State management
  const [athletes, setAthletes] = useState<IAthlete[]>([]); // All athletes from backend
  const [search, setSearch] = useState<string>(""); // Search query
  const [filter, setFilter] = useState<string>("all"); // Filter: "all", "available", "purchased"
  const [loading, setLoading] = useState<boolean>(true); // Loading state for API calls
  const [error, setError] = useState<string | null>(null); // Error message state

  /**
   * Load all athletes from the backend API
   * Sets loading state and handles errors gracefully
   */
  async function loadAthletes(): Promise<void> {
    try {
      setLoading(true);
      setError(null);

      const data = await AthleteService.getAll();
      setAthletes(data);
    } catch (err) {
      console.error("Failed to load athletes.", err);
      setError("Could not load athletes.");
    } finally {
      setLoading(false);
    }
  }

  // Load athletes on component mount
  useEffect(() => {
    void loadAthletes();
  }, []);

  /**
   * Handle buying an athlete
   * Updates athlete purchaseStatus to true and persists to backend
   * @param athlete - The athlete to purchase
   */
  async function handleBuy(athlete: IAthlete): Promise<void> {
    // Don't allow buying already purchased athletes
    if (athlete.purchaseStatus) return;

    const updatedAthlete = { ...athlete, purchaseStatus: true };

    try {
      await AthleteService.update(updatedAthlete);
      // Update local state to reflect the purchase
      setAthletes((prev) =>
        prev.map((a) => (a.id === athlete.id ? updatedAthlete : a))
      );
    } catch (err) {
      console.error(err);
      alert("Could not purchase athlete.");
    }
  }

  /**
   * Handle selling an athlete
   * Updates athlete purchaseStatus to false and persists to backend
   * @param athlete - The athlete to sell
   */
  async function handleSell(athlete: IAthlete): Promise<void> {
    // Don't allow selling already available athletes
    if (!athlete.purchaseStatus) return;

    const updatedAthlete = { ...athlete, purchaseStatus: false };

    try {
      await AthleteService.update(updatedAthlete);
      // Update local state to reflect the sale
      setAthletes((prev) =>
        prev.map((a) => (a.id === athlete.id ? updatedAthlete : a))
      );
    } catch (err) {
      console.error(err);
      alert("Could not sell athlete.");
    }
  }

  /**
   * Filter athletes based on search query and filter selection
   */
  const filteredAthletes = athletes.filter((athlete) => {
    // Filter by search query
    if (
      search &&
      !athlete.name.toLowerCase().includes(search.toLowerCase())
    ) {
      return false;
    }

    // Filter by purchase status
    if (filter === "available" && athlete.purchaseStatus) {
      return false;
    }

    if (filter === "purchased" && !athlete.purchaseStatus) {
      return false;
    }

    return true;
  });

  /**
   * Calculate total coins spent on purchased athletes
   */
  const totalCoinsSpent = athletes
    .filter((a) => a.purchaseStatus)
    .reduce((sum, a) => sum + a.price, 0);

  return (
    <main className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      {/* Page header with gradient background */}
      <h1 className="mb-4 text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-lg shadow-lg">🏆 Athletes</h1>

      {/* Search and filter controls */}
      <div className="mb-4">
        <label htmlFor="athleteSearch" className="mb-2 block">Search for athlete: </label>
        <input
          id="athleteSearch"
          type="text"
          placeholder="Search athletes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded w-full mb-4"
        />
        {/* Filter dropdown */}
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border p-2 rounded w-full mb-4"
        >
          <option value="all">All</option>
          <option value="available">Available Only</option>
          <option value="purchased">Purchased Only</option>
        </select>
        {/* Display total coins spent */}
        <p className="font-bold">
          Coins Spent: {totalCoinsSpent}
        </p>
      </div>

      {/* Loading and error states */}
      {loading && <p>Loading athletes...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {/* Athlete grid */}
      {!loading && !error && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredAthletes.map((athlete) => {
              // Construct image URL if athlete has an image
              const imageUrl = athlete.image
                ? `${IMAGE_URL}/athletes/${athlete.image}`
                : undefined;

              return (
                // Athlete card component
                <article
                  key={athlete.id}
                  className="border rounded p-4 flex flex-col bg-white shadow-md hover:shadow-lg transition-shadow duration-300"
                >
                  {/* Athlete image */}
                  {imageUrl && (
                    <img
                      src={imageUrl}
                      alt={`Image of ${athlete.name}`}
                      className="w-full rounded mb-2 object-contain"
                    />
                  )}
                  {/* Athlete details and action button */}
                  <div className="mt-auto">
                    <h3 className="mb-2 text-lg font-bold text-gray-800">{athlete.name}</h3>
                    <p className="text-base text-gray-600">{athlete.gender} – {athlete.price} coins</p>
                    {/* Display position if available */}
                    {athlete.position && <p className="text-sm text-gray-600">📍 {athlete.position}</p>}
                    {/* Display nationality if available */}
                    {athlete.nationality && <p className="text-sm text-gray-600">🌍 {athlete.nationality}</p>}
                    {/* Purchase status badge */}
                    <p className="text-sm mb-4 text-gray-500 mt-2">
                      Status:{" "}
                      <strong className="text-gray-700">
                        {athlete.purchaseStatus ? "Purchased" : "Available"}
                      </strong>
                    </p>
                    {/* Buy/Sell button - toggles based on purchase status */}
                    <div>
                      {!athlete.purchaseStatus ? (
                        <button
                          onClick={() => handleBuy(athlete)}
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded w-full font-semibold transition-colors duration-200"
                        >
                          Buy
                        </button>
                      ) : (
                        <button
                          onClick={() => handleSell(athlete)}
                          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded w-full font-semibold transition-colors duration-200"
                        >
                          Sell
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {/* No results message */}
          {filteredAthletes.length === 0 && (
            <p className="text-center mt-8">
              No athletes found.
            </p>
          )}
        </>
      )}
    </main>
  );
}

export default AthleteOverviewPage;
