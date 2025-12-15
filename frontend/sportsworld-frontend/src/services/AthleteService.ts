import axios, { AxiosResponse } from "axios";
import type { IAthlete, IAthleteInput } from "../types/athleteTypes";
import { BASE_URL } from "../global";

// API endpoint for athlete operations
const ATHLETE_URL = `${BASE_URL}/Athlete`;

/**
 * AthleteService - Service for handling all athlete-related API calls
 * Provides CRUD operations for athlete management
 */
const AthleteService = {
  /**
   * Fetch all athletes from the backend
   * @returns Promise containing array of all athletes
   */
  async getAll(): Promise<IAthlete[]> {
    const response: AxiosResponse<IAthlete[]> = await axios.get(ATHLETE_URL);
    return response.data;
  },

  /**
   * Fetch a single athlete by ID
   * @param id - The athlete ID to fetch
   * @returns Promise containing the requested athlete
   */
  async getById(id: number): Promise<IAthlete> {
    const response: AxiosResponse<IAthlete> = await axios.get(`${ATHLETE_URL}/${id}`);
    return response.data;
  },

  /**
   * Create a new athlete
   * @param athlete - The athlete data to create
   * @returns Promise containing the created athlete with assigned ID
   */
  async create(athlete: IAthleteInput): Promise<IAthlete> {
    const response: AxiosResponse<IAthlete> = await axios.post(ATHLETE_URL, athlete);
    return response.data;
  },

  /**
   * Update an existing athlete
   * @param athlete - The athlete data to update (must include ID)
   * @throws Error if athlete ID is missing
   */
  async update(athlete: IAthleteInput): Promise<void> {
    if (!athlete.id) {
      throw new Error("Mangler ID for athlete ved oppdatering.");
    }
    await axios.put(`${ATHLETE_URL}/${athlete.id}`, athlete);
  },

  /**
   * Delete an athlete by ID
   * @param id - The athlete ID to delete
   */
  async remove(id: number): Promise<void> {
    await axios.delete(`${ATHLETE_URL}/${id}`);
    console.log(`Athlete with id ${id} deleted successfully.`);
  },
};

export default AthleteService;
