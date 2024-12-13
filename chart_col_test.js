import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getDatabase, ref, set, onValue, onChildAdded, child, orderByChild, startAt, endAt, get, remove } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-database.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";


import firebaseConfig from './firebaseConfig.js';


const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);

let encodedEmail;
// const nameuser1 = document.getElementById("nameuser1");
// const avtUser1 = document.getElementById("avt_user1");

let Id_device;
var curenergy;
onAuthStateChanged(auth, (user) => {
  if (user) {
    encodedEmail = encodeURIComponent(user.email.replace(/[.@]/g, '_'));
    // onValue(ref(database, `${encodedEmail}/avt_img`), (snapshot) => {
    //   avtUser1.src = snapshot.val();
    // });
    // nameuser1.innerHTML = user.displayName;
    // console.log(user.displayName);

    onValue(ref(database, `${encodedEmail}/Id_Device`), (snapshot) => {
      Id_device = snapshot.val();
      const curenergyRef = ref(database, `${Id_device}/Energy`);
      onValue(curenergyRef, (snapshot) => {
        curenergy = snapshot.val();
        handleIdDeviceUpdate(Id_device, curenergy);
      });
      // console.log(curenergy)
      const chartEnergyRef = ref(database, `${Id_device}/chart_energy`);
      onValue(chartEnergyRef, (snapshot) => {
        handleIdDeviceUpdate(Id_device, curenergy);
      });
    });
  }
});





// function handleIdDeviceUpdate(value) {
//   console.log(value)
  
//   const curenergyRef = ref(database, `${value}/Energy`);
//   var curenergy;
//   onValue(curenergyRef, (snapshot) => {
//     curenergy = snapshot.val();
//   });

//   const energyRef = ref(database, `${value}/chart_energy`);

//   // onValue(energyRef, (snapshot) => {
//   //   var data = [];
//   //   snapshot.forEach((childSnapshot) => {
//   //     var childData = childSnapshot.val();
//   //     data.push(childData);
//   //   });

//   //   var energyValues = data.map(item => item.energy);

//   //   // Biểu đồ cột
//   //   var ctx = document.getElementById('myChart').getContext('2d');
//   //   var myChart = new Chart(ctx, {
//   //     type: 'bar',
//   //     data: {
//   //       labels: data.map(item => item.date),
//   //       datasets: [{
//   //         label: 'Energy',
//   //         data: energyValues,
//   //         backgroundColor: 'blue'
//   //       }]
//   //     },
//   //     options: {}
//   //   });

//   // });

//   // onValue(energyRef, (snapshot) => {
//   //   var data = [];
//   //   snapshot.forEach((childSnapshot) => {
//   //     var childData = childSnapshot.val();
//   //     data.push(childData);
//   //   });
  
//   //   var energyValues = data.map(item => item.energy);
  
//   //   // Tính toán sự khác biệt giữa energy ngày 11/12 và energy ngày 10/12
//   //   var energyDifference = data[1].energy - data[0].energy;
  
//   //   // Thay đổi giá trị của cột ngày 10/12
//   //   energyValues[0] = energyDifference;
  
//   //   // Biểu đồ cột
//   //   var ctx = document.getElementById('myChart').getContext('2d');
//   //   var myChart = new Chart(ctx, {
//   //     type: 'bar',
//   //     data: {
//   //       labels: data.map(item => item.date),
//   //       datasets: [{
//   //         label: 'Energy',
//   //         data: energyValues,
//   //         backgroundColor: 'blue'
//   //       }]
//   //     },
//   //     options: {}
//   //   });
//   // });

//   // onValue(energyRef, (snapshot) => {
//   //   var data = [];
//   //   snapshot.forEach((childSnapshot) => {
//   //     var childData = childSnapshot.val();
//   //     data.push(childData);
//   //   });
  
//   //   var energyValues = data.map(item => item.energy);
  
//   //   for (var i = 1; i < data.length; i++) {
//   //     var energyDifference = data[i].energy - data[i-1].energy;
//   //     energyValues[i-1] = energyDifference;
//   //   }
  
//   //   // Biểu đồ cột
//   //   var ctx = document.getElementById('myChart').getContext('2d');
//   //   var myChart = new Chart(ctx, {
//   //     type: 'bar',
//   //     data: {
//   //       labels: data.map(item => item.date),
//   //       datasets: [{
//   //         label: 'Energy',
//   //         data: energyValues,
//   //         backgroundColor: 'blue'
//   //       }]
//   //     },
//   //     options: {}
//   //   });
//   // });
//   onValue(energyRef, (snapshot) => {
//     var data = [];
//     snapshot.forEach((childSnapshot) => {
//       var childData = childSnapshot.val();
//       data.push(childData);
//     });
  
//     var energyValues = data.map(item => item.energy);
  
//     for (var i = 1; i < data.length; i++) {
//       var energyDifference = data[i].energy - data[i-1].energy;
//       energyValues[i-1] = energyDifference;
//     }
  
//     // Xử lý trường hợp cuối cùng
//     var lastEnergyIndex = data.length - 1;

//     var lastEnergyDifference = curenergy - data[lastEnergyIndex].energy;
//     energyValues[lastEnergyIndex] = lastEnergyDifference;
  
//     // Biểu đồ cột
//     var ctx = document.getElementById('myChart').getContext('2d');
//     var myChart = new Chart(ctx, {
//       type: 'bar',
//       data: {
//         labels: data.map(item => item.date),
//         datasets: [{
//           label: 'Energy',
//           data: energyValues,
//           backgroundColor: 'blue'
//         }]
//       },
//       options: {}
//     });
//   });
// }

/////////////////////// ok /////////////////////////////////////

// function handleIdDeviceUpdate(value,curenergy) {
//   console.log(value)
  
//   // var energyValues;

//   const energyRef = ref(database, `${value}/chart_energy`);
//   onValue(energyRef, (snapshot) => {
//     var data = [];
//     snapshot.forEach((childSnapshot) => {
//       var childData = childSnapshot.val();
//       data.push(childData);
//     });

//     var energyValues = data.map(item => item.energy);

//     for (var i = 1; i < data.length; i++) {
//       var energyDifference = data[i].energy - data[i-1].energy;
//       energyValues[i-1] = energyDifference;
//     }

//     // Xử lý trường hợp cuối cùng
//     var lastEnergyIndex = data.length - 1;

//     var lastEnergyDifference = curenergy - data[lastEnergyIndex].energy;
//     console.log(curenergy)
//     energyValues[lastEnergyIndex] = lastEnergyDifference;
  
//     // Biểu đồ cột
//     var ctx = document.getElementById('myChart').getContext('2d');
//     var myChart = new Chart(ctx, {
//       type: 'bar',
//       data: {
//         labels: data.map(item => item.date),
//         datasets: [{
//           label: 'Energy',
//           data: energyValues,
//           backgroundColor: 'rgba(75, 192, 192, 1)'
//         }]
//       },
//       options: {
//         plugins: {
//           title: {
//             display: true,
//             text: 'Biểu đồ năng lượng - kWH',
//             align: 'center',
//             font: {
//               size: 16
//             }
//           },
//           legend: {
//             position: 'chartArea',
//             align: 'start', 
//           }
//         },
//         scales: {
//           x: {
//             grid:{
//               color: '#DADBDF'
//             }
//           },
//           y: {
//             grid:{
//               color: '#DADBDF'
//             },
//             beginAtZero: true
//           }
//         }
//       }
//     });
//   });
// }

/////////////////////// ok /////////////////////////////////////
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

    var energyValues = data.map(item => item.energy);

    for (var i = 1; i < data.length; i++) {
      var energyDifference = data[i].energy - data[i-1].energy;
      energyValues[i-1] = energyDifference;
    }

    var lastEnergyIndex = data.length - 1;
    var lastEnergyDifference = curenergy - data[lastEnergyIndex].energy;
    energyValues[lastEnergyIndex] = lastEnergyDifference;

    if (!ctx) {
      ctx = document.getElementById('myChart').getContext('2d');
    }

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
              // text: 'Biểu đồ năng lượng - kWH',
              text: 'Daily Energy Chart - kWH',
              // text: `${Id_device}`,
              align: 'center',
              font: {
                size: 16
              }
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



