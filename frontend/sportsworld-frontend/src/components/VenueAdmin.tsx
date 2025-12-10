import { useEffect, useState } from "react";
import type { IVenue, IVenueInput } from "../types/venueTypes";

interface VenueAdminProps {
  selectedVenue: IVenue | null;
  onCreateVenue: (venue: IVenueInput, imageFile?: File | null) => void | Promise<void>;
  onUpdateVenue: (venue: IVenueInput, imageFile?: File | null) => void | Promise<void>;
  onDeleteVenue: (venueId: number) => void | Promise<void>;
  onClearSelection: () => void;
}

function VenueAdmin({ selectedVenue, onCreateVenue, onUpdateVenue, onDeleteVenue, onClearSelection }: VenueAdminProps) {
  const [name, setName] = useState<string>("");
  const [capacity, setCapacity] = useState<string>("");
  const [image, setImage] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    if (selectedVenue) {
      setName(selectedVenue.name);
      setCapacity(selectedVenue.capacity.toString());
      setImage(selectedVenue.image ?? "");
      setImageFile(null);
    } else {
      setName("");
      setCapacity("");
      setImage("");
      setImageFile(null);
    }
  }, [selectedVenue]);
  

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const capacityNumber = Number(capacity);
    if (Number.isNaN(capacityNumber) || capacityNumber <= 0) {
      alert("Kapasitet må være et gyldig positivt tall.");
      return;
    }

    const venueData = {

        ...(selectedVenue ? { id: selectedVenue.id } : {}),
        name: name.trim(),
        capacity: capacityNumber,
        image: image.trim(),
    };

    if (selectedVenue) {
      onUpdateVenue(venueData, imageFile);
    } else {
      onCreateVenue(venueData, imageFile);
    }
}

function handleDeleteClick() {
    if (!selectedVenue) return;
    onDeleteVenue(selectedVenue.id);
}

function handleClearClick() {
    onClearSelection();
} 

const isEditing = !!selectedVenue;

return (
    <section className="venue-panel">
        <h2>{isEditing ? "Rediger Arena" : "Legg til Ny Arena"}</h2>

        <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1rem' }}>
                <label htmlFor="venueName">Navn:</label>
                <br />
                <input
                    id="venueName"
                    type="text"
                    value={name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                        setName(e.target.value)
                    }
                    required
                />
            </div>

            <div style={{ marginBottom: '1rem' }}>
                <label htmlFor="venueCapacity">Kapasitet:</label>
                <br />
                <input
                    id="venueCapacity"
                    type="number"
                    value={capacity}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                        setCapacity(e.target.value)
                    }
                    required
                    min={1}
                />
            </div>

            <div style={{ marginBottom: '1rem' }}>
                <label htmlFor="venueImage">Bilde (valgfritt):</label>
                <br />
                <input
                    id="venueImage"
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
                    <p style={{ marginTop: '0.5rem' }}>
                        Nåværende bilde: <code>{image}</code>
                    </p>
                )}  
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="submit">
                    {isEditing ? "Lagre Endringer" : "Opprett Arena"}
                </button>

                <button type="button" onClick={handleClearClick}>
                    Tøm skjema
                </button>

                {isEditing && (
                    <button type="button" onClick={handleDeleteClick}>
                        Slett Arena
                    </button>
                )}
            </div>
        </form>
    </section>
);
}

export default VenueAdmin;