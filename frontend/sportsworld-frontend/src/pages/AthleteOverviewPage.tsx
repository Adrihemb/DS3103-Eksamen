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
    <main className="athlete-overview">
      <h1>Idrettsutøvere</h1>

      <div style={{ marginBottom: "1rem" }}>
        <label htmlFor="athleteSearch">Søk etter idrettsutøver: </label>
        <br />
        <input
          id="athleteSearch"
          type="text"
          placeholder="Søk etter idrettsutøvere..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: "0.5rem", minWidth: "200px", marginRight: "1rem" }}
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{ padding: "0.5rem", marginRight: "1rem" }}
        >
          <option value="all">Alle</option>
          <option value="available">Kun tilgjengelige</option>
          <option value="purchased">Kun kjøpte</option>
        </select>
        <span style={{ fontWeight: "bold" }}>
          Coins brukt: {totalCoinsSpent}
        </span>
      </div>

      {loading && <p>Laster idrettsutøvere...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && (
        <>
          <div className="athlete-grid">
            {filteredAthletes.map((athlete) => {
              const imageUrl = athlete.image
                ? `${IMAGE_URL}/athletes/${athlete.image}`
                : undefined;

              return (
                <article
                  key={athlete.id}
                  className="athlete-card"
                  style={{
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    padding: "1rem",
                    textAlign: "center",
                  }}
                >
                  {imageUrl && (
                    <img
                      src={imageUrl}
                      alt={`Bilde av ${athlete.name}`}
                      className="athlete-image"
                      style={{
                        width: "120px",
                        height: "120px",
                        borderRadius: "50%",
                        marginBottom: "0.5rem",
                        objectFit: "cover",
                      }}
                    />
                  )}
                  <h3>{athlete.name}</h3>
                  <p>{athlete.gender} – {athlete.price} coins</p>
                  <p>
                    Status:{" "}
                    <strong>
                      {athlete.purchaseStatus ? "Kjøpt" : "Tilgjengelig"}
                    </strong>
                  </p>
                  <div style={{ marginTop: "0.5rem" }}>
                    {!athlete.purchaseStatus ? (
                      <button
                        onClick={() => handleBuy(athlete)}
                        style={{
                          padding: "0.5rem 1rem",
                          borderRadius: "6px",
                          border: "none",
                          cursor: "pointer",
                          backgroundColor: "#28a745",
                          color: "white",
                          fontWeight: 600,
                        }}
                      >
                        Kjøp
                      </button>
                    ) : (
                      <button
                        onClick={() => handleSell(athlete)}
                        style={{
                          padding: "0.5rem 1rem",
                          borderRadius: "6px",
                          border: "none",
                          cursor: "pointer",
                          backgroundColor: "#dc3545",
                          color: "white",
                          fontWeight: 600,
                        }}
                      >
                        Selg
                      </button>
                    )}
                  </div>
                </article>
              );
            })}
          </div>

          {filteredAthletes.length === 0 && (
            <p style={{ textAlign: "center", marginTop: "2rem" }}>
              Fant ingen idrettsutøvere.
            </p>
          )}
        </>
      )}
    </main>
  );
}

export default AthleteOverviewPage;
