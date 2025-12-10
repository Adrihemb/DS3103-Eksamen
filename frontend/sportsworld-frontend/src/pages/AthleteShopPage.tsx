import { useEffect, useState } from "react";
import AthleteService from "../services/AthleteService";
import type { IAthlete } from "../types/athleteTypes";

function AthleteShopPage() {
  const [athletes, setAthletes] = useState<IAthlete[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filter, setFilter] = useState<string>("all"); // all | available | purchased

  async function loadAthletes(): Promise<void> {
    try {
      setLoading(true);
      setError("");

      const data = await AthleteService.getAll();
      setAthletes(data);
    } catch (err) {
      console.error(err);
      setError("Kunne ikke hente idrettsutøvere.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadAthletes();
  }, []);

  async function handleBuy(athlete: IAthlete): Promise<void> {
    if (athlete.purchaseStatus) return; // allerede kjøpt

    const updatedAthlete = { ...athlete, purchaseStatus: true };

    try {
      await AthleteService.update(updatedAthlete);

      // Oppdater state lokalt
      setAthletes((prev) =>
        prev.map((a) => (a.id === athlete.id ? updatedAthlete : a))
      );
    } catch (err) {
      console.error(err);
      alert("Kunne ikke kjøpe idrettsutøver.");
    }
  }

  async function handleSell(athlete: IAthlete): Promise<void> {
    if (!athlete.purchaseStatus) return; // ikke kjøpt

    const updatedAthlete = { ...athlete, purchaseStatus: false };

    try {
      await AthleteService.update(updatedAthlete);

      // Oppdater state lokalt
      setAthletes((prev) =>
        prev.map((a) => (a.id === athlete.id ? updatedAthlete : a))
      );
    } catch (err) {
      console.error(err);
      alert("Kunne ikke selge idrettsutøver.");
    }
  }

  // Filtrering og søk i minnet
  const filteredAthletes = athletes.filter((athlete) => {
    if (
      searchTerm &&
      !athlete.name.toLowerCase().includes(searchTerm.toLowerCase())
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

  // Summer coins brukt på kjøpte utøvere
  const totalCoinsSpent = athletes
    .filter((a) => a.purchaseStatus)
    .reduce((sum, a) => sum + a.price, 0);

  if (loading) {
    return <p>Laster idrettsutøvere...</p>;
  }

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  return (
    <div style={{ marginTop: "1.5rem" }}>
      {/* Kontrollpanel */}
      <div
        style={{
          display: "flex",
          gap: "1rem",
          marginBottom: "1rem",
          flexWrap: "wrap",
        }}
      >
        <input
          type="text"
          placeholder="Søk på navn..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ padding: "0.5rem", minWidth: "200px" }}
        />

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{ padding: "0.5rem" }}
        >
          <option value="all">Alle</option>
          <option value="available">Kun tilgjengelige</option>
          <option value="purchased">Kun kjøpte</option>
        </select>

        <div style={{ marginLeft: "auto", fontWeight: "bold" }}>
          Coins brukt: {totalCoinsSpent}
        </div>
      </div>

      {/* Liste med idrettsutøvere */}
      {filteredAthletes.length === 0 ? (
        <p>Fant ingen idrettsutøvere.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {filteredAthletes.map((athlete) => (
            <li
              key={athlete.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "1rem",
                marginBottom: "0.75rem",
                display: "flex",
                alignItems: "center",
                gap: "1rem",
              }}
            >
              {athlete.image && (
                <img
                  src={`http://localhost:5189/images/athletes/${athlete.image}`}
                  alt={athlete.name}
                  style={{
                    width: "80px",
                    height: "80px",
                    objectFit: "cover",
                    borderRadius: "50%",
                  }}
                />
              )}

              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: "bold" }}>{athlete.name}</div>
                <div>
                  {athlete.gender} – {athlete.price} coins
                </div>
                <div>
                  Status:{" "}
                  {athlete.purchaseStatus ? "Kjøpt" : "Tilgjengelig"}
                </div>
              </div>

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
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default AthleteShopPage;
