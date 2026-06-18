import { fetchData, getSaved, setSaved } from './api.js';

// State
let allCountries = [];

// DOM ელემენტები
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const regionFilter = document.getElementById('region-filter');
const largeOnly = document.getElementById('large-only');
const resultsGrid = document.getElementById('results-grid');
const loadingMsg = document.getElementById('loading-msg');
const errorMsg = document.getElementById('error-msg');
const navUser = document.getElementById('nav-user');
const logoutBtn = document.getElementById('logout-btn');

// Closure debounce
function debounce(fn, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

// Loading/Error
function setLoading(isLoading) {
  loadingMsg.hidden = !isLoading;
  errorMsg.hidden = true;
}
function showError(msg) {
  errorMsg.textContent = msg;
  errorMsg.hidden = false;
  loadingMsg.hidden = true;
}

// ბარათის შექმნა
function createCard(country) {
  const saved = getSaved();
  const isSaved = saved.some(c => c.codes.alpha_3 === country.codes.alpha_3);

  const card = document.createElement('div');
  card.className = 'card';

  const flag = document.createElement('img');
  flag.src = country.flag.url_svg;
  flag.alt = `${country.names.common}-ის დროშა`;
  flag.className = 'card__flag';

  const name = document.createElement('h2');
  name.className = 'card__name';
  name.textContent = country.names.common;

  const population = document.createElement('p');
  population.className = 'card__info';
  population.textContent = `მოსახლეობა: ${country.population.toLocaleString()}`;

  const region = document.createElement('p');
  region.className = 'card__info';
  region.textContent = `რეგიონი: ${country.region}`;

  const saveBtn = document.createElement('button');
  saveBtn.className = 'card__save-btn';
  saveBtn.textContent = isSaved ? 'შენახული' : 'შენახვა';
  saveBtn.type = 'button';

  // Closure handler ახსოვს რომელ ქვეყანას ეკუთვნის
  saveBtn.addEventListener('click', () => {
    const current = getSaved();
    const exists = current.some(c => c.codes.alpha_3 === country.codes.alpha_3);
    if (exists) {
      setSaved(current.filter(c => c.codes.alpha_3 !== country.codes.alpha_3));
      saveBtn.textContent = 'შენახვა';
    } else {
      setSaved([...current, country]);
      saveBtn.textContent = 'შენახული';
    }
  });

  card.appendChild(flag);
  card.appendChild(name);
  card.appendChild(population);
  card.appendChild(region);
  card.appendChild(saveBtn);

  return card;
}

// გრიდის რენდერი
function renderGrid(countries) {
  resultsGrid.innerHTML = '';
  if (countries.length === 0) {
    resultsGrid.textContent = 'ქვეყანა ვერ მოიძებნა.';
    return;
  }
  countries.forEach(country => {
    const card = createCard(country);
    resultsGrid.appendChild(card);
  });
}

// ფილტრაცია
function filterCountries(search, region, large) {
  return allCountries.filter(c => {
    const matchName = c.names.common.toLowerCase().includes(search.toLowerCase());
    const matchRegion = region === '' || c.region === region;
    const matchLarge = !large || c.population >= 10000000;
    return matchName && matchRegion && matchLarge;
  });
}

// API-დან ჩატვირთვა
async function loadCountries() {
  setLoading(true);
  try {
    const result = await fetchData('?limit=100');
    allCountries = result.data.objects;
    renderGrid(allCountries);
  } catch (err) {
    showError('ქვეყნების ჩატვირთვა ვერ მოხერხდა. შეამოწმე ინტერნეტ კავშირი.');
  } finally {
    loadingMsg.hidden = true;
  }
}

// Events
searchForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const filtered = filterCountries(
    searchInput.value,
    regionFilter.value,
    largeOnly.checked
  );
  renderGrid(filtered);
});

searchInput.addEventListener('input', debounce(() => {
  const filtered = filterCountries(
    searchInput.value,
    regionFilter.value,
    largeOnly.checked
  );
  renderGrid(filtered);
}, 400));

regionFilter.addEventListener('change', () => {
  const filtered = filterCountries(
    searchInput.value,
    regionFilter.value,
    largeOnly.checked
  );
  renderGrid(filtered);
});

logoutBtn.addEventListener('click', () => {
  localStorage.removeItem('loggedInUser');
  window.location.href = 'login.html';
});

// Nav-ში მომხმარებლის სახელი
function loadNavUser() {
  const user = localStorage.getItem('loggedInUser');
  if (user) {
    navUser.textContent = `👤 ${user}`;
  } else {
    window.location.href = 'login.html';
  }
}

// გაშვება
loadNavUser();
loadCountries();
