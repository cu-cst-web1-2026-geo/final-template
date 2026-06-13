const signingBtn = document.getElementById('log-in-out');

const isAuthorized = document.cookie.split('; ').some(row => row.startsWith('authorized=true'));

if (isAuthorized) {
  signingBtn.innerText = "გამოსვლა";
}