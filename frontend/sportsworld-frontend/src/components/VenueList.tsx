import type { IVenue } from "../types/venueTypes";

interface VenueListProps {
  venues: IVenue[];
  onSelectVenue: (venue: IVenue) => void;
}

function VenueList({ venues, onSelectVenue }: VenueListProps) {
  if (venues.length === 0) {
    return <p>Ingen arenaer funnet.</p>;
  }

  return (
    <div className="p-4 border rounded">
      <h2 className="mb-4 font-bold">Arenaer</h2>
      <ul>
        {venues.map((venue) => (
          <li key={venue.id} className="mb-2">
            <button type="button" onClick={() => onSelectVenue(venue)} className="border p-2 rounded w-full">
              <strong>{venue.name}</strong> – Kapasitet: {venue.capacity.toLocaleString()}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default VenueList;
