import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getDatabase, ref as databaseRef, set, onValue } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-database.js";
import { getAuth, onAuthStateChanged, updateProfile } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";

import firebaseConfig from './firebaseConfig.js';

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);
const user = auth.currentUser;

let encodedEmail;

const fileInput = document.getElementById("file");
const avtUser = document.getElementById("avt_user");
const avtUser1 = document.getElementById("avt_user1");

const input = document.querySelector("input[type='file']");

input.addEventListener("click", () => {
  fileInput.click();
});

fileInput.addEventListener("change", () => {
  const file = fileInput.files[0];

  if (!file) return;

  const reader = new FileReader();

  reader.onload = (e) => {
    const image = new Image();

    image.onload = () => {
      let width = 260;
      let height = Math.floor(width / (image.width / image.height));

      if (image.width <= width) {
        width = image.width;
        height = image.height;
      }

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      canvas.width = width;
      canvas.height = height;

      ctx.drawImage(image, 0, 0, width, height);
      avtUser.src = canvas.toDataURL("image/png");
      avtUser1.src = canvas.toDataURL("image/png");
      set(databaseRef(database, `${encodedEmail}/avt_img`), canvas.toDataURL("image/png"));


    };

    image.src = e.target.result;
  };

  reader.readAsDataURL(file);
});

const uploadin4btn = document.getElementById("upin4");
const nameuser = document.getElementById("nameuser");
const nameuser1 = document.getElementById("nameuser1");
const id_user = document.getElementById("id_user");
const dob = document.getElementById("dob");
const emaildisp = document.getElementById("emailuser");
const phnumber = document.getElementById("phnumber");

uploadin4btn.addEventListener('click', function() {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      encodedEmail = encodeURIComponent(user.email.replace(/[.@]/g, '_'));
      // set(ref(database, `${encodedEmail}/nameuser`), nameuser.value);
      set(databaseRef(database, `${encodedEmail}/Id_Device`), id_user.value);
      set(databaseRef(database, `${encodedEmail}/dob`), dob.value);
      set(databaseRef(database, `${encodedEmail}/phnumber`), phnumber.value);
      
      updateProfile(auth.currentUser, {
        displayName: nameuser.value
      }).then(() => {
      }).catch((error) => {
        console.log("Lỗi cập nhật thông tin.");
      });
    } else {
      // Người dùng chưa đăng nhập
      console.log("Không có người dùng nào đang đăng nhập.");
    }
  });
});

onAuthStateChanged(auth, (user) => {  
  if (user) {
    encodedEmail = encodeURIComponent(user.email.replace(/[.@]/g, '_'));
    onValue(databaseRef(database, `${encodedEmail}/Id_Device`), (snapshot) => {
      id_user.value = snapshot.val();
    });    
    onValue(databaseRef(database, `${encodedEmail}/dob`), (snapshot) => {
      dob.value = snapshot.val();
    });
    onValue(databaseRef(database, `${encodedEmail}/phnumber`), (snapshot) => {
      phnumber.value = snapshot.val();
    });
    onValue(databaseRef(database, `${encodedEmail}/avt_img`), (snapshot) => {
      if(snapshot.val()!=null){
        avtUser.src = snapshot.val();
        avtUser1.src = snapshot.val();
      }
    });
    nameuser.value = user.displayName;
    nameuser1.innerHTML = user.displayName;
    emaildisp.value = user.email;
  }
});

onAuthStateChanged(auth, (user) => {
  if (user) {
    const uid = user.uid;
  } else {
    window.location.replace("login.html")
  }
});

var userRead =  sessionStorage.getItem('userses') || localStorage.getItem('user');
if (userRead === null) {
    try {
        auth.signOut();
    }
    catch(error){
        console.error(error);
      };
}
