import { useEffect, useState } from "react";
import type { IAthlete, IAthleteInput } from "../types/athleteTypes";

interface AthleteAdminProps {
  selectedAthlete: IAthlete | null;
  onCreateAthlete: (athlete: IAthleteInput, imageFile?: File | null) => void | Promise<void>;
  onUpdateAthlete: (athlete: IAthleteInput, imageFile?: File | null) => void | Promise<void>;
  onDeleteAthlete: (athleteId: number) => void | Promise<void>;
  onClearSelection: () => void;
}

function AthleteAdmin({
  selectedAthlete,
  onCreateAthlete,
  onUpdateAthlete,
  onDeleteAthlete,
  onClearSelection,
}: AthleteAdminProps) {
  const [name, setName] = useState<string>("");
  const [gender, setGender] = useState<string>("Male");
  const [price, setPrice] = useState<string>("");
  const [image, setImage] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [purchaseStatus, setPurchaseStatus] = useState<boolean>(false);
  const [position, setPosition] = useState<string>("");
  const [nationality, setNationality] = useState<string>("");

  useEffect(() => {
    if (selectedAthlete) {
      setName(selectedAthlete.name);
      setGender(selectedAthlete.gender);
      setPrice(selectedAthlete.price.toString());
      setImage(selectedAthlete.image ?? "");
      setImageFile(null);
      setPurchaseStatus(selectedAthlete.purchaseStatus);
      setPosition(selectedAthlete.position ?? "");
      setNationality(selectedAthlete.nationality ?? "");
    } else {
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

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const priceNumber = Number(price);
    if (Number.isNaN(priceNumber) || priceNumber < 0) {
      alert("Price must be a valid number.");
      return;
    }

    const athleteData: IAthleteInput = {
      ...(selectedAthlete ? { id: selectedAthlete.id } : {}),
      name: name.trim(),
      gender: gender.trim(),
      price: priceNumber,
      image: image.trim(),
      purchaseStatus,
      position: position.trim(),
      nationality: nationality.trim(),
    };

    if (selectedAthlete) {
      onUpdateAthlete(athleteData, imageFile);
    } else {
      onCreateAthlete(athleteData, imageFile);
    }
  }

  function handleDeleteClick() {
    if (!selectedAthlete) return;
    onDeleteAthlete(selectedAthlete.id);
  }

  function handleClearClick() {
    onClearSelection();
  }

  const isEditing = !!selectedAthlete;

  return (
    <section className="p-4 border rounded">
      <h2 className="mb-4 font-bold">{isEditing ? "Edit Athlete" : "Add New Athlete"}</h2>

      <form onSubmit={handleSubmit}>
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
          {image && !imageFile && (
            <p className="mb-2">
              Current image: <code>{image}</code>
            </p>
          )}
        </div>

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

        <div className="flex gap-4">
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
            {isEditing ? "Save Changes" : "Create Athlete"}
          </button>

          <button type="button" onClick={handleClearClick} className="border px-4 py-2 rounded">
            Clear Form
          </button>

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
