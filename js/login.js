//DOM ელემენტები
const loginForm = document.getElementById('login-form');
const usernameInput = document.getElementById('username');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const countrySelect = document.getElementById('country');
const rememberCheckbox = document.getElementById('remember');
const formError = document.getElementById('form-error');
//ვალიდაციის ფუნქცია
function validateForm(username, email, password, country) {
  if (username.length < 2) {
    return 'სახელი უნდა იყოს მინიმუმ 2 სიმბოლო';
  }
  if (!email.includes('@')) {
    return 'ელ-ფოსტა არასწორია';
  }
  if (password.length < 6) {
    return 'პაროლი უნდა იყოს მინიმუმ 6 სიმბოლო';
  }
  if (country === '') {
    return 'აირჩიე რეგიონი';
  }
  return null;
}
//წარმატებული login-ის დამუშავება
function handleLoginSuccess(username, country, remember) {
  localStorage.setItem('loggedInUser', username);
  localStorage.setItem('preferredRegion', country);
  if (remember) {
    localStorage.setItem('rememberMe', 'true');
  }
  window.location.href = 'index.html';
}
//submit event
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const username = usernameInput.value.trim();
  const email = emailInput.value.trim();
  const password = passwordInput.value;
  const country = countrySelect.value;
  const remember = rememberCheckbox.checked;
  const errorText = validateForm(username, email, password, country);
  if (errorText) {
    formError.textContent = errorText;
    return;
  }
  formError.textContent = '';
  handleLoginSuccess(username, country, remember);
});
//input event შეცდომის გასუფთავება ტექსტის შეცვლისას
usernameInput.addEventListener('input', () => {
  formError.textContent = '';
});
