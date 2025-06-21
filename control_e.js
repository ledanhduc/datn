import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getDatabase, ref, set, get, onValue, remove } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-database.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";


import firebaseConfig from './firebaseConfig.js';

import { TIME_API_URL } from './globaldef.js';

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth();

const currentUrl = window.location.href;
const idDevice = new URLSearchParams(window.location.search).get('id');

async function getVietnamTimeFromServer() {
const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), GlobalDef.TIMEOUT_API); // 5s

  try {
    const response = await fetch(GlobalDef.TIME_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      throw new Error(`Server trả về lỗi: ${response.status}`);
    }

    const data = await response.json();
    return {
      sec: data.sec,
    };
  } catch (error) {
    console.warn("Lỗi khi lấy giờ từ server, dùng giờ máy:", error.message || error);
    return {
      sec: new Date().getSeconds(),
    };
  }
}

let encodedEmail;
const nameuser1 = document.getElementById("nameuser1");
const avtUser1 = document.getElementById("avt_user1");
const id_st = document.getElementById("st_id");

onAuthStateChanged(auth, (user) => {  
  if (user) {
    encodedEmail = encodeURIComponent(user.email.replace(/[.@]/g, '_'));

    get(ref(database, `${encodedEmail}/avt_img`))
    .then((snapshot) => {
      if(snapshot.val()!=null){
        avtUser1.src = snapshot.val();
      }
    });
    nameuser1.innerHTML = user.displayName;
    // console.log(user.displayName);

    onValue(ref(database, `${encodedEmail}/devices`), (snapshot) => {
      const devices = snapshot.val(); 
      if (devices && devices[idDevice]) { 
        id_st.innerText = "ID: " + idDevice + " - " + `${devices[idDevice]}`;
        handleIdDeviceUpdate(idDevice);
      } else {
        alert("Device not found.");
      }
    });
  }
});

function toggleLamp(toggleElem, stateElem, path) {
  let parentNode = toggleElem.parentNode;
  parentNode.classList.toggle('active');
  if (parentNode.classList.contains('active')) {
    set(ref(database, path), true);
  } else {
    set(ref(database, path), false); 
  }
}

// let h_timer;
function handleIdDeviceUpdate(value) {

  updateLinkHrefs(pageLinks_e, currentUrl, idDevice, value);
  
  let lamps = [
    {toggle: document.getElementById('lamp_1_toggle'), state: document.getElementById('lamp_1_state'), path: `${value}/lamp_1_state`},
  ];
  
  lamps.forEach(function(lamp) {
    lamp.toggle.addEventListener('click', function() {
      const timestamp = new Date().toLocaleString().replace(/[/]/g, '-');
      toggleLamp(lamp.toggle, lamp.state, lamp.path);
    set(ref(database, `${value}/WebButt/${encodedEmail}/${timestamp}`), lamp.state.innerHTML);
  });
  });


  let lamps_fb = [
    {toggle: document.getElementById('lamp_1_toggle'), state: document.getElementById('lamp_1_state'), path: `${value}/lamp_1_state`},
  ];

  lamps_fb.forEach(function(lamp_fb) {
    onValue(ref(database, lamp_fb.path), function(snapshot) {
      let state = snapshot.val();
      if (state) {
        lamp_fb.toggle.parentNode.classList.add('active');
        lamp_fb.state.innerHTML = "ON";
        lamp_fb.state.style.color = "rgb(57,198,92)";
      } else {
        lamp_fb.toggle.parentNode.classList.remove('active');
        lamp_fb.state.innerHTML = "OFF";
        lamp_fb.state.style.color = "rgb(227, 4, 90)";
      }
    });
  });

  let currentSecond;
  let onlesp;
  let lastOnlineTime = 0;
  let pulseCount = 0;
  const st_cir = document.getElementById('st_cir');

  function updateUI() {
    if (currentSecond == null || onlesp == null) return;

    let timeDifference = Math.abs(currentSecond - onlesp);
    if (timeDifference > 30) {
      timeDifference = 60 - timeDifference;
    }

    // console.log(`currentSecond: ${currentSecond}`);
    // console.log(`lastOnlineTime previous: ${lastOnlineTime}`);
    // console.log(`onlesp: ${onlesp}`);
    // console.log(`pulseCount: ${pulseCount}`);

    if (timeDifference <= 10 && pulseCount > 3) {
      st_cir.style.background = "rgba(57, 198, 92, 255)";
    } else {
      st_cir.style.background = "rgb(227, 4, 90)";
    }
  }

  // Chỉ gọi khi onlesp thay đổi
  function handleNewOnlesp(newOnlesp) {
    if (newOnlesp !== lastOnlineTime) {
      pulseCount = Math.min(pulseCount + 1.5, 5);
      lastOnlineTime = newOnlesp;
    }
    onlesp = newOnlesp;
    updateUI(); // Cập nhật giao diện
  }

  // Chỉ gọi định kỳ để lấy giờ
  async function updateCurrentSecond() {
    const vietnamTime = await getVietnamTimeFromServer();
    currentSecond = vietnamTime.sec;
    updateUI(); // Cập nhật giao diện, không đụng pulseCount
  }

  // Lắng nghe onlesp đúng một lần
  function listenToOnlesp() {
    const onlesp_stRef = ref(database, `${value}/onlesp_st`);
    onValue(onlesp_stRef, (snapshot) => {
      const newVal = snapshot.val();
      if (newVal != null && newVal !== onlesp) {
        // console.log("onlesp UPDATED:", newVal);
        handleNewOnlesp(newVal);
      }
    });
  }

  // Khởi chạy
  listenToOnlesp();
  setInterval(updateCurrentSecond, 10 * 1000);

}

onAuthStateChanged(auth, (user) => {
    if (user) {
        const uid = user.uid;

    } else {
        window.location.replace("login.html");
    }
});

var userRead = sessionStorage.getItem('userses') || localStorage.getItem('user');
if (userRead === null) {
    try {
        auth.signOut();
        window.location.replace("login.html");
    } catch (error) {
        console.error(error);
    }
}