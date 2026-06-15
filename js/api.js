//API-ს მთავარი მისამართი
const BASE_URL = 'https://restcountries.com/v3.1';
export async function fetchData(endpoint) {
  const response = await fetch(`${BASE_URL}${endpoint}`);
  if (!response.ok) {
    throw new Error(`შეცდომა: ${response.status}`);
  }
  return response.json();
}
export function getSaved() {
  const raw = localStorage.getItem('savedItems');
  return raw ? JSON.parse(raw) : [];
}
export function setSaved(items) {
  localStorage.setItem('savedItems', JSON.stringify(items));
}
