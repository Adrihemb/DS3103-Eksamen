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
      <div className="px-6 py-8">
        <p className="text-gray-500">Loading finance data...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="px-6 py-8">
        <p className="text-red-600 font-semibold">Error: {error}</p>
      </div>
    );
  }

  // No finance data state
  if (!finance) {
    return (
      <div className="px-6 py-8">
        <p className="rounded-md border border-yellow-300 bg-yellow-50 px-4 py-3 text-sm text-yellow-800">
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
    <div className="px-6 py-8 max-w-6xl mx-auto">
      {/* Header – matcher Athletes-siden visuelt */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Finance dashboard
          </h1>
          <p className="text-sm text-gray-500">
            Overview of coins, purchases and available athletes.
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-gray-700">
            Coins spent:{" "}
            <span className="font-semibold text-purple-600">
              {finance.moneySpent}
            </span>
          </p>
          <p className="text-xs text-gray-400">Coins left: {finance.moneyLeft}</p>
          <div className="mt-2">
            <button
              onClick={handleReset}
              className="text-xs px-2 py-1 bg-red-50 text-red-700 border border-red-100 rounded-md hover:bg-red-100"
            >
              Reset data
            </button>
          </div>
        </div>
      </div>

      

      {message && (
        <div className="mb-4 rounded-md border border-blue-200 bg-blue-50 px-4 py-2 text-sm text-blue-800">
          {message}
        </div>
      )}

      {/* GRID 1: fire info-kort */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Coins left</p>
          <p className="mt-2 text-3xl font-semibold text-emerald-600">
            {finance.moneyLeft}
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Coins spent</p>
          <p className="mt-2 text-3xl font-semibold text-rose-500">
            {finance.moneySpent}
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Number of purchases</p>
          <p className="mt-2 text-3xl font-semibold text-gray-800">
            {finance.numberOfPurchases}
          </p>
        </div>
        <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-5 shadow-sm">
          <p className="text-sm text-yellow-700 font-medium">Amount owed</p>
          <p className="mt-2 text-3xl font-semibold text-yellow-600">
            {finance.amountBorrowed}
          </p>
        </div>
      </section>

      {/* GRID 2: lån og kjøpte spillere side om side */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Loan-card */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-1">
              Take loan
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              Add more coins from the bank to your balance.
            </p>
          </div>

          <div className="space-y-2">
            <input
              type="number"
              value={loanAmount}
              onChange={(e) => setLoanAmount(e.target.value)}
              placeholder="Amount"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <button
              onClick={handleLoan}
              className="w-full inline-flex items-center justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700 active:bg-blue-800"
            >
              Get coins from bank
            </button>
          </div>
        </div>

        {/* Athletes not purchased (available) */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Athletes not purchased
            </h2>
            <p className="text-xs text-gray-400">
              Total available: {availableAthletes.length}
            </p>
          </div>

          {/* Search field */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Søk på navn..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {availableAthletes.length === 0 ? (
            <p className="text-sm text-gray-500">No available athletes to purchase.</p>
          ) : (
            <ul className="space-y-3">
              {availableAthletes.map((athlete) => (
                <li
                  key={athlete.id}
                  className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 px-4 py-3"
                >
                  <div>
                    <p className="font-medium text-gray-900">{athlete.name}</p>
                    <p className="text-sm text-gray-500">{athlete.gender} • {athlete.price} coins</p>
                  </div>
                  <button
                    onClick={() => handlePurchase(athlete.id)}
                    className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 active:bg-blue-800"
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
      <section className="mt-8">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Purchased athletes
            </h2>
            <p className="text-xs text-gray-400">
              Total: {purchasedAthletes.length}
            </p>
          </div>

          {purchasedAthletes.length === 0 ? (
            <p className="text-sm text-gray-500">No athletes purchased yet.</p>
          ) : (
            <ul className="space-y-3">
              {purchasedAthletes.map((athlete) => (
                <li
                  key={athlete.id}
                  className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 px-4 py-3"
                >
                  <div>
                    <p className="font-medium text-gray-900">{athlete.name}</p>
                    <p className="text-sm text-gray-500">{athlete.gender}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{athlete.price} coins</p>
                    <p className="text-xs text-gray-400">Purchased</p>
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
