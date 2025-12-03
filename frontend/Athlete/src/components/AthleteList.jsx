import { useEffect, useState } from 'react';

const API_BASE_URL = 'http://localhost:5189';

function AthleteList() {
  const [athletes, setAthletes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all'); // all | available | purchased

  // Hent alle idrettsutøvere fra API-et
  const loadAthletes = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch(`${API_BASE_URL}/api/Athlete`);

      if (!response.ok) {
        throw new Error(`Feil fra API: ${response.status}`);
      }

      const data = await response.json();
      setAthletes(data);
    } catch (err) {
      console.error(err);
      setError('Kunne ikke hente idrettsutøvere.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAthletes();
  }, []);

  // Kjøp en idrettsutøver (setter purchaseStatus = true med PUT)
  const handleBuy = async (athlete) => {
    if (athlete.purchaseStatus) return; // allerede kjøpt

    const updatedAthlete = { ...athlete, purchaseStatus: true };

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/Athlete/${athlete.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedAthlete),
        }
      );

      if (!response.ok) {
        throw new Error('Feil ved oppdatering av idrettsutøver.');
      }

      // Oppdater state lokalt
      setAthletes((prev) =>
        prev.map((a) => (a.id === athlete.id ? updatedAthlete : a))
      );
    } catch (err) {
      console.error(err);
      alert('Kunne ikke kjøpe idrettsutøver.');
    }
  };

  // Filtrering og søk i minnet
  const filteredAthletes = athletes.filter((athlete) => {
    if (
      searchTerm &&
      !athlete.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }

    if (filter === 'available' && athlete.purchaseStatus) {
      return false;
    }

    if (filter === 'purchased' && !athlete.purchaseStatus) {
      return false;
    }

    return true;
  });

  // Summer coins brukt på kjøpte utøvere
  const totalCoinsSpent = athletes
    .filter((a) => a.purchaseStatus)
    .reduce((sum, a) => sum + a.price, 0);

  if (loading) {
    return <p>Laster idrettsutøvere...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  return (
    <div style={{ marginTop: '1.5rem' }}>
      {/* Kontrollpanel */}
      <div
        style={{
          display: 'flex',
          gap: '1rem',
          marginBottom: '1rem',
          flexWrap: 'wrap',
        }}
      >
        <input
          type="text"
          placeholder="Søk på navn..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ padding: '0.5rem', minWidth: '200px' }}
        />

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{ padding: '0.5rem' }}
        >
          <option value="all">Alle</option>
          <option value="available">Kun tilgjengelige</option>
          <option value="purchased">Kun kjøpte</option>
        </select>

        <div style={{ marginLeft: 'auto', fontWeight: 'bold' }}>
          Coins brukt: {totalCoinsSpent}
        </div>
      </div>

      {/* Liste med idrettsutøvere */}
      {filteredAthletes.length === 0 ? (
        <p>Fant ingen idrettsutøvere.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {filteredAthletes.map((athlete) => (
            <li
              key={athlete.id}
              style={{
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '1rem',
                marginBottom: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
              }}
            >
              {athlete.image && (
                <img
                  src={athlete.image}
                  alt={athlete.name}
                  style={{
                    width: '80px',
                    height: '80px',
                    objectFit: 'cover',
                    borderRadius: '50%',
                  }}
                />
              )}

              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 'bold' }}>{athlete.name}</div>
                <div>
                  {athlete.gender} – {athlete.price} coins
                </div>
                <div>
                  Status:{' '}
                  {athlete.purchaseStatus ? 'Kjøpt' : 'Tilgjengelig'}
                </div>
              </div>

              <button
                onClick={() => handleBuy(athlete)}
                disabled={athlete.purchaseStatus}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '6px',
                  border: 'none',
                  cursor: athlete.purchaseStatus ? 'not-allowed' : 'pointer',
                  backgroundColor: athlete.purchaseStatus ? '#aaa' : '#007bff',
                  color: 'white',
                  fontWeight: 600,
                }}
              >
                {athlete.purchaseStatus ? 'Allerede kjøpt' : 'Kjøp'}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default AthleteList;
