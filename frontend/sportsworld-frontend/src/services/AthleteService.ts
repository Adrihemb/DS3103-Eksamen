import axios, { AxiosResponse } from "axios";
import type { IAthlete, IAthleteInput } from "../types/athleteTypes";
import { BASE_URL } from "../global";

const ATHLETE_URL = `${BASE_URL}/Athlete`;

const AthleteService = {
  async getAll(): Promise<IAthlete[]> {
    const response: AxiosResponse<IAthlete[]> = await axios.get(ATHLETE_URL);
    return response.data;
  },

  async getById(id: number): Promise<IAthlete> {
    const response: AxiosResponse<IAthlete> = await axios.get(`${ATHLETE_URL}/${id}`);
    return response.data;
  },

  async create(athlete: IAthleteInput): Promise<IAthlete> {
    const response: AxiosResponse<IAthlete> = await axios.post(ATHLETE_URL, athlete);
    return response.data;
  },

  async update(athlete: IAthleteInput): Promise<void> {
    if (!athlete.id) {
      throw new Error("Mangler ID for athlete ved oppdatering.");
    }
    await axios.put(`${ATHLETE_URL}/${athlete.id}`, athlete);
  },

  async remove(id: number): Promise<void> {
    await axios.delete(`${ATHLETE_URL}/${id}`);
    console.log(`Athlete with id ${id} deleted successfully.`);
  },
};

export default AthleteService;
