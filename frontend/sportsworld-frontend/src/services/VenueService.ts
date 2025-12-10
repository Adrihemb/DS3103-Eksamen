import axios, { AxiosResponse } from "axios";
import type { IVenue, IVenueInput } from "../types/venueTypes";

const BASE_URL = "http://localhost:5189/api/Venue";

const VenueService = {
  // Get all venues
  async getAll(): Promise<IVenue[]> {
    const response: AxiosResponse<IVenue[]> = await axios.get(`${BASE_URL}`);
    return response.data;
  },

  // Get a venue by ID
  async getById(id: number): Promise<IVenue> {
    const response: AxiosResponse<IVenue> = await axios.get(`${BASE_URL}/${id}`);
    return response.data;
  },

  // Add a new venue
  async create(venue: IVenueInput): Promise<IVenue> {
    const response: AxiosResponse<IVenue> = await axios.post(`${BASE_URL}`, venue);
    return response.data;
  },

  // Update an existing venue
  async update(venue: IVenueInput): Promise<void> {
    if (!venue.id) {
      throw new Error("Mangler ID for venue ved oppdatering.");
    }
    await axios.put(`${BASE_URL}/${venue.id}`, venue);
  },

  // Delete a venue by ID
  async remove(id: number): Promise<void> {
    await axios.delete(`${BASE_URL}/${id}`);
    console.log(`Venue with id ${id} deleted successfully.`);
  },
};

export default VenueService;
