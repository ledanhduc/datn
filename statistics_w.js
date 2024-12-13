import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getDatabase, ref, set, get, onValue } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-database.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";


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
const auth = getAuth();

const currentUrl = window.location.href;
const idDevice = new URLSearchParams(window.location.search).get('id');

let encodedEmail;
const nameuser1 = document.getElementById("nameuser1");
const avtUser1 = document.getElementById("avt_user1");
// let Id_device ;
const id_st = document.getElementById("st_id");
// Lấy ngày hiện tại
var today = new Date();
var currentMonth = today.getMonth() + 1; // Tháng hiện tại (JavaScript sử dụng chỉ số tháng từ 0-11)
var currentDay = today.getDate(); // Ngày hiện tại


// const id_device_1 = document.getElementById("id_device");
onAuthStateChanged(auth, (user) => {  
  if (user) {
    encodedEmail = encodeURIComponent(user.email.replace(/[.@]/g, '_'));
    onValue(ref(database, `${encodedEmail}/avt_img`), (snapshot) => {
      if(snapshot.val()!=null){
        avtUser1.src = snapshot.val();
      }
    });
    nameuser1.innerHTML = user.displayName;
    console.log(user.displayName);

    onValue(ref(database, `${encodedEmail}/devices`), (snapshot) => {
      const devices = snapshot.val();
      if (devices && devices[idDevice]) { 

        id_st.innerText = "ID: " + idDevice + " - " + `${devices[idDevice]}`;
        handleIdDeviceUpdate(idDevice); //cập nhật thông tin thiết bị
        
      } else {
        alert("Device not found.");
      }
    }); 
  }
});


function handleIdDeviceUpdate(value) {
  updateLinkHrefs(pageLinks_w, currentUrl, idDevice, value);
  //select tháng
  const selectMonthElement = document.getElementById("month");
  selectMonthElement.innerHTML = "";

  const defaultMonthOption = document.createElement("option");
  const defaultMonth = currentMonth === 1 ? 12 : currentMonth; // Nếu là tháng 1 thì chọn 12
  defaultMonthOption.text = defaultMonth;
  defaultMonthOption.value = defaultMonth;
  defaultMonthOption.selected = true;
  selectMonthElement.appendChild(defaultMonthOption);

  for (let i = 1; i < currentMonth; i++) {
    const monthOption = document.createElement("option");
    monthOption.value = i;
    monthOption.text = i;
    selectMonthElement.appendChild(monthOption);
  }

  //select ngày
  const selectDayElement = document.getElementById("day");
  selectDayElement.innerHTML = "";

  const defaultDayOption = document.createElement("option");
  defaultDayOption.text = currentDay;
  defaultDayOption.value = currentDay;
  defaultDayOption.selected = true;
  selectDayElement.appendChild(defaultDayOption);

  for (let i = 1; i <= currentDay; i++) {
    const dayOption = document.createElement("option");
    dayOption.value = i;
    dayOption.text = i;
    selectDayElement.appendChild(dayOption);
  }

  //hiển thị tháng
  function displayMonth() {
    const month = $('#month').val();
    // console.log("Bạn đã chọn tháng: " + month);

    onValue(ref(database, `${value}/monthly`), (snapshot) => {
      const mthKey = snapshot.val();
      if (mthKey && mthKey[month]) {
        document.getElementById("img1").src = "data:image/png;base64," + mthKey[month];
        document.getElementById("mthly_time").innerHTML = mthKey[`${month}_time`];
        document.getElementById("mthly_result").innerHTML = mthKey[`${month}_result`];
      } else {
        document.getElementById("img1").src = "img/galary.png";
        document.getElementById("mthly_time").innerHTML = "Not found";
      }

    });
  }

  //hiển thị ngày
  function displayDay() {
    const day = $('#day').val();
    // console.log("Bạn đã chọn ngày: " + day);

    onValue(ref(database, `${value}/daily`), (snapshot) => {
      const dailyKey = snapshot.val();
      if (dailyKey && dailyKey[day]) {
        document.getElementById("img2").src = "data:image/png;base64," + dailyKey[day];
        document.getElementById("daily_time").innerHTML = dailyKey[`${day}_time`];
        document.getElementById("daily_result").innerHTML = dailyKey[`${day}_result`];
      } else {
        document.getElementById("img2").src = "img/galary.png";
        document.getElementById("daily_time").innerHTML = "Not found";
      }
    });
  }

  //Select2
  $(document).ready(function () {
    $('#month').select2().on('change', displayMonth);
    $('#day').select2().on('change', displayDay);
  });

  //hàm hiển thị dữ liệu mặc định
  displayMonth();
  displayDay();
}



onAuthStateChanged(auth, (user) => {
  if (user) {
    const uid = user.uid;
  } else {
    window.location.replace("login.html")
  }
});

// var userRead =  sessionStorage.getItem('userses') || localStorage.getItem('user');
// if (userRead === null) {
//     try {
//         auth.signOut();
//     }
//     catch(error){
//         console.error(error);
//       };
// }

var userRead = sessionStorage.getItem('userses') || localStorage.getItem('user');
if (userRead === null) {
    try {
        auth.signOut();
        window.location.replace("login.html"); // Chuyển hướng trở lại trang đăng nhập
    } catch(error) {
        console.error(error);
    }
}