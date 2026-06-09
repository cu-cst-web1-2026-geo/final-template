import { fetchData, getSaved, setSaved } from './api.js';

document.getElementById('nav-user').textContent = localStorage.getItem('user') || '';

document.getElementById('logout-btn').addEventListener('click', () => {
  localStorage.removeItem('user');
  document.cookie = 'authorized=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/';
  window.location.href = 'login.html';
});

// --- სტეიტი ---
// შეინახე მდგომარეობა ობიექტების მასივში
let savedItems = getSaved();

function showLoading() {}

function showError(message) {}

function renderResults(items) {
  // თითოეული item-ისთვის შექმენი ბარათის ელემენტი
  // forEach-ის შიგნით handler ხურავს item-ზე — ეს შენი closure-ია
  items.forEach(item => {
    const card = document.createElement('article');
    // ბარათის შიგთავსი აქ
    document.getElementById('results-grid').appendChild(card);
  });
}

document.getElementById('search-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  // ვალიდაცია, showLoading/showError გამოძახება, fetchData, renderResults
});

import { getAllProducts } from './api.js';

const productContainer = document.querySelector('#product-grid');

async function init() {
    const productContainer = document.querySelector('#product-grid');
    const loadingMsg = document.querySelector('#loading-msg');
    const errorMsg = document.querySelector('#error-msg');

    try {
        loadingMsg.hidden = false;
        errorMsg.hidden = true;
        productContainer.innerHTML = '';

        const products = await getAllProducts();
        
        loadingMsg.hidden = true;

        if (products.length === 0) {
            productContainer.innerHTML = '<p>Products not found.</p>';
            return;
        }

        products.forEach(product => {
            const card = document.createElement('article');
            card.className = 'product-card';
            card.innerHTML = `
                <h3>${product.name}</h3>
                <p>ფასი: ${product.price} ₾</p>
            `;
            productContainer.appendChild(card);
        });
    } catch (err) {
        loadingMsg.hidden = true;
        errorMsg.hidden = false;
        errorMsg.textContent = "Server is unavailable";
    }
}

init();