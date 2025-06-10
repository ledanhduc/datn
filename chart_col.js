import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getDatabase, ref, get, set, onValue, onChildAdded, child, orderByChild, startAt, endAt, remove } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-database.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";


import firebaseConfig from './firebaseConfig.js';


const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);

const idDevice = new URLSearchParams(window.location.search).get('id');

let encodedEmail;
// let Id_device;

let globalDeviceName = null;
const deviceReadyEvent = new Event('deviceReady');

function checkAndUpdateChart() {
    if (globalDeviceName && globalDeviceName !== 'undef') {
        updateChart(globalDeviceName);
    }
}

onAuthStateChanged(auth, (user) => {
  if (user) {
    encodedEmail = encodeURIComponent(user.email.replace(/[.@]/g, '_'));
    get(ref(database, `${encodedEmail}/devices`)).then((snapshot) => {
        const devices = snapshot.val();
        if (devices.hasOwnProperty(idDevice)) {
          // const deviceName = devices[idDevice];
          globalDeviceName = devices[idDevice];
          window.dispatchEvent(deviceReadyEvent);
          ShowValueChart(idDevice);
        } else {
          alert("Device not found.");
        }
    })
    // onValue(ref(database, `${encodedEmail}/devices`), (snapshot) => {
    //   // console.log(devices[idDevice]);
    //   const devices = snapshot.val(); // Các thiết bị của người dùng
    //   if (devices.hasOwnProperty(idDevice)) {
    //       globalDeviceName = devices[idDevice];
    //       window.dispatchEvent(deviceReadyEvent);
    //       ShowValueChart(idDevice, globalDeviceName);
    //     } else {
    //       alert("Device not found.");
    //     }
    // });
  }
});

window.addEventListener('DOMContentLoaded', () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const todayStr = `${yyyy}-${mm}-${dd}`;
    
    const dateInput = document.getElementById('selectedDate');
    dateInput.value = todayStr;
    selectedDate = `${parseInt(dd)}/${parseInt(mm)}`;

    // Gán tháng mặc định cho input month
    document.getElementById('selectedMonth').value = `${yyyy}-${mm}`;
    selectedMonth = parseInt(mm);
    checkAndUpdateChart()
});

let ctx;
let myChart;
let rawData = [];
let mode = 'hour'; // chế độ mặc định
let selectedDate = '';    // dạng "dd/mm"
let selectedMonth = 0;    // số nguyên (1–12)


// DOMContentLoaded: Gán giá trị mặc định cho ngày và tháng
window.addEventListener('DOMContentLoaded', () => {
  const today = new Date();

  // Gán ngày mặc định cho input date
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  document.getElementById('selectedDate').value = `${yyyy}-${mm}-${dd}`;
  selectedDate = `${parseInt(dd)}/${parseInt(mm)}`;

  // Gán tháng mặc định cho input month
  document.getElementById('selectedMonth').value = `${yyyy}-${mm}`;
  selectedMonth = parseInt(mm);

  checkAndUpdateChart(globalDeviceName)
});

// Bắt sự kiện thay đổi chế độ hiển thị (theo giờ / ngày)
document.querySelectorAll('input[name="mode"]').forEach(input => {
  input.addEventListener('change', () => {
    mode = input.value;

    // Hiện tháng nếu là "day", hiện ngày nếu là "hour"
    document.getElementById('monthSelector').style.display = (mode === 'day') ? 'inline-block' : 'none';
    document.getElementById('dateSelector').style.display = (mode === 'hour') ? 'inline-block' : 'none';

    checkAndUpdateChart(globalDeviceName)
  });
});


// Bắt sự kiện chọn ngày (cho chế độ "theo giờ")
document.getElementById('selectedDate').addEventListener('change', (e) => {
  const date = new Date(e.target.value);
  selectedDate = `${date.getDate()}/${date.getMonth() + 1}`;
  checkAndUpdateChart(globalDeviceName)
});

// Bắt sự kiện chọn tháng (cho chế độ "theo ngày")
document.getElementById('selectedMonth').addEventListener('change', (e) => {
  const date = new Date(e.target.value);
  selectedMonth = date.getMonth() + 1; // từ 0–11 nên cần +1
  checkAndUpdateChart(globalDeviceName)
});

// Hàm lấy và xử lý dữ liệu từ Firebase
function ShowValueChart(deviceId) {
  const energyRef = ref(database, `${deviceId}/chart_power`);
  
  onValue(energyRef, (snapshot) => {
    const dataObj = snapshot.val();
    rawData = [];

    for (let key in dataObj) {
      const item = dataObj[key];
      rawData.push({
        time: item.time,
        power: item.power,
        day: item.day,
        month: item.month,
        date: `${item.day}/${item.month}`
      });
    }
    updateChart(); // render biểu đồ khi có dữ liệu
  });
}

// Cập nhật lại biểu đồ theo chế độ hiển thị
function updateChart() {
  let labels = [];
  let energyValues = [];
  if (mode === 'hour') {
    // Biểu đồ theo giờ của ngày đã chọn
    const hourly = Array.from({ length: 24 }, () => ({ total: 0, count: 0 }));

    rawData.forEach(item => {
      if (item.date === selectedDate) {
        const hour = parseInt(item.time.split(':')[0], 10);
        hourly[hour].total += item.power;
        hourly[hour].count++;
      }
    });

    labels = hourly.map((_, i) => `${i}:00`);
    energyValues = hourly.map(h => h.count > 0 ? h.total / h.count : 0);

  } else if (mode === 'day') {
    // Biểu đồ theo ngày của tháng đã chọn
    const grouped = {};

    rawData.forEach(item => {
      if (parseInt(item.month) === selectedMonth) {
        const key = `${item.day}/${item.month}`;
        if (!grouped[key]) grouped[key] = { total: 0, count: 0 };
        grouped[key].total += item.power;
        grouped[key].count++;
      }
    });

    labels = Object.keys(grouped);
    energyValues = Object.values(grouped).map(g => g.total / g.count);
  }
  drawChart(labels, energyValues);
}

// Hàm vẽ hoặc cập nhật biểu đồ
function drawChart(labels, energyValues) {
  if (!ctx) {
    ctx = document.getElementById('myChart').getContext('2d');
  }


  if (myChart) {
    myChart.data.labels = labels;
    myChart.data.datasets[0].data = energyValues;
    myChart.update();
  } else {
    myChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Power (W)',
          data: energyValues,
          backgroundColor: 'rgba(75, 192, 192, 1)'
        }]
      },
      options: {
          plugins: {
            title: {
              display: true,
              text: `ID: ${idDevice} - ${globalDeviceName}`,
              align: 'end',
              font: {
                size: 16
              },
            },
            legend: {
              position: 'chartArea',
              align: 'start', 
            }
          },
          scales: {
            x: {
              grid:{
                color: '#DADBDF'
              }
            },
            y: {
              grid:{
                color: '#DADBDF'
              },
              beginAtZero: true
            }
          }
        }
    });
  }
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



