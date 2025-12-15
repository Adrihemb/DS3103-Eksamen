export interface IAthlete {
  id: number;
  name: string;
  gender: string;
  price: number;
  image?: string | null;
  purchaseStatus: boolean;
  position?: string;
  nationality?: string;
}

export interface IAthleteInput {
  id?: number;
  name: string;
  gender: string;
  price: number;
  image?: string | null;
  purchaseStatus: boolean;
  position?: string;
  nationality?: string;
}
