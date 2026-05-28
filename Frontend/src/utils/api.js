export const API_URL =
  import.meta.env.VITE_API_URL;

export function getToken() {
  return localStorage.getItem("token");
}
