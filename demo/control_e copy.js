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

let encodedEmail;
const nameuser1 = document.getElementById("nameuser1");
const avtUser1 = document.getElementById("avt_user1");
let Id_device ;
// const id_device_1 = document.getElementById("id_device");
onAuthStateChanged(auth, (user) => {  
  if (user) {
    encodedEmail = encodeURIComponent(user.email.replace(/[.@]/g, '_'));
    // onValue(ref(database, `${encodedEmail}/avt_img`), (snapshot) => {
    //   avtUser1.src = snapshot.val();
    // });

    get(ref(database, `${encodedEmail}/avt_img`))
    .then((snapshot) => {
      if(snapshot.val()!=null){
        avtUser1.src = snapshot.val();
      }
    });
    nameuser1.innerHTML = user.displayName;
    // console.log(user.displayName);

    onValue(ref(database, `${encodedEmail}/Id_Device`), (snapshot) => {
      Id_device = snapshot.val();
      // document.getElementById("id_device").textContent = Id_device;
      // console.log(Id_device);
      handleIdDeviceUpdate(Id_device);
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
  
let lamps = [
{toggle: document.getElementById('lamp_1_toggle'), state: document.getElementById('lamp_1_state'), path: `${value}/lamp_1_state`},
// {toggle: document.getElementById('lamp_2_toggle'), state: document.getElementById('lamp_2_state'), path: 'c302/lamp_2_state'},
// {toggle: document.getElementById('fan_1_toggle'), state: document.getElementById('fan_1_state'), path: 'c302/fan_1_state'},
// {toggle: document.getElementById('fan_2_toggle'), state: document.getElementById('fan_2_state'), path: 'c302/fan_2_state'}
];

lamps.forEach(function(lamp) {
lamp.toggle.addEventListener('click', function() {
  toggleLamp(lamp.toggle, lamp.state, lamp.path);
});
});

// function toggleAirConditioner(toggleElem, imgElem, path) {
// toggleElem.parentNode.classList.toggle('active');
// if (toggleElem.parentNode.classList.contains('active')) {
//     set(ref(database, path), true); 

// } else {
//     set(ref(database, path), false); 
// }
// }

// let airConditioners = [
// {toggle: document.getElementById('air_1_toggle'), img: document.getElementById('img_air_1'), path: 'c302/air_1_state'},
// {toggle: document.getElementById('air_2_toggle'), img: document.getElementById('img_air_2'), path: 'c302/air_2_state'}
// ];

// airConditioners.forEach(function(ac) {
// ac.toggle.addEventListener('click', function() {
//   toggleAirConditioner(ac.toggle, ac.img, ac.path);
// });
// });

let lamps_fb = [
  {toggle: document.getElementById('lamp_1_toggle'), state: document.getElementById('lamp_1_state'), path: `${value}/lamp_1_state`},
  // {toggle: document.getElementById('lamp_2_toggle'), state: document.getElementById('lamp_2_state'), path: 'c302/lamp_2_state'},
  // {toggle: document.getElementById('fan_1_toggle'), state: document.getElementById('fan_1_state'), path: 'c302/fan_1_state'},
  // {toggle: document.getElementById('fan_2_toggle'), state: document.getElementById('fan_2_state'), path: 'c302/fan_2_state'}
];

lamps_fb.forEach(function(lamp_fb) {
  onValue(ref(database, lamp_fb.path), function(snapshot) {
    const timestamp = new Date().toLocaleString().replace(/[/]/g, '-');
    let state = snapshot.val();
    if (state) {
      lamp_fb.toggle.parentNode.classList.add('active');
      lamp_fb.state.innerHTML = "ON";
      lamp_fb.state.style.color = "rgba(57,198,92,255)";
      set(ref(database, `${value}/1/web_butt/${timestamp}`), true);
    } else {
      lamp_fb.toggle.parentNode.classList.remove('active');
      lamp_fb.state.innerHTML = "OFF";
      lamp_fb.state.style.color = "rgb(227, 4, 90)";
      set(ref(database, `${value}/1/web_butt/${timestamp}`), false);
      set(ref(database, `${value}/st_timer`), false); 
    }
  });
});

var currentMinute;
const st_cir = document.getElementById('st_cir');
let onlesp;

function sendCurrentMinute() {
  currentMinute = new Date().getMinutes(); 
  // console.log(currentMinute);

  const onlesp_stRef = ref(database, `${value}/onlesp_st`);
  onValue(onlesp_stRef, (snapshot) => {
    onlesp = snapshot.val();
  });
}

function checkOnlesp() {
  // console.log(currentMinute);
  if (onlesp == currentMinute) {
    st_cir.style.background = "rgba(57, 198, 92, 255)";
  } else {
    st_cir.style.background = "rgb(227, 4, 90)";
  }
}

setInterval(sendCurrentMinute, 1 * 1000);
setInterval(checkOnlesp, 12 * 1000);

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
    window.location.replace("login_en.html")
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
