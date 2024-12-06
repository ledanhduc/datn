document.addEventListener('DOMContentLoaded', () => {
  var langBtn = document.getElementById('langBtn');

  langBtn.addEventListener('click', function() {
    // Lấy ngôn ngữ hiện tại của tài liệu và kiểm tra
    var lang = document.documentElement.lang;
    var isEnglish = lang !== 'en';
    
    // Thay đổi ngôn ngữ tài liệu
    document.documentElement.lang = isEnglish ? 'en' : 'vi';

    // Định nghĩa các bản dịch
    var translations = {
      Home: isEnglish ? 'Home' : 'Trang chủ',
      Products: isEnglish ? 'Products' : 'Sản phẩm',
      AboutUs: isEnglish ? 'About Us' : 'Về chúng tôi',
      Contact: isEnglish ? 'Contact' : 'Liên hệ',
      Welcome: isEnglish ? 'Welcome' : 'Xin chào',
      eyn: isEnglish ? 'Everything you need is ready © EVS' : 'Tất cả những gì bạn cần đã sẵn sàng © EVS',
      FollowUs: isEnglish ? 'Follow Us' : 'Theo dõi chúng tôi',
      forget_password: isEnglish ? 'Forget Password ?' : 'Quên mật khẩu ?',
      yhc: isEnglish ? 'You have account?' : 'Đã có tài khoản ?',
      // Forgotpassword: isEnglish ? 'Forgot password?' : 'Quên mật khẩu?',
      Signin: isEnglish ? 'Sign In' : 'Đăng nhập',
      fgp: isEnglish ? 'Reset Password' : 'Đặt lại',
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
    langBtn.textContent = isEnglish ? 'Vi' : 'En';
  });
});


