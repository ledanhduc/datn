document.addEventListener('DOMContentLoaded', () => {
  var langBtn = document.getElementById('langBtn');
  // console.log(langBtn)
  // langBtn.replaceWith(langBtn.cloneNode(true));
  // langBtn = document.getElementById('langBtn'); // Lấy lại phần tử sau khi đã clone

  langBtn.addEventListener('click', function() {
  //   // Xác định ngôn ngữ
    var lang = document.documentElement.lang;
    var isEnglish = lang === 'en';
    
    // Thay đổi ngôn ngữ trong trang
    document.documentElement.lang = isEnglish ? 'en' : 'vi';
      // Đối tượng translations với các giá trị tùy chỉnh cho từng ngôn ngữ
    var translations = {
      chpassword: isEnglish ? 'Change Password' : 'Đổi mật khẩu',
      upinfo: isEnglish ? 'Update Information' : 'Cập nhật thông tin',
    };

    function translateItems(items) {
      items.forEach(function(item) {
        // Tìm h2 và h3 trong mỗi item
        var h3Element = item.querySelector('h3');  
        if (h3Element) {
          var translationKey = item.id.replace('trans_', ''); // Lấy ID từ phần tử cha
          h3Element.textContent = translations[translationKey] || h3Element.textContent;
        }
      });
    }

    // Lấy tất cả các phần tử div trong profile
    var reminderItems = document.querySelectorAll('.profile div');
    // var reminderItems_1 = document.querySelectorAll('.input_in4 #trans_phnumber');
    
    // Dịch các phần tử reminderItems
    translateItems(reminderItems);
    


    // Thay đổi văn bản của nút ngôn ngữ
    // langBtn.textContent = isEnglish ? 'Vi' : 'En';
  });
});



