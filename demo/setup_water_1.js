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

// Khai báo các biến toàn cục
let isDrawing = false;
let startX = 0, startY = 0, endX = 0, endY = 0;
let angle = 0;
let originalImage = null; // Lưu ảnh gốc để xử lý

const TakePhoto = document.getElementById("takephoto");
const Setup_img = document.getElementById("image-canvas");
const Cut_Setup_img = document.getElementById("Cut_Setup_img");

TakePhoto.addEventListener('click', function() {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            encodedEmail = encodeURIComponent(user.email.replace(/[.@]/g, '_'));

            // Thiết lập giá trị `take_img_test` là `true` khi người dùng nhấn nút "Take Photo"
            set(databaseRef(database, `/cc082405613c/take_img_test`), true);

            // Lắng nghe thay đổi tại `/cc082405613c/take_img_test`
            onValue(databaseRef(database, `/cc082405613c/take_img_test`), (snapshot) => {
                // if (snapshot.val() === false) { // Kiểm tra nếu `take_img_test` là `false`
                if (snapshot.val() === true) { // Kiểm tra nếu `take_img_test` là `false`
                    // Nếu `take_img_test` là `false`, thì tiếp tục lấy ảnh và vẽ lên canvas
                    onValue(databaseRef(database, `/cc082405613c/test_img_w`), (imgSnapshot) => {
                        if (imgSnapshot.val() != null) {
                            let imageUrl = imgSnapshot.val();
                            // console.log("Image URL:", imageUrl); // Kiểm tra URL ảnh

                            // Kiểm tra nếu imageUrl không phải là base64 với kiểu data:image/png;base64,
                            if (!imageUrl.startsWith("data:image/png;base64,")) {
                                // Thêm tiền tố vào imageUrl nếu chưa có
                                imageUrl = "data:image/png;base64," + imageUrl;
                            }

                            // Tạo một đối tượng Image và vẽ lên canvas
                            const img = new Image();
                            img.onload = function() {
                                // Đặt kích thước của canvas bằng với kích thước của ảnh
                                const canvas = document.getElementById('image-canvas');
                                canvas.width = img.width;
                                canvas.height = img.height;

                                const ctx = canvas.getContext('2d');
                                ctx.clearRect(0, 0, canvas.width, canvas.height); // Xóa canvas trước khi vẽ

                                // Vẽ ảnh lên canvas theo kích thước thật của ảnh
                                ctx.drawImage(img, 0, 0, img.width, img.height);

                                // Lưu ảnh để vẽ hoặc cắt
                                originalImage = img;
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
    if (!originalImage) return; // Nếu chưa có ảnh, không làm gì

    // Lấy context của canvas
    const canvas = document.getElementById('image-canvas');
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, canvas.width, canvas.height); // Xóa canvas trước khi vẽ lại

    const radians = (angle * Math.PI) / 180; // Chuyển đổi góc quay từ độ sang radian

    // Lưu trạng thái hiện tại của canvas
    ctx.save();

    // Di chuyển hệ tọa độ đến trung tâm của ảnh
    ctx.translate(originalImage.width / 2, originalImage.height / 2);

    // Quay ảnh
    ctx.rotate(radians);

    // Vẽ ảnh với kích thước gốc (không thay đổi kích thước)
    ctx.drawImage(originalImage, -originalImage.width / 2, -originalImage.height / 2);

    // Khôi phục trạng thái canvas
    ctx.restore();
}

// Cập nhật góc quay khi người dùng thay đổi
document.getElementById('angle').addEventListener('input', function() {
    angle = parseInt(this.value);
    set(databaseRef(database, `/cc082405613c/angle`), angle);
    drawImageWithRotation(); // Vẽ lại ảnh với góc mới
});

// Lắng nghe sự kiện mouse xuống
Setup_img.addEventListener('mousedown', (e) => {
    startX = e.offsetX;
    startY = e.offsetY;
    isDrawing = true;
});

// Lắng nghe sự kiện di chuyển chuột
Setup_img.addEventListener('mousemove', (e) => {
    if (!isDrawing) return;

    const canvas = document.getElementById('image-canvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Xóa canvas mỗi lần di chuyển chuột

    // Vẽ lại ảnh với góc quay trước khi vẽ hình chữ nhật
    drawImageWithRotation();

    endX = e.offsetX;
    endY = e.offsetY;

    // Vẽ lại hình chữ nhật theo tọa độ hiện tại
    ctx.beginPath();
    ctx.rect(startX, startY, endX - startX, endY - startY);
    ctx.strokeStyle = "red";
    ctx.lineWidth = 3;
    ctx.stroke();
});

// Lắng nghe sự kiện mouse lên
Setup_img.addEventListener('mouseup', (e) => {
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
Setup_img.addEventListener('mouseout', () => {
    if (isDrawing) {
        isDrawing = false;
        // Nếu chuột rời khỏi canvas mà người dùng chưa thả chuột
        endX = startX;
        endY = startY;
        const canvas = document.getElementById('image-canvas');
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawImageWithRotation(); // Vẽ lại ảnh sau khi chuột rời khỏi canvas
    }
});

// Hàm để cắt và lưu vùng hình chữ nhật dưới dạng base64
function cropAndSave() {
    if (!originalImage) return; // Nếu không có ảnh, không thực hiện cắt

    // Tính toán kích thước của vùng cắt
    const width = endX - startX;
    const height = endY - startY;
    set(databaseRef(database, `/cc082405613c/startX`), startX);
    set(databaseRef(database, `/cc082405613c/endX`), endX);
    set(databaseRef(database, `/cc082405613c/startY`), startY);
    set(databaseRef(database, `/cc082405613c/endY`), endY);
    set(databaseRef(database, `/cc082405613c/angle`), angle);
    // Lấy dữ liệu hình ảnh từ canvas trong vùng hình chữ nhật đã chọn
    const canvas = document.getElementById('image-canvas');
    const ctx = canvas.getContext('2d');
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
    // console.log(base64Image)
    set(databaseRef(database, `/cc082405613c/test_cut_img_w`), base64Image);

    Cut_Setup_img.src=base64Image
    Cut_Setup_img.width = width;  // Đặt chiều rộng của <img> bằng chiều rộng của vùng cắt
    Cut_Setup_img.height = height; // Đặt chiều cao của <img> bằng chiều cao của vùng cắt
    // Hiển thị base64 lên giao diện
    document.getElementById('base64-output').value = base64Image;
}

// Gán sự kiện cho nút cắt ảnh
document.getElementById('crop-button').addEventListener('click', cropAndSave);

