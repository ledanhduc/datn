import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getDatabase, ref as databaseRef, onValue } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-database.js";
import { getAuth, onAuthStateChanged, reauthenticateWithCredential, updatePassword, EmailAuthProvider } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBsUW2NzEFYcgc32BN0yWdbFKUKxSvgmdI",
  authDomain: "sendopt-20057.firebaseapp.com",
  databaseURL: "https://sendopt-20057-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "sendopt-20057",
  storageBucket: "sendopt-20057.appspot.com",
  messagingSenderId: "160375474039",
  appId: "1:160375474039:web:cff60b027beaf046194372"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);
const user = auth.currentUser;
let encodedEmail;

const avtUser = document.getElementById("avt_user");
const avtUser1 = document.getElementById("avt_user1");

const chpassword = document.getElementById("chpassword");
const nameuser = document.getElementById("nameuser");
const nameuser1 = document.getElementById("nameuser1");
const emaildisp = document.getElementById("emailuser");
const oldpassword = document.getElementById("old_pass");
const newpassword = document.getElementById("new_pass");


chpassword.addEventListener('click', function() {
  // Lắng nghe sự thay đổi trạng thái xác thực người dùng
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // Lấy mật khẩu cũ từ input (old_pass) và mật khẩu mới (new_pass)
      const oldPassword = oldpassword.value;
      const newPassword = newpassword.value;

      // Tạo đối tượng credential với email và mật khẩu cũ
      const credential = EmailAuthProvider.credential(user.email, oldPassword);

      // Tiến hành tái xác thực với thông tin xác thực cũ
      reauthenticateWithCredential(user, credential)
        .then(() => {
          // Nếu tái xác thực thành công, cập nhật mật khẩu mới
          updatePassword(user, newPassword)
            .then(() => {
              // Hiển thị thông báo thành công (có thể là một dialog, toast, alert...)
              alert('Mật khẩu đã được thay đổi thành công!');
            })
            .catch((error) => {
              // Xử lý lỗi khi cập nhật mật khẩu
              console.error('Có lỗi xảy ra khi cập nhật mật khẩu:', error);
              alert('Cập nhật mật khẩu không thành công. Vui lòng thử lại.');
            });
        })
        .catch((error) => {
          // Xử lý lỗi khi tái xác thực không thành công
          console.error('Lỗi khi tái xác thực:', error);
          alert('Mật khẩu cũ không đúng. Vui lòng kiểm tra lại.');
        });
    }
  });
});


onAuthStateChanged(auth, (user) => {  
  if (user) {
    encodedEmail = encodeURIComponent(user.email.replace(/[.@]/g, '_'));
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
