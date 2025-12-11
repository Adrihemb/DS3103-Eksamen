/**
 * Athlete Interface
 * Represents a professional athlete available for purchase
 * Contains details about the athlete and their purchase status
 */
export interface Athlete {
  id: number;
  /** Full name of the athlete */
  name: string;
  /** Gender of the athlete */
  gender: string;
  /** Cost in coins to purchase this athlete */
  price: number;
  /** URL or path to the athlete's image */
  image: string;
  /** Indicates if this athlete has been purchased (true = purchased, false = available) */
  purchaseStatus: boolean;
}