import type { IAthlete } from "../types/athleteTypes";

/**
 * Props for AthleteList component
 */
interface AthleteListProps {
  athletes: IAthlete[]; // List of athletes to display
  onSelectAthlete: (athlete: IAthlete) => void; // Callback when athlete is selected
}

/**
 * AthleteList - Displays a selectable list of athletes
 * 
 * Used in the admin page to allow selecting an athlete for editing
 * Shows athlete name, gender, price, position, and nationality
 */
function AthleteList({ athletes, onSelectAthlete }: AthleteListProps) {
  // Show message if no athletes available
  if (athletes.length === 0) {
    return <p>No athletes found.</p>;
  }

  return (
    <div className="p-4 border rounded">
      <h2 className="mb-4 font-bold">Athletes</h2>
      <ul>
        {/* Map each athlete to a clickable button */}
        {athletes.map((athlete) => (
          <li key={athlete.id} className="mb-2">
            {/* Clickable button to select athlete for editing */}
            <button type="button" onClick={() => onSelectAthlete(athlete)} className="border p-2 rounded w-full text-left">
              {/* Athlete name, gender, and price */}
              <strong>{athlete.name}</strong> – {athlete.gender} – {athlete.price} coins
              {/* Display position if available */}
              {athlete.position && <p className="text-sm text-gray-600">Position: {athlete.position}</p>}
              {/* Display nationality if available */}
              {athlete.nationality && <p className="text-sm text-gray-600">Nationality: {athlete.nationality}</p>}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AthleteList;
