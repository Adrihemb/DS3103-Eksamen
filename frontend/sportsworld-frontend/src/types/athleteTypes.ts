/**
 * IAthlete - Interface for displaying athlete data
 * Represents a complete athlete object retrieved from the backend
 */
export interface IAthlete {
  id: number; // Unique identifier for the athlete
  name: string; // Athlete's full name
  gender: string; // Athlete's gender
  price: number; // Price/value of the athlete
  image?: string | null; // Optional URL to athlete's image
  purchaseStatus: boolean; // Whether the athlete has been purchased
  position?: string; // Optional sports position (e.g., "Forward", "Goalkeeper")
  nationality?: string; // Optional athlete's nationality
}

/**
 * IAthleteInput - Interface for creating/updating athlete data
 * Used when sending athlete data to the backend
 */
export interface IAthleteInput {
  id?: number; // Optional ID (undefined when creating, required when updating)
  name: string; // Athlete's full name
  gender: string; // Athlete's gender
  price: number; // Price/value of the athlete
  image?: string | null; // Optional URL to athlete's image
  purchaseStatus: boolean; // Whether the athlete has been purchased
  position?: string; // Optional sports position (e.g., "Forward", "Goalkeeper")
  nationality?: string; // Optional athlete's nationality
}
