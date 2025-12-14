export interface IVenue {
  id: number;
  name: string;
  capacity: number;
  image?: string | null;
}

export interface IVenueInput {
  id?: number; 
  name: string;
  capacity: number;
  image?: string | null;
}