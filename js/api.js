const CATALOG_URL = 'https://catalog-kn-industry-webstore.duckdns.org/api';
const USER_URL = 'http://user-kn-industry-webstore.duckdns.org/api';

// localStorage-ის დამხმარე ფუნქციები — იმპორტი გაარ სადაც ჩანაწერები გჭირდება
export function getSaved() {
  const raw = localStorage.getItem('savedItems');
  return raw ? JSON.parse(raw) : [];
}

export function setSaved(items) {
  localStorage.setItem('savedItems', JSON.stringify(items));
}

//CATALOG
export async function createProduct(productData) {
    const response = await fetch(`${CATALOG_URL}/Products/Create-Product`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(productData)
    });
    return response.json();
}

async function fetchDataCatalog(endpoint) {
  try {
    const response = await fetch(`${CATALOG_URL}${endpoint}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`სერვერის შეცდომა: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Fetch Error (${endpoint}):`, error);
    throw error;
  }
}

export async function getAllCategories() {
  return await fetchDataCatalog('/Categories/Get-All-Categories');
}

export async function getCategoryById(id) {
  return await fetchDataCatalog(`/Categories/Get-Category-By-Id/${id}`);
}

export async function getAllProducts() {
  return await fetchDataCatalog('/Products/Get-All-Products');
}

export async function getProductById(id) {
  return await fetchDataCatalog(`/Products/Get-Product-By-Id/${id}`);
}

export async function getProductsByCategory(categoryId) {
  return await fetchDataCatalog(`/Products/Get-Products-By-Category/${categoryId}`);
}

export async function searchProducts(name) {
  return await fetchDataCatalog(`/Products/Search-Products?name=${name}`);
}

//USERS
export async function CustomerAuth(loginData) {
    const response = await fetch(`${USER_URL}/Auth/Customer-Login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(loginData)
    });
    return response;
}

export async function CustomerRegister(registrationData) {
    const response = await fetch(`${USER_URL}/Customers/Customer-Register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(registrationData)
    });
    return response;
}