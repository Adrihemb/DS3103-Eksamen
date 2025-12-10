import { useEffect, useState } from "react";

const API_BASE_URL = "http://localhost:5189";

function AdminAthletes() {
  const [athletes, setAthletes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    gender: "Male",
    price: 0,
    image: "",
    purchaseStatus: false,
  });

  const loadAthletes = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_BASE_URL}/api/Athlete`);
      if (!response.ok) {
        throw new Error("Feil ved henting av athletes.");
      }
      const data = await response.json();
      setAthletes(data);
    } catch (err) {
      console.error(err);
      setError("Kunne ikke hente idrettsutøvere.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAthletes();
  }, []);

  const startEdit = (athlete) => {
    setEditingId(athlete.id);
    setEditForm({
      name: athlete.name,
      gender: athlete.gender,
      price: athlete.price,
      image: athlete.image,
      purchaseStatus: athlete.purchaseStatus,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const saveEdit = async (id) => {
    try {
      const updatedAthlete = { ...editForm };

      const response = await fetch(`${API_BASE_URL}/api/Athlete/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedAthlete),
      });

      if (!response.ok) {
        throw new Error("Feil ved lagring av endringer.");
      }

      // oppdater lokalt
      setAthletes((prev) =>
        prev.map((a) => (a.id === id ? { id, ...updatedAthlete } : a))
      );
      setEditingId(null);
    } catch (err) {
      console.error(err);
      alert("Kunne ikke lagre endringer.");
    }
  };

  const deleteAthlete = async (id) => {
    if (!confirm("Er du sikker på at du vil slette denne utøveren?")) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/Athlete/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Feil ved sletting.");
      }

      setAthletes((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      console.error(err);
      alert("Kunne ikke slette utøver.");
    }
  };

  const filteredAthletes = athletes.filter((a) =>
    a.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <p>Laster idrettsutøvere...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h2>Administer athletes</h2>
      <p>Her kan du søke, redigere og slette idrettsutøvere.</p>

      <input
        type="text"
        placeholder="Søk på navn..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ padding: "0.5rem", margin: "1rem 0", minWidth: "250px" }}
      />

      {filteredAthletes.length === 0 ? (
        <p>Fant ingen idrettsutøvere.</p>
      ) : (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr>
              <th style={{ borderBottom: "1px solid #ddd", textAlign: "left" }}>
                Navn
              </th>
              <th style={{ borderBottom: "1px solid #ddd", textAlign: "left" }}>
                Kjønn
              </th>
              <th style={{ borderBottom: "1px solid #ddd", textAlign: "right" }}>
                Pris
              </th>
              <th style={{ borderBottom: "1px solid #ddd", textAlign: "left" }}>
                Status
              </th>
              <th style={{ borderBottom: "1px solid #ddd", textAlign: "left" }}>
                Bilde-URL
              </th>
              <th style={{ borderBottom: "1px solid #ddd" }}>Handlinger</th>
            </tr>
          </thead>
          <tbody>
            {filteredAthletes.map((athlete) => {
              const isEditing = editingId === athlete.id;

              if (isEditing) {
                return (
                  <tr key={athlete.id}>
                    <td style={{ padding: "0.5rem" }}>
                      <input
                        type="text"
                        value={editForm.name}
                        onChange={(e) =>
                          setEditForm((f) => ({ ...f, name: e.target.value }))
                        }
                      />
                    </td>
                    <td style={{ padding: "0.5rem" }}>
                      <select
                        value={editForm.gender}
                        onChange={(e) =>
                          setEditForm((f) => ({ ...f, gender: e.target.value }))
                        }
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </td>
                    <td style={{ padding: "0.5rem", textAlign: "right" }}>
                      <input
                        type="number"
                        value={editForm.price}
                        onChange={(e) =>
                          setEditForm((f) => ({
                            ...f,
                            price: Number(e.target.value),
                          }))
                        }
                        style={{ width: "80px" }}
                      />
                    </td>
                    <td style={{ padding: "0.5rem" }}>
                      <label>
                        <input
                          type="checkbox"
                          checked={editForm.purchaseStatus}
                          onChange={(e) =>
                            setEditForm((f) => ({
                              ...f,
                              purchaseStatus: e.target.checked,
                            }))
                          }
                        />{" "}
                        Kjøpt
                      </label>
                    </td>
                    <td style={{ padding: "0.5rem" }}>
                      <input
                        type="text"
                        value={editForm.image}
                        onChange={(e) =>
                          setEditForm((f) => ({ ...f, image: e.target.value }))
                        }
                        style={{ width: "100%" }}
                      />
                    </td>
                    <td style={{ padding: "0.5rem", whiteSpace: "nowrap" }}>
                      <button
                        onClick={() => saveEdit(athlete.id)}
                        style={{ marginRight: "0.5rem" }}
                      >
                        Lagre
                      </button>
                      <button onClick={cancelEdit}>Avbryt</button>
                    </td>
                  </tr>
                );
              }

              return (
                <tr key={athlete.id}>
                  <td style={{ padding: "0.5rem" }}>{athlete.name}</td>
                  <td style={{ padding: "0.5rem" }}>{athlete.gender}</td>
                  <td style={{ padding: "0.5rem", textAlign: "right" }}>
                    {athlete.price}
                  </td>
                  <td style={{ padding: "0.5rem" }}>
                    {athlete.purchaseStatus ? "Kjøpt" : "Ikke kjøpt"}
                  </td>
                  <td style={{ padding: "0.5rem", maxWidth: "250px" }}>
                    <div
                      style={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                      title={athlete.image}
                    >
                      {athlete.image}
                    </div>
                  </td>
                  <td style={{ padding: "0.5rem", whiteSpace: "nowrap" }}>
                    <button
                      onClick={() => startEdit(athlete)}
                      style={{ marginRight: "0.5rem" }}
                    >
                      Rediger
                    </button>
                    <button onClick={() => deleteAthlete(athlete.id)}>
                      Slett
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AdminAthletes;
