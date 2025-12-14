//Administration page for managing venues (CRUD operations)
import { useState, useEffect } from 'react';
import VenueList from '../components/VenueList';
import VenueAdmin from '../components/VenueAdmin';
import ImageUploadService from '../services/imageUploadService';
import VenueService from '../services/VenueService';
import type { IVenue, IVenueInput } from '../types/venueTypes';

function VenuePage() {
    //State for storing venues, selected venues, loading and error
  const [venues, setVenues] = useState<IVenue[]>([]);
  const [selectedVenue, setSelectedVenue] = useState<IVenue | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  //Fetch venues from backend when page loads
    async function loadVenues(): Promise<void> {
        try {
            setLoading(true);
            setError('');

            const data = await VenueService.getAll();
            setVenues(data);
        } catch (err) {
            console.error('Something went wrong while fetching venues.', err);
            setError('Could not fetch venues.');
        }
        finally {
            setLoading(false);
        }
    }

    //useEffect runs loadVenues when componenet mounts
    useEffect(() => {
        void loadVenues();
    }, []);

    //Handels creating a new venue
    async function handleCreateVenue(
        venueData: IVenueInput,
        imageFile?: File | null
    ): Promise<void> {
        try {
            setError('');

            const finalVenueData: IVenueInput = { ...venueData };

            //Uploads image first if one is selected
            if (imageFile) {
                const uploadResponse = await ImageUploadService.uploadImage(imageFile);
                finalVenueData.image = uploadResponse.data.fileName;
            }

            const createdVenue = await VenueService.create(finalVenueData);

            //Adds new venue to the list
            setVenues((prev) => [...prev, createdVenue]);
            setSelectedVenue(null);
        } catch (err) {
            console.error('Something went wrong while creating venue.', err);
            setError('Could not create venue.');
        }
    }

    //Handles updating an exsisting venue
    async function handleUpdateVenue(
        venueData : IVenueInput,
         imageFile?: File | null
        ): Promise<void> {
        try {
            setError('');

            if (!venueData.id) {
                throw new Error('Invalid venue ID.');
            }

            const finalVenueData: IVenueInput = { ...venueData };

            //Uploads new image if one is selected
            if (imageFile) {
                const uploadResponse = await ImageUploadService.uploadImage(imageFile);
                finalVenueData.image = uploadResponse.data.fileName;
            }

            await VenueService.update(finalVenueData);

            //Updates venue in list with new values
            setVenues((prev) =>
                prev.map((v) => (v.id === venueData.id ? { ...v,
                    name: finalVenueData.name,
                    capacity: finalVenueData.capacity,
                    image: finalVenueData.image ?? v.image  } : v
                 )
            ));
            setSelectedVenue(null);
        } catch (err) {
            console.error('Something went wrong while updating venue.', err);
            setError('Could not update venue.');
        }
    }

    //Handles deleting a new venue
    async function handleDeleteVenue(venueId: number): Promise<void> {
        //Asks for confirmation before deliting a venue
        const shouldDelete = window.confirm(
            'Are you sure you want to delete this venue?'
        );
        if (!shouldDelete) return;

        try {
            setError('');

            await VenueService.remove(venueId);

            //Removes venue from list
            setVenues((prev) => prev.filter((v) => v.id !== venueId));
            setSelectedVenue(null);
        } catch (err) {
            console.error('Something went wrong while deleting venue.', err);
            setError('Could not delete venue.');
        }
    }

    return (
        <main className="p-4">
            <h1 className="mb-4 text-2xl font-bold">Venue administration</h1>

            {/* Shows loading/error messages */}
            {loading && <p>Loading venues...</p>}
            {error && <p className="text-red-600">{error}</p>}
        
            {/* Shows VenueList and VenueAdmin side by side */}
            {!loading && (
                <div className="flex gap-4 w-full">
                    <div className="flex-1">
                        <VenueList
                            venues={venues}
                            onSelectVenue={setSelectedVenue}
                        />
                    </div>

                    <div className="flex-1">
                        <VenueAdmin
                            selectedVenue={selectedVenue}
                            onCreateVenue={handleCreateVenue}
                            onUpdateVenue={handleUpdateVenue}
                            onDeleteVenue={handleDeleteVenue}
                            onClearSelection={() => setSelectedVenue(null)}
                        />
                    </div>
                </div>
            )}
        </main>
    );
}

export default VenuePage;