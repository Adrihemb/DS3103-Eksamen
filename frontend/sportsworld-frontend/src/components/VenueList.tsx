import type { IVenue } from "../types/venueTypes";

interface VenueListProps {
  venues: IVenue[];
  onSelectVenue: (venue: IVenue) => void;
}

function VenueList({ venues, onSelectVenue }: VenueListProps) {
  if (venues.length === 0) {
    return <p role="status" aria-live="polite">Ingen arenaer funnet.</p>;
  }

  return (
    <section className="venue-list" aria-labelledby="venue-list-heading">
      <h2 id="venue-list-heading">Arenaer</h2>
      <ul role="list">
        {venues.map((venue) => (
          <li key={venue.id}>
            <button 
              type="button" 
              onClick={() => onSelectVenue(venue)}
              aria-label={`Velg ${venue.name}, kapasitet ${venue.capacity.toLocaleString()} personer`}
              className="focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <strong>{venue.name}</strong> – Kapasitet: {venue.capacity.toLocaleString()}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default VenueList;
