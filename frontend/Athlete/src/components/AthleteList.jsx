import { useEffect, useState } from "react";

const API_BASE_URL = "http://localhost:5189";

function AthleteList() {
  const [athletes, setAthletes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all"); // all | available | purchased

  // state for ny athlete
  const [newName, setNewName] = useState("");
  const [newGender, setNewGender] = useState("Male");
  const [newPrice, setNewPrice] = useState("");
  const [newImage, setNewImage] = useState("");

  const loadAthletes = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_BASE_URL}/api/Athlete`);

      if (!response.ok) {
        throw new Error(`Feil fra API: ${response.status}`);
      }

      const data = await response.json();
      setAthletes(data);
    } catch (err) {
      console.error(err);
      setError("Kunne ikke hente idrettsutøvere.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAthletes();
  }, []);

  const handleBuy = async (athlete) => {
    if (athlete.purchaseStatus) return;

    const updatedAthlete = { ...athlete, purchaseStatus: true };

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/Athlete/${athlete.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedAthlete),
        }
      );

      if (!response.ok) {
        throw new Error("Feil ved oppdatering av idrettsutøver.");
      }

      setAthletes((prev) =>
        prev.map((a) => (a.id === athlete.id ? updatedAthlete : a))
      );
    } catch (err) {
      console.error(err);
      alert("Kunne ikke kjøpe idrettsutøver.");
    }
  };

  const handleDelete = async (athleteId) => {
    if (!window.confirm("Er du sikker på at du vil slette denne utøveren?")) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/Athlete/${athleteId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Feil ved sletting av idrettsutøver.");
      }

      setAthletes((prev) => prev.filter((a) => a.id !== athleteId));
    } catch (err) {
      console.error(err);
      alert("Kunne ikke slette idrettsutøver.");
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();

    if (!newName || !newPrice) {
      alert("Navn og pris er påkrevd.");
      return;
    }

    const athleteToCreate = {
      name: newName,
      gender: newGender,
      price: Number(newPrice),
      image: newImage || "",
      purchaseStatus: false,
    };

    try {
      const response = await fetch(`${API_BASE_URL}/api/Athlete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(athleteToCreate),
      });

      if (!response.ok) {
        throw new Error("Feil ved opprettelse av idrettsutøver.");
      }

      const created = await response.json();
      setAthletes((prev) => [...prev, created]);

      // reset form
      setNewName("");
      setNewGender("Male");
      setNewPrice("");
      setNewImage("");
    } catch (err) {
      console.error(err);
      alert("Kunne ikke registrere idrettsutøver.");
    }
  };

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
      {/* Registrer ny athlete */}
      <section
        style={{
          border: "1px solid #ddd",
          borderRadius: "8px",
          padding: "1rem",
          marginBottom: "1.5rem",
        }}
      >
        <h2>Registrer ny idrettsutøver</h2>
        <form
          onSubmit={handleCreate}
          style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}
        >
          <input
            type="text"
            placeholder="Navn"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            style={{ padding: "0.5rem", minWidth: "150px" }}
          />
          <select
            value={newGender}
            onChange={(e) => setNewGender(e.target.value)}
            style={{ padding: "0.5rem" }}
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
          <input
            type="number"
            placeholder="Pris (coins)"
            value={newPrice}
            onChange={(e) => setNewPrice(e.target.value)}
            style={{ padding: "0.5rem", width: "120px" }}
          />
          <input
            type="text"
            placeholder="Bilde-URL (valgfritt)"
            value={newImage}
            onChange={(e) => setNewImage(e.target.value)}
            style={{ padding: "0.5rem", minWidth: "200px" }}
          />
          <button
            type="submit"
            style={{
              padding: "0.5rem 1rem",
              borderRadius: "6px",
              border: "none",
              backgroundColor: "#28a745",
              color: "white",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Lagre
          </button>
        </form>
      </section>

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

      {/* Liste */}
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
                  src={athlete.image}
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

              <button
                onClick={() => handleBuy(athlete)}
                disabled={athlete.purchaseStatus}
                style={{
                  padding: "0.5rem 1rem",
                  borderRadius: "6px",
                  border: "none",
                  cursor: athlete.purchaseStatus ? "not-allowed" : "pointer",
                  backgroundColor: athlete.purchaseStatus ? "#aaa" : "#007bff",
                  color: "white",
                  fontWeight: 600,
                  marginRight: "0.5rem",
                }}
              >
                {athlete.purchaseStatus ? "Allerede kjøpt" : "Kjøp"}
              </button>

              <button
                onClick={() => handleDelete(athlete.id)}
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
                Slett
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default AthleteList;
