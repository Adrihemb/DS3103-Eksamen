import { createContext, useContext, useState, useCallback, useEffect } from "react";
import type { IAthlete } from "../types/athleteTypes";
import AthleteService from "../services/AthleteService";

interface AthletesContextType {
  athletes: IAthlete[];
  loading: boolean;
  error: string | null;
  refreshAthletes: () => Promise<void>;
  updateAthlete: (athlete: IAthlete) => void;
}

const AthletesContext = createContext<AthletesContextType | undefined>(undefined);

export function AthletesProvider({ children }: { children: React.ReactNode }) {
  const [athletes, setAthletes] = useState<IAthlete[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshAthletes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await AthleteService.getAll();
      setAthletes(data);
    } catch (err) {
      console.error("Failed to load athletes.", err);
      setError("Could not load athletes.");
    } finally {
      setLoading(false);
    }
  }, []);

  const updateAthlete = useCallback((updatedAthlete: IAthlete) => {
    setAthletes((prev) =>
      prev.map((a) => (a.id === updatedAthlete.id ? updatedAthlete : a))
    );
  }, []);

  useEffect(() => {
    refreshAthletes();
  }, [refreshAthletes]);

  return (
    <AthletesContext.Provider
      value={{ athletes, loading, error, refreshAthletes, updateAthlete }}
    >
      {children}
    </AthletesContext.Provider>
  );
}

export function useAthletes(): AthletesContextType {
  const context = useContext(AthletesContext);
  if (!context) {
    throw new Error("useAthletes must be used within AthletesProvider");
  }
  return context;
}
