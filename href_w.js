
var pageLinks_w = [
    { id: 'ref_statistics', href: 'statistics_w.html' },
    { id: 'ref_analytics', href: 'analytics_w.html' },
    { id: 'ref_setup_w', href: 'setup_w.html' },
    { id: 'ref_download', href: 'receipt_w.html' },
  ];

document.addEventListener('DOMContentLoaded', () => {
  var currentPath = window.location.pathname;
  
  for (var i = 0; i < pageLinks_w.length; i++) {
      var pageLink = pageLinks_w[i];
      var element = document.getElementById(pageLink.id);

      if (element) {  // Kiểm tra nếu phần tử tồn tại
          element.href = pageLink.href;

          if (currentPath.includes(pageLink.href)) {
              element.classList.add('active');
          }
      }
  }
});
