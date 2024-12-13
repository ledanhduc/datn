
var pageLinks_e = [
    { id: 'ref_statistics', href: 'statistics_e.html' },
    { id: 'ref_analytics', href: 'analytics_e.html' },
    { id: 'ref_control', href: 'control_e.html' },
    { id: 'ref_download', href: 'receipt_e.html' },
  ];

document.addEventListener('DOMContentLoaded', () => {
  var currentPath = window.location.pathname;
  
  for (var i = 0; i < pageLinks_e.length; i++) {
      var pageLink = pageLinks_e[i];
      var element = document.getElementById(pageLink.id);

      if (element) {  // Kiểm tra nếu phần tử tồn tại
          element.href = pageLink.href;

          if (currentPath.includes(pageLink.href)) {
              element.classList.add('active');
          }
      }
  }
});
