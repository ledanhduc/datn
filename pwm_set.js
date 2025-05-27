import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getDatabase, ref as databaseRef, set, onValue } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-database.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";

import firebaseConfig from './firebaseConfig.js';

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);

const path = `/E4DAD4D4/pwm_set/`;
const path_target = ``;



const pwm_resolution = (2**12)-1; // 4095
const vol_out = 12; // Giả sử điện áp tối đa là 80V
const vol_motor = 80; // Điện áp tối đa    

// const voltageInput = document.getElementById('voltageInput');
const inputField = document.getElementById('PWMInput');
const VolDisplay = document.getElementById('VolDisplay');
const voltageOutput = document.getElementById('voltageReal');
const pressureDisplay = document.getElementById('pressureDisplay');
const flowDisplay = document.getElementById('flowDisplay');
const MVolOutput = document.getElementById('MVolOutput'); 
function sendValue(value) {
    set(databaseRef(database, path), value);
}

document.addEventListener('DOMContentLoaded', () => {

    // Lắng nghe sự kiện khi người dùng nhấn nút "Bắt đầu tự động"
    document.getElementById('startAutoButton').addEventListener('click', () => {
        autoPWM(); // Gọi hàm autoPWM khi nhấn nút
    });

    document.getElementById('setVoltageButton').addEventListener('click', () => {
        let inputValue = parseFloat(inputField.value);

        if (!isNaN(inputValue)) {
            if (inputValue > pwm_resolution) inputValue = pwm_resolution;
            if (inputValue < 0) inputValue = 0;
            inputField.value = inputValue;
            sendValue(inputValue);

            let voltage = (inputValue / pwm_resolution) * 80;
            VolDisplay.textContent = voltage.toFixed(1);
        } else {
            alert("Vui lòng nhập giá trị hợp lệ (0 - 80V).");
        }
    });

});

function V2PRM(voltage) {
    const PRM = Math.round((voltage / 80) * pwm_resolution);
    sendValue(PRM);
    console.log(PRM);
    inputField.value = PRM;
    VolDisplay.textContent = voltage;
}

function V2_PRM_LM(voltage) {
    const result = interpolatePressureFlow(voltage);
    pressureDisplay.textContent = result.pressure;
    flowDisplay.textContent = result.flow;
    // console.log(result.pressure, result.flow);
    // console.log(`V2_PRM_LM: ${voltage}`);
}

function V2VM(voltage) {            
    const result1 = (voltage*12/ 80).toFixed(2);
    MVolOutput.textContent = result1;
}

// function getVoltage() {
//     onValue(databaseRef(database, path), (snapshot) => {
//         const value = snapshot.val();
//         if (value !== null) {
//             voltageOutput.textContent = value;
//             const voltage = (value / pwm_resolution) * 80;
//             VolDisplay.textContent = voltage.toFixed(1);
//             result = interpolatePressureFlow(voltage);
//             pressureDisplay.textContent = result.pressure;
//             flowDisplay.textContent = result.flow;
//         }
//     });
// }

// function createVoltagePresets() {
//     const container = document.getElementById('voltagePresets');
//     const resolution = parseInt(document.getElementById('resolutionInput').value, 10);

//     container.innerHTML = ''; // Clear old buttons

//     for (let v = 0; v <= 80; v += resolution) {
//         const btn = document.createElement('button');
//         btn.className = 'button';
//         btn.textContent = `${v}V`;
//         btn.onclick = () => {
//             V2PRM(v);
//             V2_PRM_LM(v);
//         };
//         container.appendChild(btn);
//     }
// }



// function createVoltagePresets() {
//     const container = document.getElementById('voltagePresets');
//     const resolution = parseInt(document.getElementById('resolutionInput').value, 10);

//     container.innerHTML = ''; // Clear old buttons
//     let selectedButton = null; // Biến lưu trữ nút đang được chọn

//     for (let v = 0; v <= 80; v += resolution) {
//         const btn = document.createElement('button');
//         btn.className = 'button';
//         btn.textContent = `${v}V`;

//         btn.onclick = () => {
//             // Gọi các hàm của bạn
//             V2PRM(v);
//             V2_PRM_LM(v);
//             V2VM(v);

//             // Nếu có nút nào đã được chọn, xóa lớp 'selected' khỏi nút đó
//             if (selectedButton) {
//                 selectedButton.classList.remove('selected');
//             }

//             // Đánh dấu nút hiện tại là đã chọn
//             selectedButton = btn;
//             selectedButton.classList.add('selected');
//         };

//         container.appendChild(btn);
//     }
// }


// function interpolatePressureFlow(voltage) {
//     const data = pressureFlowData;

//     // Nếu nằm ngoài khoảng, gán min/max
//     if (voltage <= data[0].voltage) return data[0];
//     if (voltage >= data[data.length - 1].voltage) return data[data.length - 1];

//     // Tìm 2 điểm gần nhất để nội suy
//     for (let i = 0; i < data.length - 1; i++) {
//         const v1 = data[i].voltage;
//         const v2 = data[i + 1].voltage;

//         if (voltage >= v1 && voltage <= v2) {
//             const ratio = (voltage - v1) / (v2 - v1);
//             const pressure = data[i].pressure + ratio * (data[i + 1].pressure - data[i].pressure);
//             const flow = data[i].flow + ratio * (data[i + 1].flow - data[i].flow);

//             return {
//                 pressure: pressure.toFixed(2),
//                 flow: flow.toFixed(1)
//             };
//         }
//     }
// }

function interpolatePressureFlow(voltage) {
    // Chuyển đổi input thành số nếu cần
    const inputVoltage = Number(voltage);
    
    // Kiểm tra input có hợp lệ không
    if (isNaN(inputVoltage)) {
        throw new Error("Điện áp đầu vào không hợp lệ");
    }
    
    const data = pressureFlowData;
    
    // Xử lý trường hợp nằm ngoài khoảng dữ liệu
    if (inputVoltage <= data[0].voltage) {
        return {
            voltage: inputVoltage,
            pressure: data[0].pressure,
            flow: data[0].flow
        };
    }
    
    if (inputVoltage >= data[data.length - 1].voltage) {
        return {
            voltage: inputVoltage,
            pressure: data[data.length - 1].pressure,
            flow: data[data.length - 1].flow
        };
    }
    
    // Tìm 2 điểm gần nhất để nội suy
    for (let i = 0; i < data.length - 1; i++) {
        const lowerPoint = data[i];
        const upperPoint = data[i + 1];
        
        if (inputVoltage >= lowerPoint.voltage && inputVoltage <= upperPoint.voltage) {
            // Tính tỉ lệ nội suy
            const ratio = (inputVoltage - lowerPoint.voltage) / (upperPoint.voltage - lowerPoint.voltage);
            
            // Nội suy áp suất và lưu lượng
            const interpolatedPressure = lowerPoint.pressure + ratio * (upperPoint.pressure - lowerPoint.pressure);
            const interpolatedFlow = lowerPoint.flow + ratio * (upperPoint.flow - lowerPoint.flow);
            
            // Trả về giá trị đã làm tròn với độ chính xác phù hợp
            return {
                voltage: inputVoltage,
                pressure: Number(interpolatedPressure.toFixed(2)),
                flow: Number(interpolatedFlow.toFixed(1))
            };
        }
    }
    
    // Trường hợp không tìm thấy khoảng phù hợp (không nên xảy ra nếu code đúng)
    throw new Error("Không thể tìm thấy khoảng dữ liệu phù hợp để nội suy");
}

function autoPWM() {
    let currentPWM = 4095;   // Giá trị PWM hiện tại
    let targetPWM = 2000;    // Giá trị PWM đích
    const delayTime = 1 * 60 * 1000; // 5 phút (5 * 60 * 1000 ms)
  
    // Hàm set PWM về 0 trước khi set giá trị mới
    function setPWM(pwmValue) {
        sendValue(0); // Set PWM về 0
        setTimeout(() => {
            sendValue(pwmValue); // Sau đó set PWM mới
            let voltage = (pwmValue / pwm_resolution) * vol_motor; // Tính lại điện áp tương ứng
            VolDisplay.textContent = voltage.toFixed(1); // Hiển thị điện áp lên giao diện
        }, 30); // Delay 1 giây để đảm bảo PWM được reset về 0 trước khi set giá trị mới
    }
  
function decrementPWM() {
    // Kiểm tra nếu currentPWM lớn hơn targetPWM (để giảm PWM)
    if (currentPWM > targetPWM) {
        setPWM(currentPWM);  // Gọi hàm set PWM để áp dụng giá trị

        // Giảm giá trị PWM
        currentPWM = currentPWM - 50; // Giảm 100 mỗi lần`
        console.log(`Giảm PWM xuống: ${currentPWM}, Thời gian: ${new Date().toLocaleTimeString()}`);
    }
    
    // Lặp lại quá trình sau 5 phút (delayTime)
    if (currentPWM > targetPWM) {
        setTimeout(decrementPWM, delayTime); // Sau 5 phút, giảm PWM xuống
    }
}
  
    decrementPWM(); // Bắt đầu quá trình
}


// document.addEventListener('DOMContentLoaded', createVoltagePresets);
// document.getElementById('resolutionInput').addEventListener('input', createVoltagePresets);
// document.addEventListener('DOMContentLoaded', () => {
//     // Gọi hàm autoPWM khi trang được tải xong
//     autoPWM();
// });



