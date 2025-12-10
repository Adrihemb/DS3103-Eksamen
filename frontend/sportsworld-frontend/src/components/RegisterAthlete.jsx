import { useState } from "react";

const API_BASE_URL = "http://localhost:5189";

function RegisterAthlete() {
  const [form, setForm] = useState({
    name: "",
    gender: "Male",
    price: 0,
    image: "",
  });
  const [statusMessage, setStatusMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: name === "price" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusMessage("");

    const newAthlete = {
      name: form.name,
      gender: form.gender,
      price: form.price,
      image: form.image,
      purchaseStatus: false, // ny athlete er alltid "not purchased"
    };

    try {
      const response = await fetch(`${API_BASE_URL}/api/Athlete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newAthlete),
      });

      if (!response.ok) {
        throw new Error("Feil ved registrering av athlete.");
      }

      setStatusMessage("Athlete registrert!");
      // nullstill skjema
      setForm({
        name: "",
        gender: "Male",
        price: 0,
        image: "",
      });
    } catch (err) {
      console.error(err);
      setStatusMessage("Kunne ikke registrere athlete.");
    }
  };

  return (
    <div>
      <h2>Register potential athlete</h2>
      <p>Registrer en ny idrettsutøver. De får status "not purchased" som standard.</p>

      <form
        onSubmit={handleSubmit}
        style={{
          maxWidth: "400px",
          display: "flex",
          flexDirection: "column",
          gap: "0.75rem",
          marginTop: "1rem",
        }}
      >
        <label>
          Navn
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Kjønn
          <select
            name="gender"
            value={form.gender}
            onChange={handleChange}
            required
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </label>

        <label>
          Pris (coins)
          <input
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
            min={0}
            required
          />
        </label>

        <label>
          Bilde-URL
          <input
            type="text"
            name="image"
            value={form.image}
            onChange={handleChange}
          />
        </label>

        <button type="submit" style={{ marginTop: "0.5rem" }}>
          Registrer athlete
        </button>
      </form>

      {statusMessage && (
        <p style={{ marginTop: "1rem" }}>
          {statusMessage}
        </p>
      )}
    </div>
  );
}

export default RegisterAthlete;
