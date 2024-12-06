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
      // Blog: isEnglish ? 'Blog' : 'Đồng hồ điện',
      Contact: isEnglish ? 'Contact' : 'Liên hệ',
      Welcome: isEnglish ? 'Welcome' : 'Xin chào',
      eyn: isEnglish ? 'Everything you need is ready © EVS' : 'Tất cả những gì bạn cần đã sẵn sàng © EVS',
      FollowUs: isEnglish ? 'Follow Us' : 'Theo dõi chúng tôi tại',
      Password: isEnglish ? 'Password' : 'Mật khẩu',
      SignIn: isEnglish ? 'Sign In' : 'Đăng nhập',
      // rmb_ac: isEnglish ? 'Remember me' : 'Khóa',
      Forgotpassword: isEnglish ? 'Forgot password?' : 'Quên mật khẩu?',
      sigin: isEnglish ? 'Sign In' : 'Đăng nhập',
      dhacc: isEnglish ? 'Sign Up' : 'Đăng ký',
      // dhacc: isEnglish ? "Don't have an account?" : "Khóa",
      IDDevice: isEnglish ? 'ID Device' : 'ID Thiết bị',
      SignUp: isEnglish ? 'Sign Up' : 'Đăng ký',
      Passwordreg: isEnglish ? 'Password' : 'Mật khẩu',
      // termscondi: isEnglish ? 'I agree to the terms & conditions' : 'Đồng ý các điều khoản',
      sinupinp: isEnglish ? 'Sign Up' : 'Đăng ký',
      // Already: isEnglish ? 'Already have an account?' : 'Bạn đã có tài khoản?',
      SignInreg: isEnglish ? 'Sign In' : 'Đăng nhập',
      
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


