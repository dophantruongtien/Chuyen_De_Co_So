export const API_URL = "http://localhost:5000";

export function getToken() {
  return localStorage.getItem("token");
}