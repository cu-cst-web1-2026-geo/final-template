import { CustomerRegister } from './api.js';

document.getElementById('login-form').addEventListener('submit', async (e) => {

  e.preventDefault();

  const nameInput = document.getElementById('name-input');
  const emailInput = document.getElementById('email-input');
  const passwordInput = document.getElementById('password-input'); 
  
  const nameValue = nameInput ? nameInput.value.trim() : '';
  const emailValue = emailInput ? emailInput.value.trim() : '';
  const passwordValue = passwordInput ? passwordInput.value.trim() : '';
  
  const errorEl = document.getElementById('login-error');
  const submitBtn = e.target.querySelector('button[type="submit"]');

  if (!nameValue) {
    showFeedback('გთხოვთ შეიყვანოთ სახელი.', 'error');
    nameInput.focus();
    return;
  }

  if (!emailValue) {
    showFeedback('გთხოვთ შეიყვანოთ მეილი.', 'error');
    emailInput.focus();
    return;
  }

  if (passwordInput && !passwordValue) {
    showFeedback('გთხოვთ შეიყვანოთ პაროლი.', 'error');
    passwordInput.focus();
    return;
  }

  clearFeedback();

  try {
    submitBtn.disabled = true;
    submitBtn.textContent = 'მიმდინარეობს რეგისტრაცია...';

    const registrationData = {
      username: nameValue,
      email: emailValue,
      password: passwordValue
    };

    const response = await CustomerRegister(registrationData);

    if (!response.ok) {
      if (response.status === 400) {
        throw new Error('მონაცემები არასწორადაა მითითებული');
      }
      throw new Error('სერვერზე დაფიქსირდა შეცდომა.');
    }

    const customerData = await response.json();

    showFeedback('რეგისტრაცია წარმატებულია! გადამისამართება...', 'success');

    setTimeout(() => {
      window.location.href = 'login.html';
    }, 1200);

  } catch (error) {
    console.error('Login Error:', error);
    showFeedback(error.message || 'სერვერთან კავშირი ვერ დამყარდა.', 'error');
    
    submitBtn.disabled = false;
    submitBtn.textContent = 'დაწყება →';
  }
});

function showFeedback(message, type) {
  const errorEl = document.getElementById('login-error');
  errorEl.textContent = message;
  errorEl.hidden = false;

  if (type === 'success') {
    errorEl.style.backgroundColor = 'var(--white)';
    errorEl.style.color = 'var(--burgundy-main)';
    errorEl.style.borderColor = 'var(--primary-color)';
    errorEl.style.borderLeft = '4px solid var(--primary-color)';
  } else if (type === 'error') {
    errorEl.style.backgroundColor = 'var(--burgundy-dark)';
    errorEl.style.color = 'var(--white)';
    errorEl.style.borderLeft = '4px solid var(--primary-color)';
  }
}

function clearFeedback() {
  const errorEl = document.getElementById('login-error');
  errorEl.hidden = true;
  errorEl.textContent = '';
}