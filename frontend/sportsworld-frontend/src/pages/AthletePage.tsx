import { useState, useEffect } from "react";
import AthleteList from "../components/AthleteList";
import AthleteAdmin from "../components/AthleteAdmin";
import ImageUploadService from "../services/imageUploadService";
import AthleteService from "../services/AthleteService";
import type { IAthlete, IAthleteInput } from "../types/athleteTypes";

function AthletePage() {
  const [athletes, setAthletes] = useState<IAthlete[]>([]);
  const [selectedAthlete, setSelectedAthlete] = useState<IAthlete | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  async function loadAthletes(): Promise<void> {
    try {
      setLoading(true);
      setError("");

      const data = await AthleteService.getAll();
      setAthletes(data);
    } catch (err) {
      console.error("Noe gikk galt ved henting av idrettsutøvere.", err);
      setError("Kunne ikke hente idrettsutøvere.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadAthletes();
  }, []);

  async function handleCreateAthlete(
    athleteData: IAthleteInput,
    imageFile?: File | null
  ): Promise<void> {
    try {
      setError("");

      const finalAthleteData: IAthleteInput = { ...athleteData };

      if (imageFile) {
        const uploadResponse = await ImageUploadService.uploadImage(imageFile, "athletes");
        finalAthleteData.image = uploadResponse.data.fileName;
      }

      const createdAthlete = await AthleteService.create(finalAthleteData);

      setAthletes((prev) => [...prev, createdAthlete]);
      setSelectedAthlete(null);
    } catch (err) {
      console.error("Noe gikk galt ved oppretting av idrettsutøver.", err);
      setError("Kunne ikke opprette idrettsutøver.");
    }
  }

  async function handleUpdateAthlete(
    athleteData: IAthleteInput,
    imageFile?: File | null
  ): Promise<void> {
    try {
      setError("");

      if (!athleteData.id) {
        throw new Error("Ugyldig idrettsutøver-ID.");
      }

      const finalAthleteData: IAthleteInput = { ...athleteData };

      if (imageFile) {
        const uploadResponse = await ImageUploadService.uploadImage(imageFile, "athletes");
        finalAthleteData.image = uploadResponse.data.fileName;
      }

      await AthleteService.update(finalAthleteData);

      setAthletes((prev) =>
        prev.map((a) =>
          a.id === athleteData.id
            ? {
                ...a,
                name: finalAthleteData.name,
                gender: finalAthleteData.gender,
                price: finalAthleteData.price,
                image: finalAthleteData.image ?? a.image,
                purchaseStatus: finalAthleteData.purchaseStatus,
              }
            : a
        )
      );
      setSelectedAthlete(null);
    } catch (err) {
      console.error("Noe gikk galt ved oppdatering av idrettsutøver.", err);
      setError("Kunne ikke oppdatere idrettsutøver.");
    }
  }

  async function handleDeleteAthlete(athleteId: number): Promise<void> {
    const shouldDelete = window.confirm(
      "Er du sikker på at du vil slette denne idrettsutøveren?"
    );
    if (!shouldDelete) return;

    try {
      setError("");

      await AthleteService.remove(athleteId);

      setAthletes((prev) => prev.filter((a) => a.id !== athleteId));
      setSelectedAthlete(null);
    } catch (err) {
      console.error("Noe gikk galt ved sletting av idrettsutøver.", err);
      setError("Kunne ikke slette idrettsutøver.");
    }
  }

  return (
    <main className="p-4">
      <h1 className="mb-4 text-2xl font-bold">Idrettsutøver administrasjon</h1>

      {loading && <p>Laster idrettsutøvere...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && (
        <div className="flex gap-4 w-full">
          <div className="flex-1">
            <AthleteList
              athletes={athletes}
              onSelectAthlete={setSelectedAthlete}
            />
          </div>

          <div className="flex-1">
            <AthleteAdmin
              selectedAthlete={selectedAthlete}
              onCreateAthlete={handleCreateAthlete}
              onUpdateAthlete={handleUpdateAthlete}
              onDeleteAthlete={handleDeleteAthlete}
              onClearSelection={() => setSelectedAthlete(null)}
            />
          </div>
        </div>
      )}
    </main>
  );
}

export default AthletePage;
