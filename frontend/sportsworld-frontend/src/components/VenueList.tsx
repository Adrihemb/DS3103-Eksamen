//Component displaying a list of venues with click handlers for selection
import type { IVenue } from "../types/venueTypes";

interface VenueListProps {
  venues: IVenue[];
  onSelectVenue: (venue: IVenue) => void;
}

function VenueList({ venues, onSelectVenue }: VenueListProps) {
  //Shows message if no venues are available
  if (venues.length === 0) {
    return <p>Ingen arenaer funnet.</p>;
  }

  return (
    <div className="p-4 border rounded">
      <h2 className="mb-4 font-bold">Arenaer</h2>
      <ul>
        {/*Map through venues and create a button for each*/}
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
