document.addEventListener('DOMContentLoaded', () => {
  var langBtn = document.getElementById('langBtn');
  // console.log(langBtn)

  langBtn.addEventListener('click', function() {
    // Xác định ngôn ngữ
    var lang = document.documentElement.lang;
    var isEnglish = lang !== 'en';
    
    // Thay đổi ngôn ngữ trong trang
    document.documentElement.lang = isEnglish ? 'en' : 'vi';  

    // Đối tượng translations với các giá trị tùy chỉnh cho từng ngôn ngữ
    var translations = {
      dashboard: isEnglish ? 'Dashboard' : 'Bảng điều khiển',
      user: isEnglish ? 'Users' : 'Người dùng',
      history: isEnglish ? 'History' : 'Lịch sử',
      analytics: isEnglish ? 'Analytics' : 'Phân tích',
      control: isEnglish ? 'Control' : 'Điều khiển',
      statistics: isEnglish ? 'Statistics' : 'Thống kê',
      download: isEnglish ? 'Receipt' : 'Hoá đơn',
      settings: isEnglish ? 'Settings' : 'Cài đặt',
      add_devices: isEnglish ? 'Add Devices' : 'Thêm thiết bị',
      logout: isEnglish ? 'Logout' : 'Đăng xuất',
      reminders: isEnglish ? 'Reminders' : 'Thông báo',
      paymentduedate: isEnglish ? 'Payment due date' : 'Hạn thanh toán', 
      lastmonthsbill: isEnglish ? "Last month's bill" : "Hoá đơn tháng trước",
      respond: isEnglish ? "Respond" : "Phản hồi"
    };

    function translateItems(items) {
      items.forEach(function(item) {
        var h2Element = item.querySelector('h2'); 
        var h3Element = item.querySelector('h3');  
        
        if (h2Element) {
          var translationKey = h2Element.parentElement.id.replace('trans_', '');
          h2Element.textContent = translations[translationKey] || h2Element.textContent;
        }
        
        if (h3Element) {
          var translationKey = h3Element.parentElement.id;
          if (translationKey.includes('ref_')) {
            translationKey = translationKey.replace('ref_', '');
          } else if (translationKey.includes('trans_')) {
            translationKey = translationKey.replace('trans_', '');
          }
    
          // Cập nhật nội dung của h3Element bằng key dịch tương ứng
          h3Element.textContent = translations[translationKey] || h3Element.textContent;
        }
      });
    }
    // Dịch sidebar và reminders
    var sidebarItems = document.querySelectorAll('.sidebar a');
    var reminderItems = document.querySelectorAll('.reminders div');
    
    translateItems(sidebarItems);
    translateItems(reminderItems);

    langBtn.textContent = isEnglish ? 'Vi' : 'En';
  });
});