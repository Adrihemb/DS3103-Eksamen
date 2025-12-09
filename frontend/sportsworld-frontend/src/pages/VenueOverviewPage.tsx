import { useEffect, useState } from "react";
import VenueList from "../components/VenueList";
import type { IVenue } from "../types/venueTypes";

function VenueOverviewPage() {
  const [venues, setVenues] = useState<IVenue[]>([]);
  const [search, setSearch] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const apiBaseUrl = 'http://localhost:5189/api/Venue';

  async function loadVenues(): Promise<void> {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(apiBaseUrl);
      if (!response.ok) {
        throw new Error("Kunne ikke hente arenaer.");
      }

      const data = await response.json();
      setVenues(data);
    } catch (err) {
      console.error("Noe gikk galt ved henting av arenaer.", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
     void loadVenues();
  }, []);

    const filteredVenues = venues.filter((venue) =>
      venue.name.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <main className="venue-overview">
      <h1>Arenaer</h1>

      <div style={{ marginBottom: "1rem" }}>
        <label htmlFor="venueSearch">Søk etter arena: </label>
        <br />
        <input
          id="venueSearch"
          type="text"
          placeholder="Søk etter arenaer..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <h2>Arenaer</h2>

      <div className="venue-grid">
        {filteredVenues.map((venue) => {
          const imageUrl = venue.image
            ? `http://localhost:5189/images/venues/${venue.image}`
            : undefined;

          return (
            <article key={venue.id} className="venue-card">
              {imageUrl && (
                <img
                  src={imageUrl}
                  alt={`Bilde av ${venue.name}`}
                  className="venue-image"
                />
              )}
              <h3>{venue.name}</h3>
              <p>Kapasitet: {venue.capacity.toLocaleString()}</p>
            </article>
          );
        })}
      </div>

        {loading && <p>Laster arenaer...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        {!loading && !error && ( <VenueList venues={filteredVenues} onSelectVenue={() => {}} /> )}
    </main>
  );
}

export default VenueOverviewPage;