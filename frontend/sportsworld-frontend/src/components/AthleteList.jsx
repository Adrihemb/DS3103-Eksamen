import { useEffect, useState } from "react";

function AthleteList() {
  const [athletes, setAthletes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchAthletes() {
      try {
        const response = await fetch("http://localhost:5189/api/Athlete");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setAthletes(data);
      } catch (err) {
        console.error(err);
        setError("Kunne ikke hente idrettsutøvere.");
      } finally {
        setLoading(false);
      }
    }

    fetchAthletes();
  }, []);

  if (loading) return <p>Laster idrettsutøvere...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  if (athletes.length === 0) {
    return <p>Ingen idrettsutøvere funnet.</p>;
  }

  return (
    <div>
      <h1>SportsWorld – Athletes</h1>
      <ul>
        {athletes.map((athlete) => (
          <li key={athlete.id}>
            <strong>{athlete.name}</strong> – {athlete.gender} – {athlete.price} coins{" "}
            ({athlete.purchaseStatus ? "Kjøpt" : "Tilgjengelig"})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AthleteList;
