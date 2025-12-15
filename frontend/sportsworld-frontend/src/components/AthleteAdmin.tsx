import { useEffect, useState } from "react";
import type { IAthlete, IAthleteInput } from "../types/athleteTypes";

/**
 * Props for AthleteAdmin component
 */
interface AthleteAdminProps {
  selectedAthlete: IAthlete | null; // Currently selected athlete for editing
  onCreateAthlete: (athlete: IAthleteInput, imageFile?: File | null) => void | Promise<void>; // Callback to create new athlete
  onUpdateAthlete: (athlete: IAthleteInput, imageFile?: File | null) => void | Promise<void>; // Callback to update athlete
  onDeleteAthlete: (athleteId: number) => void | Promise<void>; // Callback to delete athlete
  onClearSelection: () => void; // Callback to clear form
}

/**
 * AthleteAdmin - Form component for creating and editing athletes
 * 
 * Features:
 * - Create new athlete
 * - Edit selected athlete
 * - Delete athlete (confirmation required)
 * - Upload athlete image
 * - Add optional position and nationality fields
 */
function AthleteAdmin({
  selectedAthlete,
  onCreateAthlete,
  onUpdateAthlete,
  onDeleteAthlete,
  onClearSelection,
}: AthleteAdminProps) {
  // Form state
  const [name, setName] = useState<string>(""); // Athlete name
  const [gender, setGender] = useState<string>("Male"); // Athlete gender
  const [price, setPrice] = useState<string>(""); // Athlete price (string for input)
  const [image, setImage] = useState<string>(""); // Current image name
  const [imageFile, setImageFile] = useState<File | null>(null); // New image file to upload
  const [purchaseStatus, setPurchaseStatus] = useState<boolean>(false); // Is athlete purchased
  const [position, setPosition] = useState<string>(""); // Athlete position (optional)
  const [nationality, setNationality] = useState<string>(""); // Athlete nationality (optional)

  /**
   * Populate form when an athlete is selected for editing
   * Clears form if no athlete is selected
   */
  useEffect(() => {
    if (selectedAthlete) {
      // Populate form with selected athlete's data
      setName(selectedAthlete.name);
      setGender(selectedAthlete.gender);
      setPrice(selectedAthlete.price.toString());
      setImage(selectedAthlete.image ?? "");
      setImageFile(null);
      setPurchaseStatus(selectedAthlete.purchaseStatus);
      setPosition(selectedAthlete.position ?? "");
      setNationality(selectedAthlete.nationality ?? "");
    } else {
      // Clear form for creating new athlete
      setName("");
      setGender("Male");
      setPrice("");
      setImage("");
      setImageFile(null);
      setPurchaseStatus(false);
      setPosition("");
      setNationality("");
    }
  }, [selectedAthlete]);

  /**
   * Handle form submission for creating or updating athlete
   * Validates price and calls appropriate callback
   */
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // Validate price
    const priceNumber = Number(price);
    if (Number.isNaN(priceNumber) || priceNumber < 0) {
      alert("Price must be a valid number.");
      return;
    }

    // Build athlete data object
    const athleteData: IAthleteInput = {
      ...(selectedAthlete ? { id: selectedAthlete.id } : {}), // Include ID only if editing
      name: name.trim(),
      gender: gender.trim(),
      price: priceNumber,
      image: image.trim(),
      purchaseStatus,
      position: position.trim(),
      nationality: nationality.trim(),
    };

    // Call create or update callback
    if (selectedAthlete) {
      onUpdateAthlete(athleteData, imageFile);
    } else {
      onCreateAthlete(athleteData, imageFile);
    }
  }

  /**
   * Handle delete button click
   * Requires selected athlete to be set
   */
  function handleDeleteClick() {
    if (!selectedAthlete) return;
    onDeleteAthlete(selectedAthlete.id);
  }

  /**
   * Handle clear form button click
   */
  function handleClearClick() {
    onClearSelection();
  }

  // Determine if form is in edit mode (athlete selected) or create mode
  const isEditing = !!selectedAthlete;

  return (
    <section className="p-4 border rounded">
      {/* Form title changes based on mode */}
      <h2 className="mb-4 font-bold">{isEditing ? "Edit Athlete" : "Add New Athlete"}</h2>

      <form onSubmit={handleSubmit}>
        {/* Athlete name field */}
        <div className="mb-4">
          <label htmlFor="athleteName" className="mb-2">Name:</label>
          <br />
          <input
            id="athleteName"
            type="text"
            value={name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setName(e.target.value)
            }
            required
            className="border p-2 rounded w-full"
          />
        </div>

        {/* Athlete gender field */}
        <div className="mb-4">
          <label htmlFor="athleteGender" className="mb-2">Gender:</label>
          <br />
          <select
            id="athleteGender"
            value={gender}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              setGender(e.target.value)
            }
            className="border p-2 rounded w-full"
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Athlete price field */}
        <div className="mb-4">
          <label htmlFor="athletePrice" className="mb-2">Price (coins):</label>
          <br />
          <input
            id="athletePrice"
            type="number"
            value={price}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setPrice(e.target.value)
            }
            min="0"
            required
            className="border p-2 rounded w-full"
          />
        </div>

        {/* Image upload field */}
        <div className="mb-4">
          <label htmlFor="athleteImage" className="mb-2">Image (optional):</label>
          <br />
          <input
            id="athleteImage"
            type="file"
            accept="image/*"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const file = e.target.files?.[0] ?? null;
              setImageFile(file);
              if (file) {
                setImage(file.name);
              }
            }}
            className="border p-2 rounded w-full"
          />
          {/* Display current image if not uploading new one */}
          {image && !imageFile && (
            <p className="mb-2">
              Current image: <code>{image}</code>
            </p>
          )}
        </div>

        {/* Athlete position field (optional) */}
        <div className="mb-4">
          <label htmlFor="athletePosition" className="mb-2">Position (optional):</label>
          <br />
          <input
            id="athletePosition"
            type="text"
            value={position}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setPosition(e.target.value)
            }
            placeholder="e.g. Keeper, Defender, Midfielder, Striker"
            className="border p-2 rounded w-full"
          />
        </div>

        {/* Athlete nationality field (optional) */}
        <div className="mb-4">
          <label htmlFor="athleteNationality" className="mb-2">Nationality (optional):</label>
          <br />
          <input
            id="athleteNationality"
            type="text"
            value={nationality}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setNationality(e.target.value)
            }
            placeholder="e.g. Norway, Brazil, Germany"
            className="border p-2 rounded w-full"
          />
        </div>

        {/* Purchase status checkbox */}
        <div className="mb-4">
          <label htmlFor="athletePurchaseStatus">
            <input
              id="athletePurchaseStatus"
              type="checkbox"
              checked={purchaseStatus}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPurchaseStatus(e.target.checked)
              }
            />{" "}
            Purchased
          </label>
        </div>

        {/* Form action buttons */}
        <div className="flex gap-4">
          {/* Submit button - "Create Athlete" or "Save Changes" */}
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
            {isEditing ? "Save Changes" : "Create Athlete"}
          </button>

          {/* Clear form button */}
          <button type="button" onClick={handleClearClick} className="border px-4 py-2 rounded">
            Clear Form
          </button>

          {/* Delete button - only shown when editing */}
          {isEditing && (
            <button type="button" onClick={handleDeleteClick} className="bg-red-600 text-white px-4 py-2 rounded">
              Delete Athlete
            </button>
          )}
        </div>
      </form>
    </section>
  );
}

export default AthleteAdmin;
