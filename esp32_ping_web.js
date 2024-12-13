import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-database.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";

// Import Firebase config từ file riêng của bạn
import firebaseConfig from './firebaseConfig.js';

// Khởi tạo Firebase app và các dịch vụ cần thiết
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);

// Function để tạo số ngẫu nhiên và gửi lên Firebase
function sendRandomNumber() {
  // Tạo số ngẫu nhiên từ 0 đến 999
  const randomNumber = Math.floor(Math.random() * 1000);
  const timestamp = Date.now(); // Thêm timestamp để dễ dàng xác định thời gian gửi

  // Tạo tham chiếu đến Firebase Realtime Database tại đường dẫn 'randomNumbers/{timestamp}'
  const dataRef = ref(database, 'randomNumbers/' + timestamp);

  // Gửi dữ liệu lên Firebase
  set(dataRef, {
    number: randomNumber,
    timestamp: timestamp
  })
  .then(() => {
    console.log(`Random number sent: ${randomNumber}`);
  })
  .catch((error) => {
    console.error("Error sending data to Firebase:", error);
  });
}

// // Ví dụ sử dụng hàm `sendRandomNumber` khi có sự kiện nào đó (ví dụ: người dùng nhấn nút)
// document.getElementById('sendButton').addEventListener('click', sendRandomNumber);

// Kiểm tra nếu có yêu cầu từ ESP32 (có thể từ một nút hoặc sự kiện khác)
function listenForPing() {
  // Tạo endpoint đơn giản để nhận ping từ ESP32
  window.addEventListener('message', function (event) {
    if (event.data === 'ping') {
      console.log('Received ping from ESP32');
      sendRandomNumber();
    }
  });
}

// Khởi tạo lắng nghe
listenForPing();