import { useEffect, useState } from 'react';

const API_BASE_URL = 'http://localhost:5189';

function AthleteList() {
  const [athletes, setAthletes] = useState([]);
  const [finance, setFinance] = useState(null);  // NEW
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  const loadAthletes = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await fetch(`${API_BASE_URL}/api/Athlete`);
      if (!response.ok) throw new Error(`Feil fra API: ${response.status}`);
      const data = await response.json();
      setAthletes(data);
    } catch (err) {
      console.error(err);
      setError('Kunne ikke hente idrettsutøvere.');
    } finally {
      setLoading(false);
    }
  };

  // NEW: Load finance
  const loadFinance = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/Finance`);
      if (!response.ok) throw new Error(`Feil fra API: ${response.status}`);
      const data = await response.json();
      setFinance(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadAthletes();
    loadFinance();  // NEW
  }, []);

  const handleBuy = async (athlete) => {
    if (athlete.purchaseStatus) return;
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/Athlete/${athlete.id}/purchase`,
        { method: 'POST' }
      );
      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || 'Feil ved kjøp av idrettsutøver.');
      }
      await loadAthletes();
      await loadFinance();  // NEW: Refresh finance after purchase
    } catch (err) {
      console.error(err);
      alert('Kunne ikke kjøpe idrettsutøver.');
    }
  };

  const filteredAthletes = athletes.filter((athlete) => {
    if (searchTerm && !athlete.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    if (filter === 'available' && athlete.purchaseStatus) return false;
    if (filter === 'purchased' && !athlete.purchaseStatus) return false;
    return true;
  });

  const totalCoinsSpent = athletes
    .filter((a) => a.purchaseStatus)
    .reduce((sum, a) => sum + a.price, 0);

  if (loading) return <p>Laster idrettsutøvere...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div style={{ marginTop: '1.5rem' }}>
      {/* NEW: Finance info bar */}
      {finance && (
        <div style={{
          display: 'flex',
          gap: '2rem',
          marginBottom: '1.5rem',
          padding: '1rem',
          backgroundColor: '#f0f0f0',
          borderRadius: '8px',
          fontWeight: 'bold',
        }}>
          <div>Coins left: <span style={{ color: '#28a745' }}>{finance.moneyLeft}</span></div>
          <div>Coins spent: <span style={{ color: '#dc3545' }}>{finance.moneySpent}</span></div>
          <div>Purchases: <span style={{ color: '#007bff' }}>{finance.numberOfPurchases}</span></div>
          <div>Amount owed: <span style={{ color: '#ffc107' }}>{finance.amountBorrowed}</span></div>
        </div>
      )}

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Søk på navn..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ padding: '0.5rem', minWidth: '200px' }}
        />
        <select value={filter} onChange={(e) => setFilter(e.target.value)} style={{ padding: '0.5rem' }}>
          <option value="all">Alle</option>
          <option value="available">Kun tilgjengelige</option>
          <option value="purchased">Kun kjøpte</option>
        </select>
        <div style={{ marginLeft: 'auto', fontWeight: 'bold' }}>
          Coins brukt (lokal sum): {totalCoinsSpent}
        </div>
      </div>

      {filteredAthletes.length === 0 ? (
        <p>Fant ingen idrettsutøvere.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {filteredAthletes.map((athlete) => (
            <li key={athlete.id} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '1rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              {athlete.image && (
                <img src={athlete.image} alt={athlete.name} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '50%' }} />
              )}
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 'bold' }}>{athlete.name}</div>
                <div>{athlete.gender} – {athlete.price} coins</div>
                <div>Status: {athlete.purchaseStatus ? 'Kjøpt' : 'Tilgjengelig'}</div>
              </div>
              <button onClick={() => handleBuy(athlete)} disabled={athlete.purchaseStatus} style={{
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                border: 'none',
                cursor: athlete.purchaseStatus ? 'not-allowed' : 'pointer',
                backgroundColor: athlete.purchaseStatus ? '#aaa' : '#007bff',
                color: 'white',
                fontWeight: 600,
              }}>
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