import { useState, useEffect } from 'react';
import VenueList from '../components/VenueList';
import VenueAdmin from '../components/VenueAdmin';
import ImageUploadService from '../services/imageUploadService';
import VenueService from '../services/VenueService';
import type { IVenue, IVenueInput } from '../types/venueTypes';

function VenuePage() {
  const [venues, setVenues] = useState<IVenue[]>([]);
  const [selectedVenue, setSelectedVenue] = useState<IVenue | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

    async function loadVenues(): Promise<void> {
        try {
            setLoading(true);
            setError('');

            const data = await VenueService.getAll();
            setVenues(data);
        } catch (err) {
            console.error('Noe gikk galt ved henting av arenaer.', err);
            setError('Kunne ikke hente arenaer.');
        }
        finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        void loadVenues();
    }, []);

    async function handleCreateVenue(
        venueData: IVenueInput,
        imageFile?: File | null
    ): Promise<void> {
        try {
            setError('');

            const finalVenueData: IVenueInput = { ...venueData };

            if (imageFile) {
                const uploadResponse = await ImageUploadService.uploadImage(imageFile);
                finalVenueData.image = uploadResponse.data.fileName;
            }

            const createdVenue = await VenueService.create(finalVenueData);

            setVenues((prev) => [...prev, createdVenue]);
            setSelectedVenue(null);
        } catch (err) {
            console.error('Noe gikk galt ved oppretting av arena.', err);
            setError('Kunne ikke opprette arena.');
        }
    }

    async function handleUpdateVenue(
        venueData : IVenueInput,
         imageFile?: File | null
        ): Promise<void> {
        try {
            setError('');

            if (!venueData.id) {
                throw new Error('Ugyldig arena-ID.');
            }

            const finalVenueData: IVenueInput = { ...venueData };

            if (imageFile) {
                const uploadResponse = await ImageUploadService.uploadImage(imageFile);
                finalVenueData.image = uploadResponse.data.fileName;
            }

            await VenueService.update(finalVenueData);

            setVenues((prev) =>
                prev.map((v) => (v.id === venueData.id ? { ...v,
                    name: finalVenueData.name,
                    capacity: finalVenueData.capacity,
                    image: finalVenueData.image ?? v.image  } : v
                 )
            ));
            setSelectedVenue(null);
        } catch (err) {
            console.error('Noe gikk galt ved oppdatering av arena.', err);
            setError('Kunne ikke oppdatere arena.');
        }
    }

    async function handleDeleteVenue(venueId: number): Promise<void> {
        const shouldDelete = window.confirm(
            'Er du sikker på at du vil slette denne arenaen?'
        );
        if (!shouldDelete) return;

        try {
            setError('');

            await VenueService.remove(venueId);

            setVenues((prev) => prev.filter((v) => v.id !== venueId));
            setSelectedVenue(null);
        } catch (err) {
            console.error('Noe gikk galt ved sletting av arena.', err);
            setError('Kunne ikke slette arena.');
        }
    }

    return (
        <main style={{ padding: '1rem' }}>
            <h1>Venue administration</h1>

            {loading && <p>Laster arenaer...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
        
            {!loading && (
                <div className='venue-layout'>
                    <VenueList
                        venues={venues}
                        onSelectVenue={setSelectedVenue}
                    />

                    <VenueAdmin
                        selectedVenue={selectedVenue}
                        onCreateVenue={handleCreateVenue}
                        onUpdateVenue={handleUpdateVenue}
                        onDeleteVenue={handleDeleteVenue}
                        onClearSelection={() => setSelectedVenue(null)}
                    />
                </div>
            )}
        </main>
    );
}

export default VenuePage;