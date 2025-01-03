import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getDatabase, ref, onValue, remove } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-database.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";

import firebaseConfig from './firebaseConfig.js';

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);

let encodedEmail;
// document.addEventListener('DOMContentLoaded', () => {
const nameuser1 = document.getElementById("nameuser1");
const avtUser1 = document.getElementById("avt_user1");


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

    // onValue(ref(database, `${encodedEmail}/devices`), (snapshot) => {
    //   // Id_device = snapshot.val();
    //   // handleIdDeviceUpdate(Id_device);
    // });
    function deleteDeviceByKey(key) {
      const deviceRef = ref(database, `${encodedEmail}/devices/${key}`);
      const typeRef = ref(database, `${key}`);
      remove(deviceRef),
      remove(typeRef)
        .then(() => {
          // console.log(`Device with key ${key} deleted successfully.`);
          location.reload();
        })
        .catch((error) => {
          console.error(`Failed to delete device with key ${key}: ${error.message}`);
        });
    }

    onValue(ref(database, `${encodedEmail}/devices`), (snapshot) => {
      const devices = snapshot.val(); // Lấy dữ liệu từ snapshot
      const container = document.getElementById('id'); // Thay 'container' bằng id của phần tử chứa các phần tử analyse

      // //"Add Device"
      // const addDeviceDiv = document.createElement('div');
      // addDeviceDiv.classList.add('add-device'); //class
      // // Tạo button "Add Device"
      // const addDeviceButton = document.createElement('button');
      // addDeviceButton.innerText = "Add Device";
      // // addDeviceButton.classList.add('add-button');
      // addDeviceButton.onclick = function() {
      //   window.location.href = 'add_devices.html';
      // };
      // addDeviceDiv.appendChild(addDeviceButton); //button
      // container.appendChild(addDeviceDiv); // Thêm vào container

      if(devices == null){
        const aler = document.createElement('h2');
        aler.innerText = "Add more devices - Always by your side";
        document.getElementById('find').appendChild(aler);
        const image = document.createElement('img');
        image.src = 'img/logo_1.png';
        document.getElementById('img1').appendChild(image);
        // console.log("1")
      } else {
        document.getElementById('find').remove();
        document.getElementById('img1').remove();
      }
      // Lặp qua các khóa và giá trị trong devices
      for (const key in devices) {
          const value = devices[key];
  
          // Tạo phần tử HTML tương ứng
          const analyseDiv = document.createElement('div');
          analyseDiv.classList.add('analyse');
  
          const presentDiv = document.createElement('div');
          presentDiv.classList.add('Present');
  
          const statusDiv = document.createElement('div');
          statusDiv.classList.add('status');
  
          const infoDiv = document.createElement('div');
          infoDiv.classList.add('info');
  
          const idHeading = document.createElement('h3');
          idHeading.id = 'id_device';
          idHeading.innerText = "ID Device: " + key;
          
          const nameHeading = document.createElement('h3');
          nameHeading.id = 'id_name';
          nameHeading.innerText = "Name Device: " + value;

          const typeHeading = document.createElement('h3');
          onValue(ref(database, `${key}/type`), (snapshot) => {
            const type = snapshot.val();
            if (type === 'elic'){
              typeHeading.id = 'id_type';
              typeHeading.innerText = "Name Device: Electricity";
              // nameHeading.addEventListener('click', function () {
              //   window.location.href = 'analytics_en.html';
              // });
            }else if (type === 'wt') {
              typeHeading.id = 'id_type';
              typeHeading.innerText = "Name Device: Water";
              // nameHeading.addEventListener('click', function () {
              //   window.location.href = 'w_meter_test.html';
              // });
            }else{
              typeHeading.id = 'id_type';
              typeHeading.innerText = "Name Device: ";
            }
          });

          const deleteButton = document.createElement('button');
          deleteButton.innerText = 'Delete';
          deleteButton.dataset.key = key;

          deleteButton.addEventListener('click', function() {
            const keyToDelete = this.dataset.key;
            deleteDeviceByKey(keyToDelete);
          });
  
          infoDiv.appendChild(idHeading);
          infoDiv.appendChild(nameHeading);
          infoDiv.appendChild(typeHeading);
          infoDiv.appendChild(deleteButton);
          statusDiv.appendChild(infoDiv);
          presentDiv.appendChild(statusDiv);
          analyseDiv.appendChild(presentDiv);

          // Thêm sự kiện click vào analyseDiv để chuyển trang
          analyseDiv.addEventListener('click', function() {
            if (typeHeading.innerText === "Name Device: Electricity") {
              // window.location.href = 'analytics_en.html';
              window.location.href = `statistics_e.html?id=${key}`;
            } else if (typeHeading.innerText === "Name Device: Water") {
              window.location.href = `statistics_w.html?id=${key}`;
            } else {
              alert("This device type is not defined.");
            }
          });
  
          // Thêm phần tử HTML vào vị trí mong muốn trong trang web
          container.appendChild(analyseDiv);
        }

      //"Add Device"
      const addDeviceDiv = document.createElement('div');
      addDeviceDiv.classList.add('add-device'); //class
      // Tạo button "Add Device"
      const addDeviceButton = document.createElement('button');
      addDeviceButton.innerText = "Add Device";
      // addDeviceButton.classList.add('add-button');
      addDeviceButton.onclick = function() {
        window.open('add_devices.html', '_blank');
      };
      addDeviceDiv.appendChild(addDeviceButton); //button
      container.appendChild(addDeviceDiv); // Thêm vào container

    });
  }
});
// });
// function handleIdDeviceUpdate(value) {

// }

function generateRandomString(length = 4) {
  const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'; // Tập ký tự (chữ cái và số)
  let randomString = '';
  const array = new Uint8Array(length);

  // Tạo mảng ngẫu nhiên
  window.crypto.getRandomValues(array);

  // Chuyển mảng ngẫu nhiên thành chuỗi ký tự
  array.forEach((value) => {
      randomString += characters[value % characters.length];
  });

  return randomString;
}

console.log(generateRandomString(4));


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




