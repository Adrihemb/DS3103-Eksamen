import type { IAthlete } from "../types/athleteTypes";
import { IMAGE_URL } from "../global";

interface AthleteListProps {
  athletes: IAthlete[];
  onSelectAthlete: (athlete: IAthlete) => void;
}

function AthleteList({ athletes, onSelectAthlete }: AthleteListProps) {
  if (athletes.length === 0) {
    return <p>Ingen idrettsutøvere funnet.</p>;
  }

  return (
    <div className="athlete-list">
      <h2>Idrettsutøvere</h2>
      <ul>
        {athletes.map((athlete) => (
          <li key={athlete.id}>
            <button type="button" onClick={() => onSelectAthlete(athlete)}>
              {athlete.image && (
                <img
                  src={`${IMAGE_URL}/athletes/${athlete.image}`}
                  alt={athlete.name}
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    marginRight: "0.5rem",
                    objectFit: "cover",
                  }}
                />
              )}
              <strong>{athlete.name}</strong> – {athlete.gender} – {athlete.price} coins
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AthleteList;
