import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-database.js";
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

const auth = getAuth(app);

let encodedEmail;

const waitForEncodedEmail = async () => {
  return new Promise((resolve) => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        encodedEmail = encodeURIComponent(user.email.replace(/[.@]/g, '_'));
      } else {
        console.log("No user is logged in.");
      }
      resolve(encodedEmail);
    });
  });
};


const apiKey = "2bb5c13c302737b658da7f4907b1a168";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?lang=vi&units=metric&q=";

const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");
const weatherIcon = document.querySelector(".weather-icon");

let lct = "thu duc";
let intervalId;

const intervalTime = 6 * 60 * 1000; // 10 phút

async function checkWeather(city) {
  try {
    const response = await fetch(apiUrl + city + `&appid=${apiKey}`);

    if (response.status == 404) {
      document.querySelector(".error").style.display = "block";
      document.querySelector(".weather").style.display = "none";
    } else {
      const data = await response.json();

      document.querySelector(".city").innerHTML = data.name;
      document.querySelector(".w_temp").innerHTML = Math.round(data.main.temp) + "°C"
      document.querySelector(".w_humi").innerHTML = data.main.humidity + "%";
      document.querySelector(".w_wind").innerHTML = data.wind.speed + " km/h";
      weatherIcon.src = `img_weather/${data.weather[0].icon}.svg`;
      document.querySelector(".weather").style.display = "block";
      document.querySelector(".error").style.display = "none";
    }
  } catch (error) {
    console.log(error);
  }
}

waitForEncodedEmail().then((encodedEmail) => {
  searchBtn.addEventListener("click", () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(getPosition, showError);
    } else {
      set(ref(database, `${encodedEmail}/pre_lct`), "thu duc");
    }
  
    function getPosition(position) {
      let lat = position.coords.latitude;
      let lon = position.coords.longitude;
      fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`)
        .then(response => response.json())
        .then(data => {
          set(ref(database, `${encodedEmail}/pre_lct`), data.name);
        });
    }
  
    function showError(error) {
      switch (error.code) {
        case error.PERMISSION_DENIED:
          set(ref(database, `${encodedEmail}/pre_lct`), "thu duc");
          break;
        case error.POSITION_UNAVAILABLE:
          set(ref(database, `${encodedEmail}/pre_lct`), "thu duc");
          break;
        case error.TIMEOUT:
          set(ref(database, `${encodedEmail}/pre_lct`), "thu duc");
          break;
        case error.UNKNOWN_ERROR:
          set(ref(database, `${encodedEmail}/pre_lct`), "thu duc");
          break;
      }
    }
  });
  
  searchBox.addEventListener("keydown", (event) => {
    if (event.keyCode === 13) {
      checkWeather(searchBox.value);
      set(ref(database, `${encodedEmail}/pre_lct`), searchBox.value);
      searchBox.value = "";
    }
  });
});

waitForEncodedEmail().then((encodedEmail) => {
  const humiRef = ref(database, `${encodedEmail}/pre_lct`);
  onValue(humiRef, (snapshot) => {
    lct = snapshot.val() || "thu duc";
    checkWeather(lct);
    intervalId = setInterval(() => {
      checkWeather(lct);
    }, intervalTime);
    console.log(lct);
  });
});

