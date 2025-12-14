import { useEffect, useState } from "react";
import AthleteService from "../services/AthleteService";
import type { IAthlete } from "../types/athleteTypes";
import { IMAGE_URL } from "../global";

function AthleteOverviewPage() {
  const [athletes, setAthletes] = useState<IAthlete[]>([]);
  const [search, setSearch] = useState<string>("");
  const [filter, setFilter] = useState<string>("all");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  async function loadAthletes(): Promise<void> {
    try {
      setLoading(true);
      setError(null);

      const data = await AthleteService.getAll();
      setAthletes(data);
    } catch (err) {
      console.error("Noe gikk galt ved henting av idrettsutøvere.", err);
      setError("Kunne ikke hente idrettsutøvere.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadAthletes();
  }, []);

  async function handleBuy(athlete: IAthlete): Promise<void> {
    if (athlete.purchaseStatus) return;

    const updatedAthlete = { ...athlete, purchaseStatus: true };

    try {
      await AthleteService.update(updatedAthlete);
      setAthletes((prev) =>
        prev.map((a) => (a.id === athlete.id ? updatedAthlete : a))
      );
    } catch (err) {
      console.error(err);
      alert("Kunne ikke kjøpe idrettsutøver.");
    }
  }

  async function handleSell(athlete: IAthlete): Promise<void> {
    if (!athlete.purchaseStatus) return;

    const updatedAthlete = { ...athlete, purchaseStatus: false };

    try {
      await AthleteService.update(updatedAthlete);
      setAthletes((prev) =>
        prev.map((a) => (a.id === athlete.id ? updatedAthlete : a))
      );
    } catch (err) {
      console.error(err);
      alert("Kunne ikke selge idrettsutøver.");
    }
  }

  const filteredAthletes = athletes.filter((athlete) => {
    if (
      search &&
      !athlete.name.toLowerCase().includes(search.toLowerCase())
    ) {
      return false;
    }

    if (filter === "available" && athlete.purchaseStatus) {
      return false;
    }

    if (filter === "purchased" && !athlete.purchaseStatus) {
      return false;
    }

    return true;
  });

  const totalCoinsSpent = athletes
    .filter((a) => a.purchaseStatus)
    .reduce((sum, a) => sum + a.price, 0);

  return (
    <main className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <h1 className="mb-4 text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-lg shadow-lg">🏆 Athletes</h1>

      <div className="mb-4">
        <label htmlFor="athleteSearch" className="mb-2 block">Søk etter idrettsutøver: </label>
        <input
          id="athleteSearch"
          type="text"
          placeholder="Søk etter idrettsutøvere..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded w-full mb-4"
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border p-2 rounded w-full mb-4"
        >
          <option value="all">Alle</option>
          <option value="available">Kun tilgjengelige</option>
          <option value="purchased">Kun kjøpte</option>
        </select>
        <p className="font-bold">
          Coins brukt: {totalCoinsSpent}
        </p>
      </div>

      {loading && <p>Laster idrettsutøvere...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredAthletes.map((athlete) => {
              const imageUrl = athlete.image
                ? `${IMAGE_URL}/athletes/${athlete.image}`
                : undefined;

              return (
                <article
                  key={athlete.id}
                  className="border rounded p-4 flex flex-col bg-white shadow-md hover:shadow-lg transition-shadow duration-300"
                >
                  {imageUrl && (
                    <img
                      src={imageUrl}
                      alt={`Bilde av ${athlete.name}`}
                      className="w-full rounded mb-2 object-contain"
                    />
                  )}
                  <div className="mt-auto">
                    <h3 className="mb-2 text-lg font-bold text-gray-800">{athlete.name}</h3>
                    <p className="text-base text-gray-600">{athlete.gender} – {athlete.price} coins</p>
                    {athlete.position && <p className="text-sm text-gray-600">📍 {athlete.position}</p>}
                    {athlete.nationality && <p className="text-sm text-gray-600">🌍 {athlete.nationality}</p>}
                    <p className="text-sm mb-4 text-gray-500 mt-2">
                      Status:{" "}
                      <strong className="text-gray-700">
                        {athlete.purchaseStatus ? "Kjøpt" : "Tilgjengelig"}
                      </strong>
                    </p>
                    <div>
                      {!athlete.purchaseStatus ? (
                        <button
                          onClick={() => handleBuy(athlete)}
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded w-full font-semibold transition-colors duration-200"
                        >
                          Kjøp
                        </button>
                      ) : (
                        <button
                          onClick={() => handleSell(athlete)}
                          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded w-full font-semibold transition-colors duration-200"
                        >
                          Selg
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {filteredAthletes.length === 0 && (
            <p className="text-center mt-8">
              Fant ingen idrettsutøvere.
            </p>
          )}
        </>
      )}
    </main>
  );
}

export default AthleteOverviewPage;
