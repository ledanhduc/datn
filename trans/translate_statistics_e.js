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
      Voltage: isEnglish ? 'Voltage' : 'Điện áp',
      Frequency: isEnglish ? 'Frequency' : 'Tần số',
      Current: isEnglish ? 'Current' : 'Dòng',
      Power: isEnglish ? 'Power' : 'Công suất',
      Energy: isEnglish ? 'Energy' : 'Năng lượng',
      Eom: isEnglish ? 'Energy of Month' : 'Năng lượng / tháng',
      Ecd: isEnglish ? 'Energy chart daily' : 'Biểu đồ năng lượng',
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


