import type { IAthlete } from "../types/athleteTypes";

interface AthleteListProps {
  athletes: IAthlete[];
  onSelectAthlete: (athlete: IAthlete) => void;
}

function AthleteList({ athletes, onSelectAthlete }: AthleteListProps) {
  if (athletes.length === 0) {
    return <p>Ingen idrettsutøvere funnet.</p>;
  }

  return (
    <div className="p-4 border rounded">
      <h2 className="mb-4 font-bold">Athletes</h2>
      <ul>
        {athletes.map((athlete) => (
          <li key={athlete.id} className="mb-2">
            <button type="button" onClick={() => onSelectAthlete(athlete)} className="border p-2 rounded w-full text-left">
              <strong>{athlete.name}</strong> – {athlete.gender} – {athlete.price} coins
              {athlete.position && <p className="text-sm text-gray-600">Posisjon: {athlete.position}</p>}
              {athlete.nationality && <p className="text-sm text-gray-600">Nasjonalitet: {athlete.nationality}</p>}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AthleteList;
