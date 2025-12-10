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

  useEffect(() => {
    if (selectedAthlete) {
      setName(selectedAthlete.name);
      setGender(selectedAthlete.gender);
      setPrice(selectedAthlete.price.toString());
      setImage(selectedAthlete.image ?? "");
      setImageFile(null);
      setPurchaseStatus(selectedAthlete.purchaseStatus);
    } else {
      setName("");
      setGender("Male");
      setPrice("");
      setImage("");
      setImageFile(null);
      setPurchaseStatus(false);
    }
  }, [selectedAthlete]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const priceNumber = Number(price);
    if (Number.isNaN(priceNumber) || priceNumber < 0) {
      alert("Pris må være et gyldig tall.");
      return;
    }

    const athleteData: IAthleteInput = {
      ...(selectedAthlete ? { id: selectedAthlete.id } : {}),
      name: name.trim(),
      gender: gender.trim(),
      price: priceNumber,
      image: image.trim(),
      purchaseStatus,
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
    <section className="athlete-panel">
      <h2>{isEditing ? "Rediger Idrettsutøver" : "Legg til Ny Idrettsutøver"}</h2>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="athleteName">Navn:</label>
          <br />
          <input
            id="athleteName"
            type="text"
            value={name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setName(e.target.value)
            }
            required
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="athleteGender">Kjønn:</label>
          <br />
          <select
            id="athleteGender"
            value={gender}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              setGender(e.target.value)
            }
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="athletePrice">Pris (coins):</label>
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
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="athleteImage">Bilde (valgfritt):</label>
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
          />
          {image && !imageFile && (
            <p style={{ marginTop: "0.5rem" }}>
              Nåværende bilde: <code>{image}</code>
            </p>
          )}
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="athletePurchaseStatus">
            <input
              id="athletePurchaseStatus"
              type="checkbox"
              checked={purchaseStatus}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPurchaseStatus(e.target.checked)
              }
            />{" "}
            Kjøpt
          </label>
        </div>

        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button type="submit">
            {isEditing ? "Oppdater" : "Lag"}
          </button>
          {isEditing && (
            <button type="button" onClick={handleDeleteClick}>
              Slett
            </button>
          )}
          {isEditing && (
            <button type="button" onClick={handleClearClick}>
              Avbryt
            </button>
          )}
        </div>
      </form>
    </section>
  );
}

export default AthleteAdmin;
