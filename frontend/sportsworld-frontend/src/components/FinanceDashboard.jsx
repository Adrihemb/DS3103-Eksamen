import { useEffect, useState } from "react";

function FinanceDashboard() {
  const [finance, setFinance] = useState(null);
  const [athletes, setAthletes] = useState([]);
  const [loanAmount, setLoanAmount] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionMessage, setActionMessage] = useState(null);

  async function fetchFinance() {
    const response = await fetch("http://localhost:5189/api/Finance");
    if (!response.ok) {
      throw new Error(`Could not load finance. Status: ${response.status}`);
    }
    const data = await response.json();
    setFinance(data);
  }

  async function fetchAthletes() {
    const response = await fetch("http://localhost:5189/api/Athlete");
    if (!response.ok) {
      throw new Error(`Could not load athletes. Status: ${response.status}`);
    }
    const data = await response.json();
    setAthletes(data);
  }

  useEffect(() => {
    async function load() {
      try {
        await Promise.all([fetchFinance(), fetchAthletes()]);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    }

    load();
  }, []);

  async function handleLoan() {
    setActionMessage(null);

    const amountNumber = Number(loanAmount);
    if (isNaN(amountNumber) || amountNumber <= 0) {
      setActionMessage("Beløpet må være et positivt tall.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5189/api/Finance/loan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: amountNumber }),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "Kunne ikke hente lån.");
      }

      const updatedFinance = await response.json();
      setFinance(updatedFinance);
      setLoanAmount("");
      setActionMessage("Lån registrert.");
    } catch (err) {
      setActionMessage(err.message);
    }
  }

  async function handlePurchase(athleteId) {
    setActionMessage(null);

    try {
      const response = await fetch(
        `http://localhost:5189/api/Athlete/${athleteId}/purchase`,
        {
          method: "POST",
        }
      );

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "Kunne ikke kjøpe atlet.");
      }

      const result = await response.json();
      const { athlete: updatedAthlete, finance: updatedFinance } = result;

      setFinance(updatedFinance);
      setAthletes((prev) =>
        prev.map((a) => (a.id === updatedAthlete.id ? updatedAthlete : a))
      );

      setActionMessage(`Kjøpte ${updatedAthlete.name}.`);
    } catch (err) {
      setActionMessage(err.message);
    }
  }

  if (loading) return <p>Laster finansdata...</p>;
  if (error) return <p style={{ color: "red" }}>Feil: {error}</p>;
  if (!finance) return <p>Ingen finance-data funnet. Opprett en rad først.</p>;

  const availableAthletes = athletes.filter((a) => !a.purchaseStatus);

  return (
    <div>
      <h2>Finansoversikt &amp; kjøp</h2>

      {actionMessage && <p>{actionMessage}</p>}

      <section>
        <h3>Finansiell situasjon</h3>
        <ul>
          <li>Penger igjen: {finance.moneyLeft}</li>
          <li>Antall kjøp: {finance.numberOfPurchases}</li>
          <li>Totalt brukt: {finance.moneySpent}</li>
        </ul>
      </section>

      <section>
        <h3>Ta opp lån</h3>
        <input
          type="number"
          value={loanAmount}
          onChange={(e) => setLoanAmount(e.target.value)}
          placeholder="Beløp"
        />
        <button onClick={handleLoan}>Få penger fra banken</button>
      </section>

      <section>
        <h3>Kjøp atleter</h3>
        {availableAthletes.length === 0 ? (
          <p>Ingen tilgjengelige atleter å kjøpe.</p>
        ) : (
          <ul>
            {availableAthletes.map((athlete) => (
              <li key={athlete.id}>
                <strong>{athlete.name}</strong> – {athlete.gender} –{" "}
                {athlete.price}{" "}
                <button onClick={() => handlePurchase(athlete.id)}>Kjøp</button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

export default FinanceDashboard;
