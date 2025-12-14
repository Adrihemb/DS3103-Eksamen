//Form component for creating, editing and deleting venues
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
  //Form state for input fields
  const [name, setName] = useState<string>("");
  const [capacity, setCapacity] = useState<string>("");
  const [image, setImage] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  //Populate form fields when a venue is selected for editing
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
  

  //Handles form submission for creating or updating a venue
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    //Validate capacity input is a positive number
    const capacityNumber = Number(capacity);
    if (Number.isNaN(capacityNumber) || capacityNumber <= 0) {
      alert("Capacity must be a valid positive number.");
      return;
    }

    //Build venue data object
    const venueData = {
        ...(selectedVenue ? { id: selectedVenue.id } : {}),
        name: name.trim(),
        capacity: capacityNumber,
        image: image.trim(),
    };

    //Call appropriate handler based on whether we're creating or updating
    if (selectedVenue) {
      onUpdateVenue(venueData, imageFile);
    } else {
      onCreateVenue(venueData, imageFile);
    }
}

//Handles deleting the selected venue
function handleDeleteClick() {
    if (!selectedVenue) return;
    onDeleteVenue(selectedVenue.id);
}

//Clears the form inputs and selection
function handleClearClick() {
    onClearSelection();
} 

//Determine if we're in editing mode
const isEditing = !!selectedVenue;

return (
    <section className="p-4 border rounded">
        <h2 className="mb-4 font-bold">{isEditing ? "Edit Venue" : "Add New Venue"}</h2>

        <form onSubmit={handleSubmit}>
            {/*Name input field*/}
            <div className="mb-4">
                <label htmlFor="venueName" className="mb-2">Name:</label>
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

            {/*Capacity input field*/}
            <div className="mb-4">
                <label htmlFor="venueCapacity" className="mb-2">Capacity:</label>
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

            {/*Image file input field*/}
            <div className="mb-4">
                <label htmlFor="venueImage" className="mb-2">Image (optional):</label>
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
                        Current image: <code>{image}</code>
                    </p>
                )}  
            </div>

            {/*Action buttons (submit, clear, delete)*/}
            <div className="flex gap-4">
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
                    {isEditing ? "Save Changes" : "Create Venue"}
                </button>

                <button type="button" onClick={handleClearClick} className="border px-4 py-2 rounded">
                    Clear Form
                </button>

                {isEditing && (
                    <button type="button" onClick={handleDeleteClick} className="bg-red-600 text-white px-4 py-2 rounded">
                        Delete Venue
                    </button>
                )}
            </div>
        </form>
    </section>
);
}

export default VenueAdmin;