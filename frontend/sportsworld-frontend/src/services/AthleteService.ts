import axios, { AxiosResponse } from "axios";
import type { IAthlete, IAthleteInput } from "../types/athleteTypes";

const BASE_URL = "http://localhost:5189/api/Athlete";

const AthleteService = {
  // Get all athletes
  async getAll(): Promise<IAthlete[]> {
    const response: AxiosResponse<IAthlete[]> = await axios.get(`${BASE_URL}`);
    return response.data;
  },

  // Get an athlete by ID
  async getById(id: number): Promise<IAthlete> {
    const response: AxiosResponse<IAthlete> = await axios.get(`${BASE_URL}/${id}`);
    return response.data;
  },

  // Add a new athlete
  async create(athlete: IAthleteInput): Promise<IAthlete> {
    const response: AxiosResponse<IAthlete> = await axios.post(`${BASE_URL}`, athlete);
    return response.data;
  },

  // Update an existing athlete
  async update(athlete: IAthleteInput): Promise<void> {
    if (!athlete.id) {
      throw new Error("Mangler ID for athlete ved oppdatering.");
    }
    await axios.put(`${BASE_URL}/${athlete.id}`, athlete);
  },

  // Delete an athlete by ID
  async remove(id: number): Promise<void> {
    await axios.delete(`${BASE_URL}/${id}`);
    console.log(`Athlete with id ${id} deleted successfully.`);
  },
};

export default AthleteService;
