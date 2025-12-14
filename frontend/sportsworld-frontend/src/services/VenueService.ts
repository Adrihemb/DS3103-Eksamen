//Service for handling all API calls related to venues
import axios, { AxiosResponse } from "axios";
import type { IVenue, IVenueInput } from "../types/venueTypes";
import { BASE_URL } from "../global";

//Complete URL to the venue controller in backend
const VENUE_URL = `${BASE_URL}/Venue`;

const VenueService = {
  //Fetch all venues from database
  async getAll(): Promise<IVenue[]> {
    const response: AxiosResponse<IVenue[]> = await axios.get(VENUE_URL);
    return response.data;
  },

  //Fetch a single venue by ID
  async getById(id: number): Promise<IVenue> {
    const response: AxiosResponse<IVenue> = await axios.get(`${VENUE_URL}/${id}`);
    return response.data;
  },

  //Creates a new venue in the database
  async create(venue: IVenueInput): Promise<IVenue> {
    const response: AxiosResponse<IVenue> = await axios.post(VENUE_URL, venue);
    return response.data;
  },

  //Updates an existing venue
  async update(venue: IVenueInput): Promise<void> {
    //Ensure the venue has an ID before updating
    if (!venue.id) {
      throw new Error("Mangler ID for venue ved oppdatering.");
    }
    await axios.put(`${VENUE_URL}/${venue.id}`, venue);
  },

  //Deletes a venue by ID from database
  async remove(id: number): Promise<void> {
    await axios.delete(`${VENUE_URL}/${id}`);
    console.log(`Venue with id ${id} deleted successfully.`);
  },
};

export default VenueService;
