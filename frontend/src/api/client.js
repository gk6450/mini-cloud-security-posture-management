const API_BASE = import.meta.env.VITE_API_URL;

export const runScan = async (credentials) => {
  const response = await fetch(`${API_BASE}/scan`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Authentication Failure");
  }

  return response.json();
};