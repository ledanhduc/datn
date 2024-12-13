import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getDatabase, ref, onValue, set, get, onChildAdded, onChildChanged, child } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-database.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";

import firebaseConfig from './firebaseConfig.js';


const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);

const currentUrl = window.location.href;
const idDevice = new URLSearchParams(window.location.search).get('id');

let encodedEmail;
const nameuser1 = document.getElementById("nameuser1");
const avtUser1 = document.getElementById("avt_user1");
const id_st = document.getElementById("st_id");

var today = new Date();
var currentMonth = today.getMonth() + 1; // JavaScript sử dụng chỉ số tháng từ 0-11

let tier_6;
let fee;

onAuthStateChanged(auth, (user) => {  
  if (user) {
    encodedEmail = encodeURIComponent(user.email.replace(/[.@]/g, '_'));
    onValue(ref(database, `${encodedEmail}/avt_img`), (snapshot) => {
      avtUser1.src = snapshot.val();
    });
    nameuser1.innerHTML = user.displayName;
    console.log(user.displayName);

    onValue(ref(database, `${encodedEmail}/devices`), (snapshot) => {
      const devices = snapshot.val(); // Các thiết bị của người dùng
      if (devices && devices[idDevice]) { // Kiểm thiết bị có tồn tại không
        id_st.innerText = "ID: " + idDevice + " - " + `${devices[idDevice]}`;
        handleIdDeviceUpdate(idDevice); //cập nhật thông tin thiết bị
      } else {
        alert("Device not found.");
      }
    });
  }
});

function format_m(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

function handleIdDeviceUpdate(value) {
  updateLinkHrefs(pageLinks_e, currentUrl, idDevice, value);

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
  function displayMonth() {
    const month = $('#month').val();
    onValue(ref(database, `${value}/Result_mnthly`), (snapshot) => {
      const Result_mnthly = snapshot.val(); // Các thiết bị của người dùng
      if (typeof Result_mnthly[month] !== 'undefined') {
        document.getElementById('total').value = Result_mnthly[month];
      }
      
      const feeRef = ref(database, `/fee_e`);
      onValue(feeRef, (snapshot) => {
        fee = snapshot.val();
        console.log(fee);

        const Orders1 = [
          {
            productNumber: '--',
            paymentStatus: fee,
            // current: tier_6,
          }
        ];

        let a = 'All';
        Orders1.forEach(order => {
            const tr = document.createElement('tr');
            const trContent = `
                <td>${a}</td>
                <td>${order.productNumber}</td>
                <td>${order.paymentStatus}</td>
            `;
            // a++;
            tr.innerHTML = trContent;
            document.querySelector('table tbody').appendChild(tr);
        });

        let tol_money
        const cal_money = document.getElementById('cal_total')
        cal_money.addEventListener('click', function() {
          tol_money =  Result_mnthly[month]*fee;
          document.getElementById('total_m').value = format_m(tol_money);
          set(ref(database, `/${idDevice}/payment_mnthly/${Energy_mmthly[month]}`), tol_money);
        });
      });
    });
  }
  // Select2
  $(document).ready(function () {
    $('#month').select2().on('change', displayMonth); 
  });

  displayMonth();
}


onAuthStateChanged(auth, (user) => {
  if (user) {
    const uid = user.uid;
  } else {
    window.location.replace("login_en.html")
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
        window.location.replace("login_en.html"); // Chuyển hướng trở lại trang đăng nhập
    } catch(error) {
        console.error(error);
    }
}




