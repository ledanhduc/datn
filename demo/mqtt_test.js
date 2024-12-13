// Kết nối tới broker MQTT
var client = mqtt.connect('mqtt://broker.example.com'); // Thay đổi địa chỉ broker MQTT tại đây

// Gửi yêu cầu kết nối khi đã kết nối thành công
client.on('connect', function () {
    client.subscribe('topic/example'); // Thay đổi topic tại đây
});

// Xử lý khi nhận được dữ liệu từ topic đã subscribe
client.on('message', function (topic, message) {
    var dataContainer = document.getElementById('data-container');
    dataContainer.innerHTML = 'Received: ' + message.toString();
});