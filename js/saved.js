import { getSaved, setSaved } from './api.js';

// DOM ელემენტები
const savedGrid = document.getElementById('saved-grid');
const loadingMsg = document.getElementById('loading-msg');
const errorMsg = document.getElementById('error-msg');
const emptyMsg = document.getElementById('empty-msg');
const navUser = document.getElementById('nav-user');
const logoutBtn = document.getElementById('logout-btn');

// ბარათის შექმნა
function createSavedCard(country) {
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

  const removeBtn = document.createElement('button');
  removeBtn.className = 'card__save-btn';
  removeBtn.textContent = 'წაშლა';
  removeBtn.type = 'button';

  // Closure — handler "ახსოვს" რომელ ქვეყანას ეკუთვნის
  removeBtn.addEventListener('click', () => {
    const current = getSaved();
    const updated = current.filter(c => c.codes.alpha_3 !== country.codes.alpha_3);
    setSaved(updated);
    renderSavedCountries();
  });

  card.appendChild(flag);
  card.appendChild(name);
  card.appendChild(population);
  card.appendChild(region);
  card.appendChild(removeBtn);

  return card;
}

// გრიდის რენდერი
function renderSavedCountries() {
  const saved = getSaved();

  savedGrid.innerHTML = '';
  emptyMsg.hidden = true;
  errorMsg.hidden = true;

  if (saved.length === 0) {
    emptyMsg.hidden = false;
    return;
  }

  saved.forEach(country => {
    const card = createSavedCard(country);
    savedGrid.appendChild(card);
  });
}

// Logout
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
renderSavedCountries();
