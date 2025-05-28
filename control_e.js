import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getDatabase, ref, set, get, onValue } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-database.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";


import firebaseConfig from './firebaseConfig.js';


const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth();

const currentUrl = window.location.href;
const idDevice = new URLSearchParams(window.location.search).get('id');

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
    toggleLamp(lamp.toggle, lamp.state, lamp.path);
  });
  });


  let lamps_fb = [
    {toggle: document.getElementById('lamp_1_toggle'), state: document.getElementById('lamp_1_state'), path: `${value}/lamp_1_state`},
  ];

  lamps_fb.forEach(function(lamp_fb) {
    onValue(ref(database, lamp_fb.path), function(snapshot) {
      const timestamp = new Date().toLocaleString().replace(/[/]/g, '-');
      let state = snapshot.val();
      if (state) {
        lamp_fb.toggle.parentNode.classList.add('active');
        lamp_fb.state.innerHTML = "ON";
        lamp_fb.state.style.color = "rgb(57,198,92)";
        // set(ref(database, `${value}/1/web_butt/${timestamp}`), true);
      } else {
        lamp_fb.toggle.parentNode.classList.remove('active');
        lamp_fb.state.innerHTML = "OFF";
        lamp_fb.state.style.color = "rgb(227, 4, 90)";
        // set(ref(database, `${value}/1/web_butt/${timestamp}`), false);
        // set(ref(database, `${value}/st_timer`), false); 
      }
    });
  });

  var currentMinute;
  var currentSeconds;
  const st_cir = document.getElementById('st_cir');
  let onlesp;
  let lastOnlineTime = 0; 
  var ms;
  function sendCurrentMinute() {
    currentMinute = new Date().getMinutes(); 
    currentSeconds = new Date().getSeconds(); 
    ms = currentMinute * 60 + currentSeconds; 
    const onlesp_stRef = ref(database, `${value}/onlesp_st`);
    onValue(onlesp_stRef, (snapshot) => {
      onlesp = snapshot.val();
    });

    if (onlesp === currentMinute) {
      lastOnlineTime = ms;
      st_cir.style.background = "rgba(57, 198, 92, 255)";
    } else if (lastOnlineTime < (ms - 10)) {
      st_cir.style.background = "rgb(227, 4, 90)";
    }
    }
  setInterval(sendCurrentMinute, 1 * 1000);

  const butt_timer = document.getElementById('butt_timer');
  butt_timer.addEventListener('click', function() {
    const timeInput = document.getElementById("timeInput");
    const selectedTime = timeInput.value;

    const [hour, minute] = selectedTime.split(":");
    set(ref(database, `${value}/h_timer`), parseInt(hour, 10)); 
    set(ref(database, `${value}/m_timer`), parseInt(minute, 10)); 
    set(ref(database, `${value}/st_timer`), true); 
    alert("Timer is on");
  });


  const h_timerRef = ref(database, `${value}/h_timer`);
  const m_timerRef = ref(database, `${value}/m_timer`);
  const st_timerRef = ref(database, `${value}/st_timer`);
  function checkTimer(){
    Promise.all([
      get(h_timerRef),
      get(m_timerRef),
      get(st_timerRef)
    ]).then(([h_snapshot, m_snapshot, st_snapshot]) => {
      const h_timer = h_snapshot.val();
      const m_timer = m_snapshot.val();
      const st_timer = st_snapshot.val();

      if (st_timer == true) {
        document.getElementById('st_timer').style.color = "rgb(29 154 60)";
        document.getElementById('st_timer').style.fontWeight = "800";
        document.getElementById('st_timer').innerText = `device will off at ${h_timer} : ${m_timer}`;
      }else{
        document.getElementById('st_timer').removeAttribute('style');
        document.getElementById('st_timer').innerText = "Timer";
      }
    });
  }
  setInterval(checkTimer, 10 * 1000);
}

// let airConditioners_fb = [
//   {toggle: document.getElementById('air_1_toggle'), img: document.getElementById('img_air_1'), path: 'c302/air_1_state'},
//   {toggle: document.getElementById('air_2_toggle'), img: document.getElementById('img_air_2'), path: 'c302/air_2_state'}
// ];

// airConditioners_fb.forEach(function(ac) {
//   onValue(ref(database, ac.path), function(snapshot) {
//     let state = snapshot.val();
//     if (state) {
//       ac.img.src = 'img/snowflake.png';
//       ac.toggle.parentNode.classList.add('active');
//     } else {
//       ac.img.src = 'img/cut_snowflake.png';
//       ac.toggle.parentNode.classList.remove('active');
//     }
//   });
// });

// luu tru test

// const addClickListener = (buttonId, inputId, callback) => {
//   document.getElementById(buttonId).addEventListener('click', () => {
//     const inputValue = document.getElementById(inputId).value;
//     callback(inputValue);
//   });
// };

// addClickListener('butt_timer', 'timeInput', (selectedTime) => {
//   console.log("Thời gian đã chọn:", selectedTime);
// });

// addClickListener('butt_current', 'currentInput', (currentValue) => {
//   if (currentValue > 9.5) {
//     alert("Current set max = 9.5A");
//   } else {
//     console.log(currentValue);
//   }
// });

// addClickListener('butt_energy', 'energyInput', (energyValue) => {
//   console.log(energyValue);
// });


const butt_current = document.getElementById('butt_current')
butt_current.addEventListener('click', function() {
  const currentInput = document.getElementById("currentInput");
  // const selectedTime = currentInput.value;
  if(currentInput.value > 9.5)
  {
    alert("Current set max = 9.5A")
  }
  else console.log(currentInput.value);
});
const butt_energy = document.getElementById('butt_energy')
butt_energy.addEventListener('click', function() {
  const energyInput = document.getElementById("energyInput");
  console.log(energyInput.value);
});

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