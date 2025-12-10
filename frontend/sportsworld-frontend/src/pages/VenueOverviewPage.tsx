import { useEffect, useState } from "react";
import VenueList from "../components/VenueList";
import VenueService from "../services/VenueService";
import type { IVenue } from "../types/venueTypes";
import { IMAGE_URL } from "../global";

function VenueOverviewPage() {
  const [venues, setVenues] = useState<IVenue[]>([]);
  const [search, setSearch] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  async function loadVenues(): Promise<void> {
    try {
      setLoading(true);
      setError(null);

      const data = await VenueService.getAll();
      setVenues(data);
    } catch (err) {
      console.error("Noe gikk galt ved henting av arenaer.", err);
      setError("Kunne ikke hente arenaer.");
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
    <main className="p-4">
      <h1 className="mb-4 text-2xl font-bold">Arenaer</h1>

      <div className="mb-4">
        <label htmlFor="venueSearch" className="mb-2">
          Søk etter arena: 
        </label>
        <input
          id="venueSearch"
          type="text"
          placeholder="Søk etter arenaer..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded w-full"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredVenues.map((venue) => {
          const imageUrl = venue.image
            ? `${IMAGE_URL}/venues/${venue.image}`
            : undefined;

          return (
            <article key={venue.id} className="border rounded p-4 flex flex-col">
              {imageUrl && (
                <img
                  src={imageUrl}
                  alt={`Bilde av ${venue.name}`}
                  className="w-full rounded mb-2"
                />
              )}
              <div className="mt-auto">
                <h3 className="mb-2 text-lg font-bold">{venue.name}</h3>
                <p className="text-base">Kapasitet: {venue.capacity.toLocaleString()}</p>
              </div>
            </article>
          );
        })}
      </div>

      {loading && <p>Laster arenaer...</p>}
      {error && <p className="text-red-600">{error}</p>}  

      {!loading && !error && filteredVenues.length === 0 && (
        <p>Ingen arenaer funnet.</p>
      )}
    </main>
  );
}

export default VenueOverviewPage;