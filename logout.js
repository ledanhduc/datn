import { getAuth } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";

const auth = getAuth();

document.addEventListener('DOMContentLoaded', () => {
  const logoutBtn = document.querySelector(".logout");

  if (logoutBtn) { //nếu phần tử tồn tại
    logoutBtn.addEventListener("click", () => {
      auth.signOut().then(() => {
        window.location.replace("login.html");
      });
    });
  }
});
