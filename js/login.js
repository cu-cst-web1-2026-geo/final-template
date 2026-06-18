const loginForm = document.getElementById('login-form');
const feedback = document.getElementById('login-feedback');

loginForm.addEventListener('submit', function (e) {
  e.preventDefault();

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();

  // საბაზისო ვალიდაცია JavaScript-ით
  if (!email || !password) {
    showFeedback('გთხოვთ შეავსოთ ყველა ველი!', 'error');
    return;
  }

  if (password.length < 6) {
    showFeedback('პაროლი უნდა შედგებოდეს მინიმუმ 6 სიმბოლოსგან!', 'error');
    return;
  }

  // წარმატებული ავტორიზაცია
  showFeedback('ავტორიზაცია წარმატებულია! გადამისამართება...', 'success');
  
  // ვინახავთ მომხმარებლის ელ-ფოსტას მეხსიერებაში
  localStorage.setItem('user', email);

  // გადამისამართება index.html-ზე 1 წამის შემდეგ, რათა მომხმარებელმა მოასწროს წარმატების შეტყობინების დანახვა
  setTimeout(() => {
    window.location.href = 'index.html';
  }, 1000);
});

function showFeedback(message, type) {
  feedback.textContent = message;
  feedback.hidden = false;
  
  if (type === 'error') {
    feedback.className = 'form-feedback form-feedback--error';
  } else {
    feedback.className = 'form-feedback form-feedback--success';
  }
}