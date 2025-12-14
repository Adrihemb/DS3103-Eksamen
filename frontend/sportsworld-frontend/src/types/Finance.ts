/**
 * Finance Interface
 * Represents the financial state of a department
 * Contains information about available coins, purchases made, spending, and debt
 */
export interface Finance {
  id: number;
  /** Department name (e.g., "Men's Team", "Women's Team") */
  department: string;
  /** Amount of coins currently available */
  moneyLeft: number;
  /** Number of athletes purchased */
  numberOfPurchases: number;
  /** Total amount of coins spent on purchases */
  moneySpent: number;
  /** Amount of money borrowed from the bank (debt) */
  amountBorrowed: number;
}