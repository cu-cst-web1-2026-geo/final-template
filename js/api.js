const CATALOG_URL = 'https://catalog-kn-industry-webstore.duckdns.org/api';
const USER_URL = 'http://user-kn-industry-webstore.duckdns.org/api';
const CART_URL = 'http://cart-kn-industry-webstore.duckdns.org/api';
const ORDER_URL = 'http://order-kn-industry-webstore.duckdns.org/api';

// localStorage-ის დამხმარე ფუნქციები — იმპორტი გაარ სადაც ჩანაწერები გჭირდება
export function getSaved() {
  const raw = localStorage.getItem('savedItems');
  return raw ? JSON.parse(raw) : [];
}

export function setSaved(items) {
  localStorage.setItem('savedItems', JSON.stringify(items));
}

const getAdminHeaders = (isMultipart = false) => {
  const token = localStorage.getItem('adminToken'); 
  
  const headers = {
    'Accept': 'application/json',
    'Authorization': `Bearer ${token}`
  };
  
  if (!isMultipart) {
    headers['Content-Type'] = 'application/json';
  }
  
  return headers;
};

//CATALOG
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

export async function createCategory(categoryData) {
  const response = await fetch(`${CATALOG_URL}/Categories/Create-Category`, {
    method: 'POST',
    headers: getAdminHeaders(),
    body: JSON.stringify(categoryData)
  });
  if (!response.ok) throw new Error('კატეგორიის შექმნა ვერ მოხერხდა');
  return await response.json();
}

export async function updateCategory(id, categoryData) {
  const response = await fetch(`${CATALOG_URL}/Categories/Update-Category/${id}`, {
    method: 'PUT',
    headers: getAdminHeaders(),
    body: JSON.stringify(categoryData)
  });
  if (!response.ok) throw new Error('კატეგორიის განახლება ვერ მოხერხდა');
  return true;
}

export async function deleteCategory(id) {
  const response = await fetch(`${CATALOG_URL}/Categories/Delete-Category/${id}`, {
    method: 'DELETE',
    headers: getAdminHeaders()
  });
  if (!response.ok) throw new Error('კატეგორიის წაშლა ვერ მოხერხდა. შესაძლოა მასზე მიბმულია პროდუქტები');
  return true;
}

export async function createProduct(formData) {
  const response = await fetch(`${CATALOG_URL}/Products/Create-Product`, {
    method: 'POST',
    headers: getAdminHeaders(true),
    body: formData
  });
  if (!response.ok) throw new Error('პროდუქტის შექმნა ვერ მოხერხდა');
  return await response.json();
}
export async function updateProduct(id, productData) {
  const response = await fetch(`${CATALOG_URL}/Products/Update-Product/${id}`, {
    method: 'PUT',
    headers: getAdminHeaders(),
    body: JSON.stringify(productData)
  });
  if (!response.ok) throw new Error('პროდუქტის განახლება ვერ მოხერხდა');
  return true;
}

export async function deleteProduct(id) {
  const response = await fetch(`${CATALOG_URL}/Products/Delete-Product/${id}`, {
    method: 'DELETE',
    headers: getAdminHeaders()
  });
  if (!response.ok) throw new Error('პროდუქტის წაშლა ვერ მოხერხდა');
  return true;
}

export async function updateProductStock(id, newStock) {
  const response = await fetch(`${CATALOG_URL}/Products/Update-Product-Stock/${id}?newStock=${newStock}`, {
    method: 'PATCH',
    headers: getAdminHeaders()
  });
  if (!response.ok) throw new Error('მარაგის განახლება ვერ მოხერხდა');
  return true;
}

export async function updateProductPrice(id, newPrice) {
  const response = await fetch(`${CATALOG_URL}/Products/Update-Product-Price/${id}?newPrice=${newPrice}`, {
    method: 'PATCH',
    headers: getAdminHeaders()
  });
  if (!response.ok) throw new Error('ფასის განახლება ვერ მოხერხდა');
  return true;
}

export async function updateProductImage(id, imageFormData) {
  const response = await fetch(`${CATALOG_URL}/Products/Update-Product-Image/${id}`, {
    method: 'PATCH',
    headers: getAdminHeaders(true),
    body: imageFormData
  });
  if (!response.ok) throw new Error('სურათის განახლება ვერ მოხერხდა');
  return true;
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

export async function changeUsername(customerId, newUsername) {
  try {
    const response = await fetch(`${USER_URL}/Customers/Customer-ChangeUsername/${customerId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(newUsername)
    });
    if (!response.ok) throw new Error('იუზერნეიმის შეცვლა ვერ მოხერხდა');
    const responseText = await response.text();
    return responseText ? JSON.parse(responseText) : true;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function changePassword(customerId, oldPassword, newPassword) {
  try {
    const response = await fetch(`${USER_URL}/Customers/Customer-ChangePassword/${customerId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ oldPassword, newPassword })
    });
    if (!response.ok) throw new Error('პაროლის შეცვლა ვერ მოხერხდა. შეამოწმეთ ძველი პაროლი');
    const responseText = await response.text();
    return responseText ? JSON.parse(responseText) : true;
  } catch (error) {
    console.error(error);
    throw error;
  }
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
  return await fetchDataCart(`/Carts/Get-Cart/${customerId}`);
}

export async function addToCart(customerId, productId) {
  try {
    const response = await fetch(`${CART_URL}/Carts/Add-To-Cart/${customerId}`, {
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
    const response = await fetch(`${CART_URL}/Carts/Remove-From-Cart/${customerId}/items/${productId}`, {
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
    const response = await fetch(`${CART_URL}/Carts/Increase-Quantity/${customerId}/items/${productId}?quantity=${quantity}`, {
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
    const response = await fetch(`${CART_URL}/Carts/Decrease-Quantity/${customerId}/items/${productId}?quantity=${quantity}`, {
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
    const response = await fetch(`${CART_URL}/Carts/Clear-Cart/${customerId}/items`, {
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
  return await fetchDataCart(`/Carts/Get-Total/${customerId}`);
}

//ORDERS
export async function createOrder(customerId) {
  try {
    const response = await fetch(`${ORDER_URL}/Orders/Create-Order/${customerId}`, {
      method: 'POST',
      headers: { 'Accept': 'application/json' }
    });
    if (!response.ok) throw new Error('შეკვეთის გაფორმება ვერ მოხერხდა');
    const responseText = await response.text();
    return responseText ? JSON.parse(responseText) : true;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getOrders(customerId) {
  try {
    const response = await fetch(`${ORDER_URL}/Orders/Get-Orders/${customerId}`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });
    if (!response.ok) throw new Error('შეკვეთების წამოღება ვერ მოხერხდა');
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function cancelOrder(customerId, orderId) {
  try {
    const response = await fetch(`${ORDER_URL}/Orders/Cancel-Order/${customerId}/${orderId}`, {
      method: 'POST',
      headers: { 'Accept': 'application/json' }
    });
    if (!response.ok) throw new Error('შეკვეთის გაუქმება ვერ მოხერხდა');
    const responseText = await response.text();
    return responseText ? JSON.parse(responseText) : true;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

//ADMIN
export async function adminLoginCheck(username, password) {
  try {
    const response = await fetch(`${USER_URL}/Auth/Admin-Login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });

    if (!response.ok) throw new Error('ადმინისტრატორის მონაცემები არასწორია');
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getJwtToken(username, password) {
  try {
    const response = await fetch(`${USER_URL}/Auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });

    if (!response.ok) throw new Error('ტოკენის მიღება ვერ მოხერხდა');
    
    const responseText = await response.text();
    try {
      const data = JSON.parse(responseText);
      return data.token || data;
    } catch {
      return responseText;
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}