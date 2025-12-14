import axios, { AxiosError } from "axios";
import { Finance } from "../types/Finance";
import { Athlete } from "../types/Athletes";

/**
 * FinanceServices Module (Axios)
 * Handles all API calls related to finance and athlete purchases
 */

// Base URL for backend API
export const API_BASE = "http://localhost:5189/api";

const api = axios.create({ baseURL: API_BASE, headers: { "Content-Type": "application/json" } });

function handleAxiosError(err: unknown): never {
  if (axios.isAxiosError(err)) {
    const aerr = err as AxiosError;
    const data = aerr.response?.data;
    const message = typeof data === "string" ? data : aerr.message;
    throw new Error(message as string);
  }
  throw err as Error;
}

export async function getFinance(): Promise<Finance> {
  try {
    const res = await api.get<Finance>("/Finance");
    return res.data;
  } catch (err) {
    handleAxiosError(err);
  }
}

export async function getAthletes(): Promise<Athlete[]> {
  try {
    const res = await api.get<Athlete[]>("/Athlete");
    return res.data;
  } catch (err) {
    handleAxiosError(err);
  }
}

export async function takeLoan(amount: number): Promise<Finance> {
  try {
    const res = await api.post<Finance>("/Finance/loan", { amount });
    return res.data;
  } catch (err) {
    handleAxiosError(err);
  }
}

export async function purchaseAthlete(
  athleteId: number
): Promise<{ athlete: Athlete; finance: Finance }> {
  try {
    const res = await api.post<{ athlete: Athlete; finance: Finance }>(`/Athlete/${athleteId}/purchase`);
    return res.data;
  } catch (err) {
    handleAxiosError(err);
  }
}

export async function resetData(): Promise<Finance> {
  try {
    const res = await api.post<Finance>("/Reset");
    return res.data;
  } catch (err) {
    handleAxiosError(err);
  }
}
