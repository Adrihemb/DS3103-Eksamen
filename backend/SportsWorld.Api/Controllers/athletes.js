
const API_BASE_URL = "http://localhost:5189";

export async function getAthletes() {
  const response = await fetch(`${API_BASE_URL}/api/athlete`);

  if (!response.ok) {
    throw new Error(`API-feil: ${response.status}`);
  }

  return await response.json();
}
