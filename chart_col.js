import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getDatabase, ref, set, onValue, onChildAdded, child, orderByChild, startAt, endAt, get, remove } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-database.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";


import firebaseConfig from './firebaseConfig.js';


const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);

const idDevice = new URLSearchParams(window.location.search).get('id');

let encodedEmail;

// let Id_device;
var curenergy;
onAuthStateChanged(auth, (user) => {
  if (user) {
    encodedEmail = encodeURIComponent(user.email.replace(/[.@]/g, '_'));
    onValue(ref(database, `${encodedEmail}/devices`), (snapshot) => {
      const devices = snapshot.val(); // Các thiết bị của người dùng
        if (devices && devices[idDevice]) {
          const curenergyRef = ref(database, `${idDevice}/Energy`);
          onValue(curenergyRef, (snapshot) => {
            curenergy = snapshot.val();
            handleIdDeviceUpdate(idDevice, curenergy);
          });
          console.log(curenergy)
        } else {
          alert("Device not found.");
        }
    });
  }
});

var ctx;
var myChart;

function handleIdDeviceUpdate(value, curenergy) {
  const energyRef = ref(database, `${value}/chart_energy`);
  onValue(energyRef, (snapshot) => {
    var data = [];
    snapshot.forEach((childSnapshot) => {
      var childData = childSnapshot.val();
      data.push(childData);
    });

    var energyValues = [];
    for (var i = 1; i < data.length; i++) {
      var energyDifference = data[i].energy - data[i - 1].energy;
      energyValues.push(Math.max(energyDifference, 0)); // Đảm bảo không âm
    }

    // Xử lý giá trị cuối cùng với `curenergy`
    var lastEnergyIndex = data.length - 1;
    if (data.length > 0) {
      var lastEnergyDifference = Math.max(curenergy - data[lastEnergyIndex].energy, 0); // Đảm bảo không âm
      energyValues.push(lastEnergyDifference);
    }

    if (!ctx) {
      ctx = document.getElementById('myChart').getContext('2d');
    }

    const displayDataCount = 31;
    if (energyValues.length > displayDataCount) {
      energyValues.splice(0, energyValues.length - displayDataCount);
    }

    // console.log("curenergy:", curenergy);
    // console.log("Last data in chart_energy:", data[lastEnergyIndex]?.energy);

    if (myChart) {
      myChart.data.labels = data.map(item => item.date);
      myChart.data.datasets[0].data = energyValues;
      myChart.update();
    } else {
      myChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: data.map(item => item.date),
          datasets: [{
            label: 'Energy',
            data: energyValues,
            backgroundColor: 'rgba(75, 192, 192, 1)'
          }]
        },
        options: {
          plugins: {
            title: {
              display: true,
              text: `ID: ${idDevice} - kWH`,
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
  });
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



