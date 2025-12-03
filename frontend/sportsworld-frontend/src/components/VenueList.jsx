import { useEffect, useState } from "react";

function VenueList() {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchVenues() {
      try {
        const response = await fetch("http://localhost:5189/api/Venue");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setVenues(data);
      } catch (err) {
        console.error(err);
        setError("Kunne ikke hente arenaer.");
      } finally {
        setLoading(false);
      }
    }

    fetchVenues();
  }, []);

  if (loading) return <p>Laster arenaer...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  if (venues.length === 0) {
    return <p>Ingen arenaer funnet.</p>;
  }

  return (
    <div>
      <h1>SportsWorld – Venues</h1>
      <ul>
        {venues.map((venue) => (
          <li key={venue.id}>
            <strong>{venue.name}</strong> – Capacity: {venue.capacity.toLocaleString()}{" "}
            <span style={{ fontSize: "0.9em", color: "#666" }}>({venue.image})</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default VenueList;
