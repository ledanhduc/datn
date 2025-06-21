import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
// import { getDatabase, ref, onValue, set, get, onChildAdded, onChildChanged, child } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-database.js";
import { getDatabase, ref, onValue} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-database.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";


import firebaseConfig from './firebaseConfig.js';


const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);

const currentUrl = window.location.href;
const idDevice = new URLSearchParams(window.location.search).get('id');

async function getVietnamTimeFromServer() {
const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20_000); // 10 giây

  try {
    const response = await fetch('https://nodejs-api-6kz9.onrender.com/ping', {
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
// let Id_device = idDevice;

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

    // onValue(ref(database, `${encodedEmail}/Id_Device`), (snapshot) => {
    //   Id_device = snapshot.val();
    //   id_st.innerText ="ID: " + Id_device;
    //   handleIdDeviceUpdate(Id_device);
    // });

    onValue(ref(database, `${encodedEmail}/devices`), (snapshot) => {
      const devices = snapshot.val(); // Các thiết bị của người dùng
      if (devices && devices[idDevice]) { // Kiểm thiết bị có tồn tại không
        // Id_device = Id_device; // Đảm bảo sử dụng ID thiết bị từ URL
        // console.log(`Key: ${Id_device}, Value: ${data[Id_device]}`);
        // console.log(`Key: ${devices[Id_device]}`);
        id_st.innerText = "ID: " + idDevice + " - " + `${devices[idDevice]}`;
        handleIdDeviceUpdate(idDevice); //cập nhật thông tin thiết bị
      } else {
        alert("Device not found.");
      }
    });
  }
});

function handleIdDeviceUpdate(value) {

  updateLinkHrefs(pageLinks_e, currentUrl, idDevice, value);
  
  const refChartLink = document.getElementById("ref_chart");
  refChartLink.href = `chart_col.html?id=${value}`;

// const refStatisticsLink = document.getElementById("ref_statistics");
// refStatisticsLink.href = `chart_col.html?id=${value}`;


  console.log(value);
  const tempRef = ref(database, `${value}/Frequency`);
  // const tempRef = ref(database, '11971268/Frequency');

  onValue(tempRef, (snapshot) => {
    const temp = snapshot.val().toFixed(1);
    // console.log(temp);
    document.getElementById('temp').textContent = temp + ' Hz';
    document.getElementById('temp1').textContent = temp + ' Hz';
    document.getElementById('num_temp').style.setProperty('--num_temp', temp);
    if(temp == null){
      alert("Device not found");
    }
  });

  // const tot_preRef = ref(database, `${value}/Voltage`);

  // onValue(tot_preRef, (snapshot) => {
    //   const tot_pre = snapshot.val();
    //   document.getElementById('tot_pre').textContent = tot_pre + " V";
    //   document.getElementById('num_pre').style.setProperty('--tot_pre', tot_pre + " V");
    //   document.getElementById('num_pre').style.setProperty('--dot_pre', `${360 / tot_pre}deg`);
    
    // });
  // const stCir_Ref = ref(database, `${value}/lamp_1_state`);
  // const st_cir = document.getElementById('st_cir')
  // onValue(stCir_Ref, (snapshot) => {
  //   const stCir = snapshot.val();
  //   if (stCir) {
  //     st_cir.style.background = "rgba(57,198,92,255)";
  //   } else {
  //     st_cir.style.background = "rgb(227, 4, 90)";
  //   }
  // });

  const preRef = ref(database, `${value}/Voltage`);

  onValue(preRef, (snapshot) => {
    const pre = snapshot.val();
    document.getElementById('pre').textContent = pre.toFixed(1) + " V";
    document.getElementById('pre1').textContent = pre.toFixed(1) + " V";
    document.getElementById('num_pre').style.setProperty('--num_pre', pre);
  });

  const humiRef = ref(database, `${value}/Current`);

  onValue(humiRef, (snapshot) => {
    const humi = snapshot.val();
    document.getElementById('humi').textContent = humi + ' A';
    document.getElementById('humi1').textContent = humi + ' A';
    document.getElementById('num_humi').style.setProperty('--num_humi', humi);
  });

  const powerRef = ref(database, `${value}/Power`);

  onValue(powerRef, (snapshot) => {
    const power = snapshot.val();
    document.getElementById('power').textContent = power.toFixed(2) + ' W';
    document.getElementById('power1').textContent = power.toFixed(2) + ' W';
    // document.getElementById('num_power').style.setProperty('--num_power', power);
    if(power >=1500){
      document.getElementById("num_power").style.setProperty("--clr-power", "red");
    }
    else document.getElementById("num_power").style.setProperty("--clr-power", "#17c943");
  });

  const energyRef = ref(database, `${value}/Energy`);
  var day = new Date().getDate();
  var month = new Date().getMonth() + 1;
  var energy
  var EnergyCurrentDay;

  onValue(energyRef, (snapshot) => {
    energy = snapshot.val();
    document.getElementById('energy').textContent = energy.toFixed(2) + ' kWh';
    document.getElementById('energy1').textContent = energy.toFixed(2) ;
    // document.getElementById('num_power').style.setProperty('--num_power', power);
    
    document.getElementById("num_energy").style.setProperty('--num_day', day);
    document.getElementById("num_eom").style.setProperty('--num_day', day);


    const EnergyCurrentDayRef = ref(database, `${value}/${month}/${day}/`);
    onValue(EnergyCurrentDayRef, (snapshot) => {
      EnergyCurrentDay = snapshot.val();
      console.log(EnergyCurrentDay);

      // Ensure EnergyCurrentDay is a number; default to 0 if null/undefined
      EnergyCurrentDay = Number(EnergyCurrentDay) || 0;

      let energyDiff = energy - EnergyCurrentDay;

      // Ensure the difference is not negative
      if (energyDiff < 0) {
        energyDiff = 0;
      }
      if(Number(EnergyCurrentDay) != 0){
        document.getElementById('eom').textContent = energyDiff.toFixed(2) + ' kWh';
        document.getElementById('eom1').textContent = energyDiff.toFixed(2);
      } else {
        document.getElementById('eom').textContent = 'Calculating....';
        document.getElementById('eom1').textContent = 0;
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

    console.log(`currentSecond: ${currentSecond}`);
    console.log(`lastOnlineTime previous: ${lastOnlineTime}`);
    console.log(`onlesp: ${onlesp}`);
    console.log(`pulseCount: ${pulseCount}`);

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
        console.log("onlesp UPDATED:", newVal);
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




