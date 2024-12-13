document.addEventListener('DOMContentLoaded', () => {
  var langBtn = document.getElementById('langBtn');

  langBtn.addEventListener('click', function() {
    // Lấy ngôn ngữ hiện tại của tài liệu và kiểm tra
    var lang = document.documentElement.lang;
    var isEnglish = lang === 'en';
    
    // Thay đổi ngôn ngữ tài liệu
    document.documentElement.lang = isEnglish ? 'en' : 'vi';

    // Định nghĩa các bản dịch
    var translations = {
      iddevices: isEnglish ? 'ID Devices:' : 'ID Thiết bị:',
      name: isEnglish ? 'Name:' : 'Tên:',
      choose: isEnglish ? 'Please choose devices' : 'Chọn thiết bị',
      elic: isEnglish ? 'Electricity' : 'Đồng hồ điện',
      wt: isEnglish ? 'Water' : 'Đồng hồ nước',
      lock: isEnglish ? 'Lock' : 'Khóa',
      add: isEnglish ? 'Add Devices' : 'Mật khẩu mới:',
    };

    // Hàm cập nhật văn bản cho các phần tử theo id
    function translateItem(id, text) {
      var element = document.getElementById(id);
      if (element) element.textContent = text;
    }

    // Lặp qua tất cả các cặp khóa-giá trị trong translations
    for (var key in translations) {
      if (translations.hasOwnProperty(key)) {
        translateItem(key, translations[key]); // Cập nhật văn bản cho phần tử có id tương ứng
      }
    }
  });
});



