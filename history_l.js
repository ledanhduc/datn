import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getDatabase, ref, onValue, remove} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-database.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";

import firebaseConfig from './firebaseConfig.js';
  
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);

let encodedEmail;
document.addEventListener('DOMContentLoaded', () => {
    const nameuser1 = document.getElementById("nameuser1");
    const avtUser1 = document.getElementById("avt_user1");

    const tableBody = document.querySelector('table tbody');

    onAuthStateChanged(auth, (user) => {  
        if (user) {
        encodedEmail = encodeURIComponent(user.email.replace(/[.@]/g, '_'));
        onValue(ref(database, `${encodedEmail}/avt_img`), (snapshot) => {
            if(snapshot.val()!=null){
                avtUser1.src = snapshot.val();
            }
        });
        nameuser1.innerHTML = user.displayName;
        //   console.log(user.displayName);
        }

        onValue(ref(database, `${encodedEmail}/history`), (snapshot) => {
            const data = snapshot.val();
            
            // Chuyển đổi các cặp key-value thành mảng và sắp xếp theo ngày tháng giảm dần
            const sortedData = Object.entries(data).sort(([keyA, IP_A], [keyB, IP_B]) => {
                // Chuyển đổi chuỗi ngày tháng "dd-mm-yyyy hh:mm:ss" thành đối tượng Date
                const [dayA, monthA, yearA] = keyA.split(' ')[0].split('-');
                const [dayB, monthB, yearB] = keyB.split(' ')[0].split('-');
                
                // Tạo đối tượng Date (Lưu ý: JavaScript yêu cầu tháng bắt đầu từ 0, tức là tháng 1 là 0)
                const dateA = new Date(`${yearA}-${monthA}-${dayA}T${keyA.split(' ')[1]}`);
                const dateB = new Date(`${yearB}-${monthB}-${dayB}T${keyB.split(' ')[1]}`);
                
                // Sắp xếp giảm dần
                return dateB - dateA; // Nếu dateB > dateA thì xếp trước
            });
        
        
            sortedData.forEach(([key, IP]) => {
                // Kiểm tra xem hàng đã tồn tại trong bảng chưa
                const existingRow = tableBody.querySelector(`tr[data-key="${key}"]`);
        
                if (existingRow) {
                    // Nếu hàng đã tồn tại, cập nhật nội dung cột IP
                    existingRow.querySelector('.ip-column').textContent = IP;
                } else {
                    const tr = document.createElement('tr');
                    tr.setAttribute('data-key', key);
                    const trContent = `
                        <td>${key}</td> <!-- Hiển thị ngày/tháng theo định dạng "dd-mm-yyyy hh:mm:ss" -->
                        <td class="ip-column">${IP}</td>
                    `;
                    tr.innerHTML = trContent;
        
                    tableBody.appendChild(tr);
                    // number++;
                }
            });
        });
    });
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
  