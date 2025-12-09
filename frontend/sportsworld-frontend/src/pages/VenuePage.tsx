import { useState, useEffect } from 'react';
import VenueList from '../components/VenueList';
import VenueAdmin from '../components/VenueAdmin';
import ImageUploadService from '../services/imageUploadService'; 
import type { IVenue, IVenueInput } from '../types/venueTypes';

function VenuePage() {
  const [venues, setVenues] = useState<IVenue[]>([]);
  const [selectedVenue, setSelectedVenue] = useState<IVenue | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

    const apiBaseUrl = 'http://localhost:5189/api/Venue';       

    async function loadVenues(): Promise<void> {
        try {
            setLoading(true);
            setError('');

            const response = await fetch(apiBaseUrl);
            if (!response.ok) {
                throw new Error(`Kunne ikke hente arenaer`);
            }

            const data = await response.json();
            setVenues(data);
        } catch (err) {
            console.error('Noe gikk galt ved henting av arenaer.', err);
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

            const response = await fetch(apiBaseUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(finalVenueData),
            });

            if (!response.ok) {
                throw new Error('Kunne ikke opprette arena.');
            }

            const createdVenue = await response.json();

            setVenues((prev) => [...prev, createdVenue]);
            setSelectedVenue(null);
            alert('Arena opprettet!');
        } catch (err) {
            console.error('Noe gikk galt ved oppretting av arena.', err);
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

            const response = await fetch(`${apiBaseUrl}/${venueData.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(finalVenueData),
            });

            if (!response.ok) {
                throw new Error('Kunne ikke oppdatere arena.');
            }

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
        }
    }

    async function handleDeleteVenue(venueId: number): Promise<void> {
        const shouldDelete = window.confirm(
            'Er du sikker på at du vil slette denne arenaen?'
        );
        if (!shouldDelete) return;

        try {
            setError('');

            const response = await fetch(`${apiBaseUrl}/${venueId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Kunne ikke slette arena.');
            }

            setVenues((prev) => prev.filter((v) => v.id !== venueId));
            setSelectedVenue(null);
        } catch (err) {
            console.error('Noe gikk galt ved sletting av arena.', err);
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