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
    <section className="p-4 border rounded">
        <h2 className="mb-4 font-bold">{isEditing ? "Rediger Arena" : "Legg til Ny Arena"}</h2>

        <form onSubmit={handleSubmit}>
            <div className="mb-4">
                <label htmlFor="venueName" className="mb-2">Navn:</label>
                <br />
                <input
                    id="venueName"
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
                <label htmlFor="venueCapacity" className="mb-2">Kapasitet:</label>
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
                    className="border p-2 rounded w-full"
                />
            </div>

            <div className="mb-4">
                <label htmlFor="venueImage" className="mb-2">Bilde (valgfritt):</label>
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
                    className="border p-2 rounded w-full"
                />
                {image && !imageFile && (
                    <p className="mb-2">
                        Nåværende bilde: <code>{image}</code>
                    </p>
                )}  
            </div>

            <div className="flex gap-4">
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
                    {isEditing ? "Lagre Endringer" : "Opprett Arena"}
                </button>

                <button type="button" onClick={handleClearClick} className="border px-4 py-2 rounded">
                    Tøm skjema
                </button>

                {isEditing && (
                    <button type="button" onClick={handleDeleteClick} className="bg-red-600 text-white px-4 py-2 rounded">
                        Slett Arena
                    </button>
                )}
            </div>
        </form>
    </section>
);
}

export default VenueAdmin;