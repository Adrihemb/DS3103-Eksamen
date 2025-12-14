//TypeScript interfaces for a complete venue object from the database
export interface IVenue {
  id: number;
  name: string;
  capacity: number;
  image?: string | null;
}

//TypeScript interface for creating or updating a venue (object may lack an id)
export interface IVenueInput {
  id?: number; 
  name: string;
  capacity: number;
  image?: string | null;
}