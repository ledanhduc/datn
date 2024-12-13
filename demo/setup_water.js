import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getDatabase, ref as databaseRef, set, get, onValue } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-database.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";

import firebaseConfig from '../firebaseConfig.js';

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);
// const user = auth.currentUser;

// const currentUrl = window.location.href;
// const idDevice = new URLSearchParams(window.location.search).get('id');

let encodedEmail;

let img = new Image(); // Khai báo ảnh toàn cục để dễ quản lý
let canvas = document.getElementById('image-canvas');
let ctx = canvas.getContext('2d');
let startX, startY, endX, endY;
let isDrawing = false;
let angle = 0;

const TakePhoto = document.getElementById("takephoto");
const Setup_img = document.getElementById("image-canvas");


// const nameuser1 = document.getElementById("nameuser1");
// const avtUser1 = document.getElementById("avt_user1");
// const id_st = document.getElementById("st_id");

// onAuthStateChanged(auth, (user) => {  
//   if (user) {
//     encodedEmail = encodeURIComponent(user.email.replace(/[.@]/g, '_'));
//     // onValue(ref(database, `${encodedEmail}/avt_img`), (snapshot) => {
//     //   avtUser1.src = snapshot.val();
//     // });

//     get(ref(database, `${encodedEmail}/avt_img`))
//     .then((snapshot) => {
//       if(snapshot.val()!=null){
//         avtUser1.src = snapshot.val();
//       }
//     });
//     nameuser1.innerHTML = user.displayName;
//     // console.log(user.displayName);

//     onValue(ref(database, `${encodedEmail}/devices`), (snapshot) => {
//       const devices = snapshot.val(); // Các thiết bị của người dùng
//       if (devices && devices[idDevice]) { // Kiểm thiết bị tồn tại không
//         id_st.innerText = "ID: " + idDevice + " - " + `${devices[idDevice]}`;
//         handleIdDeviceUpdate(idDevice); //cập nhật thông tin thiết bị
//       } else {
//         alert("Device not found.");
//       }
//     });
//   }
// });


TakePhoto.addEventListener('click', function() {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            encodedEmail = encodeURIComponent(user.email.replace(/[.@]/g, '_'));

            // Thiết lập giá trị `take_img_test` là `true` khi người dùng nhấn nút "Take Photo"
            set(databaseRef(database, `/cc082405613c/take_img_test`), true);

            // Lắng nghe thay đổi tại `/cc082405613c/take_img_test`
            onValue(databaseRef(database, `/cc082405613c/take_img_test`), (snapshot) => {
                if (snapshot.val() === false) { // Kiểm tra nếu `take_img_test` là `false`
                    // Nếu `take_img_test` là `false`, thì tiếp tục lấy ảnh và vẽ lên canvas
                    onValue(databaseRef(database, `/cc082405613c/test_img_w`), (imgSnapshot) => {
                        if (imgSnapshot.val() != null) {
                            let imageUrl = imgSnapshot.val();
                            console.log("Image URL:", imageUrl); // Kiểm tra URL ảnh

                            // Kiểm tra nếu imageUrl không phải là base64 với kiểu data:image/png;base64,
                            if (!imageUrl.startsWith("data:image/png;base64,")) {
                                // Thêm tiền tố vào imageUrl nếu chưa có
                                imageUrl = "data:image/png;base64," + imageUrl;
                            }

                            // Tạo một đối tượng Image và vẽ lên canvas
                            const img = new Image();
                            img.onload = function() {
                                const canvas = document.getElementById('image-canvas');
                                const ctx = canvas.getContext('2d');
                                ctx.clearRect(0, 0, canvas.width, canvas.height); // Xóa canvas trước khi vẽ
                                ctx.drawImage(img, 0, 0, canvas.width, canvas.height); // Vẽ ảnh lên canvas

                                // drawImageWithRotation(); // Vẽ ảnh lên canvas ngay khi ảnh được tải xong
                            };
                            img.src = imageUrl; // Gán URL ảnh vào đối tượng Image
                        } else {
                            console.log("No image found.");
                        }
                    });
                } else {
                    console.log("`take_img_test` is not false, image won't be displayed.");
                }
            });
        } else {
            // Người dùng chưa đăng nhập
            console.log("Không có người dùng nào đang đăng nhập.");
        }
    });
});

// Hàm vẽ ảnh với góc quay
function drawImageWithRotation() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Xóa canvas trước khi vẽ lại
    const radians = (angle * Math.PI) / 180; // Chuyển đổi góc quay từ độ sang radian
    ctx.save(); // Lưu trạng thái hiện tại của canvas
    ctx.translate(img.width / 2, img.height / 2); // Di chuyển hệ tọa độ đến trung tâm ảnh
    ctx.rotate(radians); // Quay canvas
    ctx.drawImage(img, -img.width / 2, -img.height / 2); // Vẽ ảnh tại vị trí mới
    ctx.restore(); // Khôi phục trạng thái canvas
}

// Cập nhật góc quay khi người dùng thay đổi
document.getElementById('angle').addEventListener('input', function() {
    angle = parseInt(this.value);
    drawImageWithRotation(); // Vẽ lại ảnh với góc mới
});

// 2. Phần cho phép người dùng vẽ hình chữ nhật và hiển thị tọa độ
// Lắng nghe sự kiện mouse xuống
canvas.addEventListener('mousedown', (e) => {
    startX = e.offsetX;
    startY = e.offsetY;
    isDrawing = true;
});

// Lắng nghe sự kiện di chuyển chuột
canvas.addEventListener('mousemove', (e) => {
    if (!isDrawing) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height); // Xóa canvas mỗi lần di chuyển chuột

    // Vẽ lại ảnh với góc quay trước khi vẽ hình chữ nhật
    drawImageWithRotation();

    endX = e.offsetX;
    endY = e.offsetY;

    // Vẽ lại hình chữ nhật theo tọa độ hiện tại
    ctx.beginPath();
    ctx.rect(startX, startY, endX - startX, endY - startY);
    ctx.strokeStyle = "red";
    ctx.lineWidth = 2;
    ctx.stroke();
});

// Lắng nghe sự kiện mouse lên
canvas.addEventListener('mouseup', (e) => {
    isDrawing = false;

    // Cập nhật tọa độ điểm kết thúc
    endX = e.offsetX;
    endY = e.offsetY;

    // Hiển thị các tọa độ start và end
    document.getElementById('start-x').textContent = startX;
    document.getElementById('start-y').textContent = startY;
    document.getElementById('end-x').textContent = endX;
    document.getElementById('end-y').textContent = endY;
});

// Lắng nghe sự kiện mouse out (nếu chuột ra ngoài canvas)
canvas.addEventListener('mouseout', () => {
    if (isDrawing) {
        isDrawing = false;
        // Nếu chuột rời khỏi canvas mà người dùng chưa thả chuột
        endX = startX;
        endY = startY;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawImageWithRotation(); // Vẽ lại ảnh sau khi chuột rời khỏi canvas
    }
});

// Hàm để cắt và lưu vùng hình chữ nhật dưới dạng base64
function cropAndSave() {
    // Tính toán kích thước của vùng cắt
    const width = endX - startX;
    const height = endY - startY;

    // Lấy dữ liệu hình ảnh từ canvas trong vùng hình chữ nhật đã chọn
    const imageData = ctx.getImageData(startX, startY, width, height);

    // Tạo một canvas mới để vẽ lại vùng đã cắt
    const croppedCanvas = document.createElement('canvas');
    const croppedCtx = croppedCanvas.getContext('2d');
    croppedCanvas.width = width;
    croppedCanvas.height = height;

    // Vẽ lại vùng đã cắt lên canvas mới
    croppedCtx.putImageData(imageData, 0, 0);

    // Chuyển canvas mới thành base64
    const base64Image = croppedCanvas.toDataURL();

    // Hiển thị base64 lên giao diện
    document.getElementById('base64-output').value = base64Image;
}