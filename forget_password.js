import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
// import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-database.js";
import { getAuth, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";

import firebaseConfig from './firebaseConfig.js';

const app = initializeApp(firebaseConfig);
// const db = getDatabase(app);
const auth = getAuth(app);

const butt_fgp = document.getElementById("fgp");
const email_fgp = document.getElementById("email_fgp");
butt_fgp.addEventListener('click', function() {
    console.log(email_fgp)
    sendPasswordResetEmail(auth, email_fgp.value)
    .then(() => {
        alert('Pls check your email !');
    })
    .catch((error) => {
        const errorCode = error.code;
        // alert(errorCode)
        const errorMessage = error.message;
        alert(errorMessage)
    });
});
