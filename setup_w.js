import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getDatabase, ref as databaseRef, set, get, onValue } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-database.js";
// import { getDatabase, ref, set, get, onValue } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-database.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";

import firebaseConfig from './firebaseConfig.js';

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);

const currentUrl = window.location.href;
const idDevice = new URLSearchParams(window.location.search).get('id');

let encodedEmail;
const nameuser1 = document.getElementById("nameuser1");
const avtUser1 = document.getElementById("avt_user1");

// Khai báo các biến toàn cục
let isDrawing = false;
let startX = 0, startY = 0, endX = 0, endY = 0;
let angle = 0;
let originalImage = null; // Lưu ảnh gốc để xử lý

// const GetPhoto = document.getElementById("getphoto");
const TakePhoto = document.getElementById("takephoto");
const Setup_img = document.getElementById("image-canvas");
const Cut_Setup_img = document.getElementById("Cut_Setup_img");
const number_output = document.getElementById("number_output");
const text_output = document.getElementById("text_output");
const spinner = document.getElementById("spinner");
const data_img = document.getElementById("data_img");
const id_st = document.getElementById("st_id");
// const insensityVal = 
const gridSize = 50; // Kích thước lưới (mỗi ô vuông là 50px)

// Tạo 2 canvas khác nhau
const imageCanvas = document.createElement('canvas');
const gridCanvas = document.createElement('canvas');

const imageCtx = imageCanvas.getContext('2d');
const gridCtx = gridCanvas.getContext('2d');

// // Hàm vẽ lưới cố định (không xoay)
// function drawGrid(ctx, canvas) {
//     const gridColor = "#e0e0e0"; // Màu của lưới (màu xám nhạt)
//     ctx.beginPath();
//     // Vẽ các đường dọc
//     for (let x = gridSize; x < canvas.width; x += gridSize) {
//         ctx.moveTo(x, 0);
//         ctx.lineTo(x, canvas.height);
//     }
//     // Vẽ các đường ngang
//     for (let y = gridSize; y < canvas.height; y += gridSize) {
//         ctx.moveTo(0, y);
//         ctx.lineTo(canvas.width, y);
//     }
//     ctx.strokeStyle = gridColor;
//     ctx.lineWidth = 0.5;
//     ctx.stroke();
// }

TakePhoto.addEventListener('click', function() {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            // Kiểm tra giá trị hiện tại của "/cap" chỉ 1 lần
            get(databaseRef(database, `/${idDevice}/cap`)).then((snapshot) => {
                if (snapshot.exists() && snapshot.val() === false) { // Chỉ thay đổi khi "/cap" là false
                    // Đặt giá trị "/cap" là true
                    set(databaseRef(database, `/${idDevice}/cap`), true).then(() => {
                        // Lắng nghe sự thay đổi của "/quality" liên tục
                        // onValue(databaseRef(database, `/${idDevice}/quality`), (imgSnapshot) => {
                        onValue(databaseRef(database, `/${idDevice}/img_config`), (imgSnapshot) => {
                            if (imgSnapshot.exists() && imgSnapshot.val() != null) {
                                let imageUrl = imgSnapshot.val();
                                if (!imageUrl.startsWith("data:image/png;base64,")) {
                                    imageUrl = "data:image/png;base64," + imageUrl;
                                }

                                const img = new Image();
                                img.onload = function() {
                                    // Đặt kích thước của 2 canvas theo kích thước ảnh
                                    imageCanvas.width = img.width;
                                    imageCanvas.height = img.height;
                                    gridCanvas.width = img.width;
                                    gridCanvas.height = img.height;

                                    // Vẽ ảnh lên canvas ảnh
                                    imageCtx.clearRect(0, 0, imageCanvas.width, imageCanvas.height);
                                    imageCtx.drawImage(img, 0, 0, img.width, img.height);

                                    // Vẽ lưới lên canvas lưới (lưới không bị xoay)
                                    gridCtx.clearRect(0, 0, gridCanvas.width, gridCanvas.height);
                                    drawGrid(gridCtx, gridCanvas);

                                    originalImage = img;
                                    // Hiển thị các canvas lên màn hình
                                    Setup_img.getContext('2d').drawImage(imageCanvas, 0, 0);
                                    Setup_img.getContext('2d').drawImage(gridCanvas, 0, 0);
                                };
                                img.src = imageUrl;
                            } else {
                                console.log("No image found.");
                                        // Nếu không có giá trị hình ảnh (null), vẽ "Hello World" lên canvas
                            }
                        });

                    }).catch((error) => {
                        console.log("Error setting '/cap' to true:", error);
                    });
                } else {
                    console.log("`/cap` is not false, image won't be displayed.");
                }
            }).catch((error) => {
                console.log("Error retrieving '/cap' value:", error);
            });

        } else {
            console.log("Không có người dùng nào đang đăng nhập.");
        }
    });
});


// GetPhoto.addEventListener('click', function() {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            encodedEmail = encodeURIComponent(user.email.replace(/[.@]/g, '_'));
            onValue(databaseRef(database, `${encodedEmail}/avt_img`), (snapshot) => {
            if(snapshot.val()!=null){
                avtUser1.src = snapshot.val();
            }
            });
            nameuser1.innerHTML = user.displayName;
            console.log(user.displayName);
            // Just retrieve the image without altering "/cap" state
            onValue(databaseRef(database, `/${idDevice}/img_config`), (imgSnapshot) => {
                if (imgSnapshot.exists() && imgSnapshot.val() != null) {
                    let imageUrl = imgSnapshot.val();
                    if (!imageUrl.startsWith("data:image/png;base64,")) {
                        imageUrl = "data:image/png;base64," + imageUrl;
                    }

                    const img = new Image();
                    img.onload = function() {
                        // Set the canvas size to match the image size
                        imageCanvas.width = img.width;
                        imageCanvas.height = img.height;
                        gridCanvas.width = img.width;
                        gridCanvas.height = img.height;

                        // Draw the image on the image canvas
                        imageCtx.clearRect(0, 0, imageCanvas.width, imageCanvas.height);
                        imageCtx.drawImage(img, 0, 0, img.width, img.height);

                        // Draw the grid on the grid canvas (grid remains unrotated)
                        gridCtx.clearRect(0, 0, gridCanvas.width, gridCanvas.height);
                        drawGrid(gridCtx, gridCanvas);

                        originalImage = img;
                        // Display the canvases on screen
                        Setup_img.getContext('2d').drawImage(imageCanvas, 0, 0);
                        Setup_img.getContext('2d').drawImage(gridCanvas, 0, 0);
                    };
                    img.src = imageUrl;
                } else {
                    console.log("No image found.");
                    // Nếu không có giá trị hình ảnh (null), vẽ "Hello World" lên canvas
                    // imageCanvas.width = 500;  // Kích thước canvas
                    // imageCanvas.height = 200;

                    // Vẽ chữ "Hello World" lên canvas
                    imageCtx.clearRect(0, 0, imageCanvas.width, imageCanvas.height);
                    imageCtx.font = '30px Arial';
                    imageCtx.fillStyle = 'black';
                    imageCtx.fillText('No img found,', 0, 30);
                    imageCtx.fillText('please take a photo', 0, 60);
                    imageCtx.fillText('then crop and get data', 0, 90);
                    imageCtx.fillText('and check result', 0, 120);

                    // Hiển thị các canvas lên màn hình
                    Setup_img.getContext('2d').drawImage(imageCanvas, 0, 0);
                    // Setup_img.getContext('2d').drawImage(gridCanvas, 0, 0);
                }
            });

            onValue(databaseRef(database, `/${idDevice}/insesity_flash`), (insensity) => {
                if (insensity.exists() && insensity.val() != null) {
                    document.getElementById('insensity').value = insensity.val();
                } else {
                    console.log("Insensity found.");
                }
            });

            // onValue(databaseRef(database, `/${idDevice}/angle`), (angle) => {
            //     if (angle.exists() && angle.val() != null) {
            //         document.getElementById('angle').value = angle.val();
            //     } else {
            //         console.log("angle found.");
            //     }
            // });


            onValue(databaseRef(database, `${encodedEmail}/devices`), (snapshot) => {
                const devices = snapshot.val(); // Các thiết bị của người dùng
                if (devices && devices[idDevice]) { // Kiểm thiết bị có tồn tại không
        
                  id_st.innerText = "ID: " + idDevice + " - " + `${devices[idDevice]}`;
                //   handleIdDeviceUpdate(idDevice); //cập nhật thông tin thiết bị
                } else {
                  alert("Device not found.");
                }
            });

            onValue(databaseRef(database, `/${idDevice}/SSI`), (ssi) => {
                let ssiData = ssi.val();
                // console.log(ssiData);
            
                if (ssi.exists() && ssiData !== null) {
                    // Kiểm tra mức độ tín hiệu và thay đổi biểu tượng wifi
                    if (ssiData > -60) {
                        document.getElementById('ssi').innerHTML = "wifi";
                    } else if (ssiData <= -60 && ssiData > -70) {
                        document.getElementById('ssi').innerHTML = "wifi_2_bar";
                    } else if (ssiData <= -70 && ssiData > -80) {
                        document.getElementById('ssi').innerHTML = "network_wifi_1_bar";
                    } else if (ssiData <= -80) {
                        document.getElementById('ssi').innerHTML = "wifi_1_bar";
                    } else {
                        console.log("Invalid SSI value.");
                    }
                } else {
                    console.log("SSI data is not available or invalid.");
                }
            });

        } else {
            console.log("No user is logged in.");
        }
    });

document.addEventListener('DOMContentLoaded', function() {
    updateLinkHrefs(pageLinks_w, currentUrl, idDevice, idDevice);
});
// Hàm vẽ ảnh với góc quay và cập nhật kích thước canvas
function drawImageWithRotation() {
    if (!originalImage) return; // Nếu chưa có ảnh, không làm gì

    const radians = (angle * Math.PI) / 180; // Chuyển đổi góc quay từ độ sang radian

    const width = originalImage.width;
    const height = originalImage.height;

    // Tính toán kích thước mới của canvas sau khi xoay
    const newWidth = Math.abs(width * Math.cos(radians)) + Math.abs(height * Math.sin(radians));
    const newHeight = Math.abs(width * Math.sin(radians)) + Math.abs(height * Math.cos(radians));

    // Cập nhật kích thước của canvas ảnh và canvas lưới
    imageCanvas.width = newWidth;
    imageCanvas.height = newHeight;
    gridCanvas.width = newWidth; // Cập nhật kích thước canvas lưới
    gridCanvas.height = newHeight;

    // Cập nhật lại kích thước của canvas chính (Setup_img)
    Setup_img.width = newWidth;
    Setup_img.height = newHeight;

    // Lấy context của các canvas
    const imageCtx = imageCanvas.getContext('2d');
    const gridCtx = gridCanvas.getContext('2d');

    // Xóa canvas ảnh trước khi vẽ lại
    imageCtx.clearRect(0, 0, imageCanvas.width, imageCanvas.height); 

    // Lưu trạng thái hiện tại của canvas ảnh
    imageCtx.save();

    // Di chuyển hệ tọa độ đến trung tâm canvas ảnh mới
    imageCtx.translate(newWidth / 2, newHeight / 2);

    // Quay canvas ảnh
    imageCtx.rotate(radians);

    // Vẽ ảnh lên canvas mới với kích thước gốc
    imageCtx.drawImage(originalImage, -width / 2, -height / 2);

    // Khôi phục lại trạng thái canvas ảnh
    imageCtx.restore();

    // Vẽ lại lưới lên canvas lưới (gridCanvas)
    gridCtx.clearRect(0, 0, gridCanvas.width, gridCanvas.height); // Xóa lưới cũ
    drawGrid(gridCtx, gridCanvas); // Vẽ lại lưới

    // Vẽ ảnh và lưới lên canvas chính (Setup_img)
    const ctx = Setup_img.getContext('2d');
    ctx.clearRect(0, 0, Setup_img.width, Setup_img.height); // Xóa canvas chính
    ctx.drawImage(imageCanvas, 0, 0); // Vẽ ảnh đã xoay
    ctx.drawImage(gridCanvas, 0, 0);  // Vẽ lưới lên trên ảnh

    // Đảm bảo vẽ được đồng bộ
    requestAnimationFrame(() => {
        // Cập nhật các phần khác nếu cần thiết sau khi vẽ xong
    });
}


// Hàm vẽ lưới
function drawGrid(ctx, canvas) {
    const gridSize = 50; // Kích thước mỗi ô lưới

    // Vẽ các đường thẳng ngang
    for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
    }

    // Vẽ các đường thẳng dọc
    for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
    }

    // Thiết lập màu sắc và vẽ lưới
    ctx.strokeStyle = "rgba(0, 0, 0, 0.5)";  // Màu lưới
    ctx.lineWidth = 1;  // Độ dày của lưới
    ctx.stroke();
}

// Cập nhật góc quay khi người dùng thay đổi
document.getElementById('angle').addEventListener('input', function() {
    angle = parseInt(this.value);
    set(databaseRef(database, `/${idDevice}/angle`), angle);
    drawImageWithRotation(); // Vẽ lại ảnh với góc mới
});

document.getElementById('insensity').addEventListener('input', function() {
    const insensityVal = parseInt(this.value);
    set(databaseRef(database, `/${idDevice}/insesity_flash`), insensityVal);
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

// Hàm cắt và lưu ảnh mà không bao gồm lớp lưới
function cropAndSave() {
    if (!originalImage) return; // Nếu không có ảnh, không thực hiện cắt

    // Tính toán kích thước của vùng cắt
    const width = endX - startX;
    const height = endY - startY;

    // Lấy dữ liệu hình ảnh từ canvas ảnh (không bao gồm lớp lưới)
    const imageCtx = imageCanvas.getContext('2d');
    const imageData = imageCtx.getImageData(startX, startY, width, height);

    // Tạo một canvas mới để vẽ lại vùng đã cắt
    const croppedCanvas = document.createElement('canvas');
    const croppedCtx = croppedCanvas.getContext('2d');
    croppedCanvas.width = width;
    croppedCanvas.height = height;

    // Vẽ lại vùng đã cắt lên canvas mới (chỉ ảnh)
    croppedCtx.putImageData(imageData, 0, 0);

    // Chuyển canvas mới thành base64
    const base64Image = croppedCanvas.toDataURL();

    // Gửi ảnh base64 đến API và xử lý
    processImageApi(base64Image);

    // Hiển thị ảnh cắt lên giao diện
    Cut_Setup_img.src = base64Image;
    Cut_Setup_img.width = width;  // Đặt chiều rộng của <img> bằng chiều rộng của vùng cắt
    Cut_Setup_img.height = height; // Đặt chiều cao của <img> bằng chiều cao của vùng cắt

    // Hiển thị base64 lên giao diện
}

function saveconfig(){
    set(databaseRef(database, `/${idDevice}/angle`), angle);
    set(databaseRef(database, `/${idDevice}/startX`), startX);
    set(databaseRef(database, `/${idDevice}/endX`), endX);
    set(databaseRef(database, `/${idDevice}/startY`), startY);
    set(databaseRef(database, `/${idDevice}/endY`), endY);
}

// Hàm gửi ảnh base64 tới API và in kết quả trả về
function processImageApi(base64Image) {
    spinner.style.display = "block"; // Hiển thị spinner

    // Tạo đối tượng dữ liệu gửi đi
    const requestData = {
        image_base64: base64Image
    };

    // Gửi yêu cầu POST đến API
    fetch('https://weevil-decent-legally.ngrok-free.app/process_image', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
    })
    .then(response => response.json())  // Chuyển đổi kết quả trả về thành JSON
    .then(data => {
        // Ẩn spinner khi nhận được dữ liệu
        spinner.style.display = "none";

        // Hiển thị dữ liệu trong các phần tử HTML
        number_output.textContent = data.number;  // Cập nhật số
        text_output.textContent = data.text;      // Cập nhật văn bản
    })
    .catch(error => {
        // Ẩn spinner nếu có lỗi xảy ra
        spinner.style.display = "none";
        console.error('Có lỗi xảy ra:', error);
    });
}

// Gán sự kiện cho nút cắt ảnh
document.getElementById('crop-button').addEventListener('click', cropAndSave);
document.getElementById('save-config').addEventListener('click', saveconfig);


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