// API-ს მთავარი მისამართი და key
const BASE_URL = 'https://api.restcountries.com/countries/v5';
const API_KEY = 'rc_live_3ac600dcc7be49129803563fb7ae099c';

export async function fetchData(endpoint) {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      'Authorization': `Bearer ${API_KEY}`
    }
  });
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
