//Page for displaying an overview of all venues with search and sorting functionality
import { useEffect, useState } from "react";
import VenueList from "../components/VenueList";
import VenueService from "../services/VenueService";
import type { IVenue } from "../types/venueTypes";
import { IMAGE_URL } from "../global";

function VenueOverviewPage() {
  //State for storing venues, search input, sorting options, loading and error
  const [venues, setVenues] = useState<IVenue[]>([]);
  const [search, setSearch] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'name' | 'capacity'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  //Fetch all venues from backend when page loads
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

  //useEffect runs loadVenues when component mounts
  useEffect(() => {
     void loadVenues();
  }, []);

  //Filter and sort venues based on search input and sort options
  const sortedAndFilteredVenues = venues
    .filter((venue) => venue.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'name') {
        return sortOrder === 'asc'
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      } else {
        return sortOrder === 'asc'
          ? a.capacity - b.capacity
          : b.capacity - a.capacity;
      }
    });

  return (
    <main className="p-4">
      <h1 className="mb-4 text-2xl font-bold">Arenaer</h1>

      {/*Search input field*/}
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

      {/*Sorting controls*/}
      <div className="mb-4 flex gap-4">
        <div>
          <label htmlFor="sortBy" className="mr-2">Sorter etter:</label>
          <select
            id="sortBy"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'name' | 'capacity')}
            className="border p-2 rounded"
          >
            <option value="name">Navn</option>
            <option value="capacity">Kapasitet</option>
          </select>
        </div>

        <div>
          <label htmlFor="sortOrder" className="mr-2">Rekkefølge:</label>
          <select
            id="sortOrder"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
            className="border p-2 rounded"
          >
            <option value="asc">Stigende</option>
            <option value="desc">Synkende</option>
          </select>
        </div>
      </div>

      {/*Responsive grid showing venue cards*/}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedAndFilteredVenues.map((venue) => {
          //Build image URL if a venue has an image
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

      {/* Shows loading/error/no results messages */}
      {loading && <p>Laster arenaer...</p>}
      {error && <p className="text-red-600">{error}</p>}  

      {!loading && !error && sortedAndFilteredVenues.length === 0 && (
        <p>Ingen arenaer funnet.</p>
      )}
    </main>
  );
}

export default VenueOverviewPage;