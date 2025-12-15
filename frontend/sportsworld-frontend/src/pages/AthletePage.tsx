import { useState, useEffect } from "react";
import AthleteList from "../components/AthleteList";
import AthleteAdmin from "../components/AthleteAdmin";
import ImageUploadService from "../services/imageUploadService";
import AthleteService from "../services/AthleteService";
import type { IAthlete, IAthleteInput } from "../types/athleteTypes";

/**
 * AthletePage - Admin page for managing athletes
 * 
 * Combines AthleteList and AthleteAdmin components for full CRUD functionality
 * - Left panel: List of all athletes
 * - Right panel: Form to create/edit selected athlete
 */
function AthletePage() {
  // State management
  const [athletes, setAthletes] = useState<IAthlete[]>([]); // All athletes from backend
  const [selectedAthlete, setSelectedAthlete] = useState<IAthlete | null>(null); // Currently selected athlete for editing
  const [loading, setLoading] = useState<boolean>(true); // Loading state for API calls
  const [error, setError] = useState<string>(""); // Error message state

  /**
   * Load all athletes from the backend API
   */
  async function loadAthletes(): Promise<void> {
    try {
      setLoading(true);
      setError("");

      const data = await AthleteService.getAll();
      setAthletes(data);
    } catch (err) {
      console.error("Failed to load athletes.", err);
      setError("Could not load athletes.");
    } finally {
      setLoading(false);
    }
  }

  // Load athletes on component mount
  useEffect(() => {
    void loadAthletes();
  }, []);

  /**
   * Handle creating a new athlete
   * Uploads image if provided, then creates athlete in backend
   * @param athleteData - The athlete data to create
   * @param imageFile - Optional image file to upload
   */
  async function handleCreateAthlete(
    athleteData: IAthleteInput,
    imageFile?: File | null
  ): Promise<void> {
    try {
      setError("");

      const finalAthleteData: IAthleteInput = { ...athleteData };

      // Upload image if provided
      if (imageFile) {
        const uploadResponse = await ImageUploadService.uploadImage(imageFile, "athletes");
        finalAthleteData.image = uploadResponse.data.fileName;
      }

      // Create athlete in backend
      const createdAthlete = await AthleteService.create(finalAthleteData);

      // Add new athlete to local state
      setAthletes((prev) => [...prev, createdAthlete]);
      // Clear form
      setSelectedAthlete(null);
    } catch (err) {
      console.error("Failed to create athlete.", err);
      setError("Could not create athlete.");
    }
  }

  /**
   * Handle updating an existing athlete
   * Uploads new image if provided, then updates athlete in backend
   * @param athleteData - The updated athlete data
   * @param imageFile - Optional new image file to upload
   */
  async function handleUpdateAthlete(
    athleteData: IAthleteInput,
    imageFile?: File | null
  ): Promise<void> {
    try {
      setError("");

      if (!athleteData.id) {
        throw new Error("Invalid athlete ID.");
      }

      const finalAthleteData: IAthleteInput = { ...athleteData };

      // Upload image if provided
      if (imageFile) {
        const uploadResponse = await ImageUploadService.uploadImage(imageFile, "athletes");
        finalAthleteData.image = uploadResponse.data.fileName;
      }

      // Update athlete in backend
      await AthleteService.update(finalAthleteData);

      // Update local state with new athlete data
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
      // Clear form
      setSelectedAthlete(null);
    } catch (err) {
      console.error("Failed to update athlete.", err);
      setError("Could not update athlete.");
    }
  }

  /**
   * Handle deleting an athlete
   * Requires user confirmation before deletion
   * @param athleteId - The ID of the athlete to delete
   */
  async function handleDeleteAthlete(athleteId: number): Promise<void> {
    // Request confirmation from user
    const shouldDelete = window.confirm(
      "Are you sure you want to delete this athlete?"
    );
    if (!shouldDelete) return;

    try {
      setError("");

      // Delete athlete from backend
      await AthleteService.remove(athleteId);

      // Remove athlete from local state
      setAthletes((prev) => prev.filter((a) => a.id !== athleteId));
      // Clear form
      setSelectedAthlete(null);
    } catch (err) {
      console.error("Failed to delete athlete.", err);
      setError("Could not delete athlete.");
    }
  }

  return (
    <main className="p-4">
      <h1 className="mb-4 text-2xl font-bold">Athlete Management</h1>

      {loading && <p>Loading athletes...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && (
        <div className="flex gap-4 w-full">
          {/* Left panel: List of all athletes */}
          <div className="flex-1">
            <AthleteList
              athletes={athletes}
              onSelectAthlete={setSelectedAthlete}
            />
          </div>

          {/* Right panel: Form to create/edit athlete */}
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
