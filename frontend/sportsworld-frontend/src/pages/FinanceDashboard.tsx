import { useEffect, useState } from "react";
import type { Finance } from "../types/Finance";
import type { Athlete } from "../types/Athletes";
import {
  getFinance,
  getAthletes,
  takeLoan,
  purchaseAthlete,
  resetData,
} from "../services/FinanceServices";

/**
 * FinanceDashboard Component
 * Displays financial overview, allows users to take loans and purchase athletes.
 * Fetches finance and athlete data on component mount.
 */
const FinanceDashboard: React.FC = () => {
  // State for finance data and UI
  const [finance, setFinance] = useState<Finance | null>(null);
  const [athletes, setAthletes] = useState<Athlete[]>([]);
  const [loanAmount, setLoanAmount] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  /**
   * Fetch finance and athletes data on component mount
   * Runs once when component loads
   */
  useEffect(() => {
    async function load() {
      try {
        // Fetch both finance and athlete data in parallel
        const [financeData, athletesData] = await Promise.all([
          getFinance(),
          getAthletes(),
        ]);
        setFinance(financeData);
        setAthletes(athletesData);
        setLoading(false);
      } catch (err) {
        const e = err as Error;
        setError(e.message);
        setLoading(false);
      }
    }

    load();
  }, []);

  /**
   * Handle loan request from the bank
   * Validates input and updates finance state on success
   */
  const handleLoan = async () => {
    setMessage(null);

    const amountNumber = Number(loanAmount);
    // Validate loan amount
    if (isNaN(amountNumber) || amountNumber <= 0) {
      setMessage("Amount must be a positive number.");
      return;
    }

    try {
      const updatedFinance = await takeLoan(amountNumber);
      setFinance(updatedFinance);
      setLoanAmount("");
      setMessage("Loan registered.");
    } catch (err) {
      const e = err as Error;
      setMessage(e.message);
    }
  };

  /**
   * Handle athlete purchase
   * Updates both finance and athlete list on success
   * @param athleteId - ID of the athlete to purchase
   */
  const handlePurchase = async (athleteId: number) => {
    setMessage(null);

    try {
      const result = await purchaseAthlete(athleteId);
      const { athlete: updatedAthlete, finance: updatedFinance } = result;

      // Update finance and mark athlete as purchased
      setFinance(updatedFinance);
      setAthletes((prev) =>
        prev.map((a) => (a.id === updatedAthlete.id ? updatedAthlete : a))
      );
      setMessage(`Purchased ${updatedAthlete.name}.`);
    } catch (err) {
      const e = err as Error;
      setMessage(e.message);
    }
  };

  // Reset backend data for testing (sets all athletes to available and resets finance)
  const handleReset = async () => {
    setMessage(null);
    try {
      const updatedFinance = await resetData();
      // Reload athletes and finance state
      const athletesData = await getAthletes();
      setAthletes(athletesData);
      setFinance(updatedFinance);
      setMessage("Data reset to default.");
    } catch (err) {
      const e = err as Error;
      setMessage(e.message);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="finance-loading">
        <p className="text-gray-500">Loading finance data...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="finance-error">
        <p className="finance-error-text">Error: {error}</p>
      </div>
    );
  }

  // No finance data state
  if (!finance) {
    return (
      <div className="finance-no-data">
        <p className="finance-warning">
          No finance row found. Create one via Swagger first.
        </p>
      </div>
    );
  }

  // Filter athletes that have NOT been purchased (available to buy)
  const availableAthletes = athletes.filter(
    (a) =>
      !a.purchaseStatus &&
      (searchTerm === "" || a.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Filter athletes that have been purchased
  const purchasedAthletes = athletes.filter((a) => a.purchaseStatus);

  return (
    <div className="finance-container">
      {/* Header – matches Athletes page visually */}
      <div className="finance-header-layout">
        <div>
          <h1 className="finance-header">
            Finance dashboard
          </h1>
          <p className="finance-subheader">
            Overview of coins, purchases and available athletes.
          </p>
        </div>
        <div className="finance-header-right">
          <p className="finance-coins-spent">
            Coins spent:{" "}
            <span className="finance-coins-spent-value">
              {finance.moneySpent}
            </span>
          </p>
          <p className="finance-coins-left">Coins left: {finance.moneyLeft}</p>
          <div className="finance-reset-margin">
            <button
              onClick={handleReset}
              className="finance-reset-button"
            >
              Reset data
            </button>
          </div>
        </div>
      </div>

      

      {message && (
        <div className="finance-message">
          {message}
        </div>
      )}

      {/* GRID 1: four info cards */}
      <section className="finance-grid-info">
        <div className="finance-info-card">
          <p className="finance-card-label">Coins left</p>
          <p className="finance-card-value-emerald">
            {finance.moneyLeft}
          </p>
        </div>
        <div className="finance-info-card">
          <p className="finance-card-label">Coins spent</p>
          <p className="finance-card-value-rose">
            {finance.moneySpent}
          </p>
        </div>
        <div className="finance-info-card">
          <p className="finance-card-label">Number of purchases</p>
          <p className="finance-card-value-gray">
            {finance.numberOfPurchases}
          </p>
        </div>
        <div className="finance-debt-card">
          <p className="finance-debt-label">Amount owed</p>
          <p className="finance-debt-value">
            {finance.amountBorrowed}
          </p>
        </div>
      </section>

      {/* GRID 2: loan and purchased athletes side by side */}
      <section className="finance-grid-main">
        {/* Loan-card */}
        <div className="finance-card">
          <div>
            <h2 className="finance-section-title finance-section-margin">
              Take loan
            </h2>
            <p className="finance-description">
              Add more coins from the bank to your balance.
            </p>
          </div>

          <div className="finance-form-spacing">
            <input
              type="number"
              value={loanAmount}
              onChange={(e) => setLoanAmount(e.target.value)}
              placeholder="Amount"
              className="finance-input"
            />
            <button
              onClick={handleLoan}
              className="finance-button-full"
            >
              Get coins from bank
            </button>
          </div>
        </div>

        {/* Athletes not purchased (available) */}
        <div className="finance-card">
          <div className="finance-section-header">
            <h2 className="finance-section-title">
              Athletes not purchased
            </h2>
            <p className="finance-count-text">
              Total available: {availableAthletes.length}
            </p>
          </div>

          {/* Search field */}
          <div className="finance-search-margin">
            <input
              type="text"
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="finance-input"
            />
          </div>

          {availableAthletes.length === 0 ? (
            <p className="finance-empty-text">No available athletes to purchase.</p>
          ) : (
            <ul className="finance-list-spacing">
              {availableAthletes.map((athlete) => (
                <li
                  key={athlete.id}
                  className="finance-list-item"
                >
                  <div>
                    <p className="finance-athlete-name">{athlete.name}</p>
                    <p className="finance-athlete-details">{athlete.gender} • {athlete.price} coins</p>
                  </div>
                  <button
                    onClick={() => handlePurchase(athlete.id)}
                    className="finance-button"
                  >
                    Buy
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* Purchased athletes section */}
      <section className="finance-purchased-margin">
        <div className="finance-card">
          <div className="finance-section-header">
            <h2 className="finance-section-title">
              Purchased athletes
            </h2>
            <p className="finance-count-text">
              Total: {purchasedAthletes.length}
            </p>
          </div>

          {purchasedAthletes.length === 0 ? (
            <p className="finance-empty-text">No athletes purchased yet.</p>
          ) : (
            <ul className="finance-list-spacing">
              {purchasedAthletes.map((athlete) => (
                <li
                  key={athlete.id}
                  className="finance-list-item"
                >
                  <div>
                    <p className="finance-athlete-name">{athlete.name}</p>
                    <p className="finance-athlete-details">{athlete.gender}</p>
                  </div>
                  <div className="finance-price-right">
                    <p className="finance-price-text">{athlete.price} coins</p>
                    <p className="finance-purchased-label">Purchased</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
};

export default FinanceDashboard;
