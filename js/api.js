const CATALOG_URL = 'https://catalog-kn-industry-webstore.duckdns.org/api';
const USER_URL = 'http://user-kn-industry-webstore.duckdns.org/api';
const CART_URL = 'http://cart-kn-industry-webstore.duckdns.org';

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

//CART
async function fetchDataCart(endpoint) {
  try {
    const response = await fetch(`${CART_URL}${endpoint}`, {
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

export async function getCart(customerId) {
  return await fetchDataCart(`/api/Carts/Get-Cart/${customerId}`);
}

export async function addToCart(customerId, productId) {
  try {
    const response = await fetch(`${CART_URL}/api/Carts/Add-To-Cart/${customerId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ productId: productId, quantity: 1 }) 
    });
    if (!response.ok) throw new Error('კალათაში დამატება ვერ მოხერხდა');
    return true;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function removeFromCart(customerId, productId) {
  try {
    const response = await fetch(`${CART_URL}/api/Carts/Remove-From-Cart/${customerId}/items/${productId}`, {
      method: 'DELETE',
      headers: { 'Accept': 'application/json' }
    });
    if (!response.ok) throw new Error('ნივთის წაშლა ვერ მოხერხდა');
    return true;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function increaseQuantity(customerId, productId, quantity = 1) {
  try {
    const response = await fetch(`${CART_URL}/api/Carts/Increase-Quantity/${customerId}/items/${productId}?quantity=${quantity}`, {
      method: 'PATCH',
      headers: { 'Accept': 'application/json' }
    });
    const responseText = await response.text();
    if (!responseText) return true;

    return JSON.parse(responseText);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function decreaseQuantity(customerId, productId, quantity = 1) {
  try {
    const response = await fetch(`${CART_URL}/api/Carts/Decrease-Quantity/${customerId}/items/${productId}?quantity=${quantity}`, {
      method: 'PATCH',
      headers: { 'Accept': 'application/json' }
    });
    const responseText = await response.text();
    if (!responseText) return true;

    return JSON.parse(responseText);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function clearCart(customerId) {
  try {
    const response = await fetch(`${CART_URL}/api/Carts/Clear-Cart/${customerId}/items`, {
      method: 'DELETE',
      headers: { 'Accept': 'application/json' }
    });
    return response.ok;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getCartTotal(customerId) {
  return await fetchDataCart(`/api/Carts/Get-Total/${customerId}`);
}