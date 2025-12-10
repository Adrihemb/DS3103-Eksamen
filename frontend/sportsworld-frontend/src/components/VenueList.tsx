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
    <div className="venue-list">
      <h2>Arenaer</h2>
      <ul>
        {venues.map((venue) => (
          <li key={venue.id}>
            <button type="button" onClick={() => onSelectVenue(venue)}>
              <strong>{venue.name}</strong> – Kapasitet: {venue.capacity.toLocaleString()}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default VenueList;
