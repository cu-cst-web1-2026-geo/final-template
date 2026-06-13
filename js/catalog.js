import { getAllCategories, getAllProducts, getProductsByCategory, searchProducts } from './api.js';

const R2_BASE_Path = 'https://pub-c966a90ea96443f98cb7bede2669eb6f.r2.dev/';
const categoriesList = document.getElementById('categories-list');
const productsGrid = document.getElementById('products-grid');
const catalogStatus = document.getElementById('catalog-status');
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');

const isAuthorized = document.cookie.split('; ').some(row => row.startsWith('authorized=true'));

if (!isAuthorized) {
  window.location.href = 'login.html';
}

async function initCatalog() {
  try {
    showLoader();

    const [categories, products] = await Promise.all([
      getAllCategories(),
      getAllProducts()
    ]);

    renderCategories(categories);

    renderProducts(products);

    hideStatus();

  } catch (error) {
    showErrorState();
  }
}

function debounce(func, delay) {
  let timeoutId;

  return function (event) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      func(event);
    }, delay);
  };
}

async function handleSearch() {
  const name = searchInput.value.trim();
  
  if (!name) {
    try {
      showLoader();
      const products = await getAllProducts();
      renderProducts(products);
      hideStatus();
      
      document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('active'));
      document.querySelector('[data-category="all"]').classList.add('active');
    } catch (error) {
      showErrorState();
    }
    return;
  }

  try {
    showLoader();
    productsGrid.innerHTML = '';

    const filteredProducts = await searchProducts(name);
    
    renderProducts(filteredProducts);
    
    if (filteredProducts.length > 0) {
      hideStatus();
    } else {
      catalogStatus.innerHTML = `<p class="loading-text">პროდუქტი დასახელებით "${name}" ვერ მოიძებნა.</p>`;
      catalogStatus.style.display = 'block';
    }

    document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('active'));

  } catch (error) {
    showErrorState();
  }
}

searchBtn.addEventListener('click', handleSearch);

const debouncedSearch = debounce(handleSearch, 500);

searchInput.addEventListener('input', debouncedSearch);

function renderProducts(products) {
  productsGrid.innerHTML = '';

  if (products.length === 0) {
    catalogStatus.innerHTML = '<p class="loading-text">ამ კატეგორიაში პროდუქტები არ მოიძებნა.</p>';
    catalogStatus.style.display = 'block';
    return;
  }

  products.forEach(product => {
    let imagePath = 'https://via.placeholder.com/250x200?text=No+Image';

    if (product.imagePath) {
      const cleanRelativePath = product.imagePath.startsWith('/') 
        ? product.imagePath.slice(1) 
        : product.imagePath;
      
      imagePath = `${R2_BASE_Path}${cleanRelativePath}`;
    }

    let stockBadge = '';
    let isOutOfStock = product.stock <= 0;

    if (isOutOfStock) {
      stockBadge = `<span class="stock-badge out-of-stock">მარაგი ამოიწურა</span>`;
    } else {
      stockBadge = `<span class="stock-badge in-of-stock">მარაგშია: ${product.stock} ცალი</span>`;
    }

    const shortDescription = product.description && product.description.length > 60
      ? product.description.substring(0, 60) + '...'
      : product.description || 'აღწერა არ არის ხელმისაწვდომი.';

    const card = document.createElement('div');
    card.className = `product-card ${isOutOfStock ? 'disabled-card' : ''}`;
    card.innerHTML = `
      <div class="image-container">
        <img src="${imagePath}" alt="${product.name || 'პროდუქტი'}" onerror="this.onerror=null; this.src='https://via.placeholder.com/250x200?text=Image+Error';">
        ${stockBadge}
      </div>
      <div class="product-info">
        <h4>${product.name || 'უსახელო პროდუქტი'}</h4>
        <p class="product-desc">${shortDescription}</p>
        <p class="product-price">${product.price ? product.price.toFixed(2) : '0.00'} ₾</p>
        <button class="btn-add-to-cart" 
                data-id="${product.id}" 
                ${isOutOfStock ? 'disabled' : ''}>
          ${isOutOfStock ? 'მიუწვდომელია' : 'კალათაში დამატება'}
        </button>
      </div>
    `;
    
    productsGrid.appendChild(card);
  });
}

function renderCategories(categories) {
  const allBtnLi = categoriesList.querySelector('li');
  categoriesList.innerHTML = '';
  categoriesList.appendChild(allBtnLi);

  categories.forEach(category => {
    const li = document.createElement('li');
    li.innerHTML = `
      <button class="category-btn" data-category="${category.id}">${category.name}</button>
    `;
    categoriesList.appendChild(li);
  });

  setupCategoryFilters();
}

function setupCategoryFilters() {
  categoriesList.addEventListener('click', async (e) => {
    if (!e.target.classList.contains('category-btn')) return;

    const clickedBtn = e.target;
    const categoryId = clickedBtn.getAttribute('data-category');

    document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('active'));
    clickedBtn.classList.add('active');

    try {
      showLoader();
      productsGrid.innerHTML = '';

      let products;
      if (categoryId === 'all') {
        products = await getAllProducts();
      } else {
        products = await getProductsByCategory(categoryId);
      }

      renderProducts(products);
      hideStatus();

    } catch (error) {
      showErrorState();
    }
  });
}

function showLoader() {
  catalogStatus.innerHTML = '<p class="loading-text">პროდუქტები იტვირთება...</p>';
  catalogStatus.style.display = 'block';
}

function hideStatus() {
  catalogStatus.style.display = 'none';
}

function showErrorState() {
  productsGrid.innerHTML = '';
  catalogStatus.innerHTML = `
    <div class="error-container">
      <div class="error-icon">⚠️</div>
      <h3>მონაცემების ჩატვირთვა ვერ მოხერხდა</h3>
      <p>სერვერთან კავშირი დროებით შეწყდა. გთხოვთ, შეამოწმოთ ინტერნეტი და სცადოთ ხელახლა.</p>
      <button id="btn-retry" class="btn-retry">ხელახლა ცდა ↻</button>
    </div>
  `;
  catalogStatus.style.display = 'block';

  document.getElementById('btn-retry').addEventListener('click', initCatalog);
}

document.addEventListener('DOMContentLoaded', initCatalog);