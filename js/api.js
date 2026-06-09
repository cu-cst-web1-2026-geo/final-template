const CATALOG_URL = 'https://catalog-kn-industry-webstore.duckdns.org/api';
const USER_URL = 'http://user-kn-industry-webstore.duckdns.org/api';

export async function fetchData(endpoint) {
  // fetch, შეამოწმე response.ok, დააბრუნე response.json()
}

// localStorage-ის დამხმარე ფუნქციები — იმპორტი გაარ სადაც ჩანაწერები გჭირდება
export function getSaved() {
  const raw = localStorage.getItem('savedItems');
  return raw ? JSON.parse(raw) : [];
}

export function setSaved(items) {
  localStorage.setItem('savedItems', JSON.stringify(items));
}

//CATALOG
export async function getAllProducts() {
    try {
        const response = await fetch(`${CATALOG_URL}/Products/Get-All-Products`);
        
        if (!response.ok) {
            throw new Error('პროდუქტების წამოღება ვერ მოხერხდა');
        }
        
        return await response.json();
    } catch (error) {
        console.error("API Error:", error);
        throw error;
    }
}

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