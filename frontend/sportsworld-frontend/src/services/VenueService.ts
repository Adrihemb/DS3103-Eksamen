import axios, { AxiosResponse } from "axios";
import type { IVenue, IVenueInput } from "../types/venueTypes";
import { BASE_URL } from "../global";

const VENUE_URL = `${BASE_URL}/Venue`;

const VenueService = {
  // Get all venues
  async getAll(): Promise<IVenue[]> {
    const response: AxiosResponse<IVenue[]> = await axios.get(VENUE_URL);
    return response.data;
  },

  // Get a venue by ID
  async getById(id: number): Promise<IVenue> {
    const response: AxiosResponse<IVenue> = await axios.get(`${VENUE_URL}/${id}`);
    return response.data;
  },

  // Add a new venue
  async create(venue: IVenueInput): Promise<IVenue> {
    const response: AxiosResponse<IVenue> = await axios.post(VENUE_URL, venue);
    return response.data;
  },

  // Update an existing venue
  async update(venue: IVenueInput): Promise<void> {
    if (!venue.id) {
      throw new Error("Mangler ID for venue ved oppdatering.");
    }
    await axios.put(`${VENUE_URL}/${venue.id}`, venue);
  },

  // Delete a venue by ID
  async remove(id: number): Promise<void> {
    await axios.delete(`${VENUE_URL}/${id}`);
    console.log(`Venue with id ${id} deleted successfully.`);
  },
};

export default VenueService;
