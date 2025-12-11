export interface IAthlete {
  id: number;
  name: string;
  gender: string;
  price: number;
  image?: string | null;
  purchaseStatus: boolean;
}

export interface IAthleteInput {
  id?: number;
  name: string;
  gender: string;
  price: number;
  image?: string | null;
  purchaseStatus: boolean;
}
