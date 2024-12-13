
// document.getElementById('ref_user').href = "profile_en.html";

// document.getElementById('ref_history').href = "history_en.html";

// document.getElementById('ref_analytics').href = "analytics_en.html";

// document.getElementById('ref_control').href = "control_en.html";

// document.getElementById('ref_statistics').href = "statistics_en.html";

// document.getElementById('ref_download').href = "#";

// document.getElementById('ref_settings').href = "#";

// document.getElementById('ref_addDevices').href = "#";

var pageLinks = [
    { id: 'ref_dashboard', href: 'dashboard.html' },
    { id: 'ref_user', href: 'profile.html' },
    { id: 'ref_history', href: 'history.html' },
    // { id: 'ref_analytics', href: 'analytics_en.html' },
    // { id: 'ref_control', href: 'control_en.html' },
    // { id: 'ref_statistics', href: 'statistics_en.html' },
    { id: 'ref_download', href: 'receipt.html' },
    { id: 'ref_add_devices', href: 'add_devices.html'},

  ];
  
// var currentPath = window.location.pathname;

// for (var i = 0; i < pageLinks.length; i++) {
//   var pageLink = pageLinks[i];
//   var element = document.getElementById(pageLink.id);
  
//   element.href = pageLink.href;

//   if (currentPath.includes(pageLink.href)) {
//     element.classList.add('active');
//   }
// }

document.addEventListener('DOMContentLoaded', () => {
  var currentPath = window.location.pathname;
  
  for (var i = 0; i < pageLinks.length; i++) {
      var pageLink = pageLinks[i];
      var element = document.getElementById(pageLink.id);

      if (element) {  // Kiểm tra nếu phần tử tồn tại
          element.href = pageLink.href;

          if (currentPath.includes(pageLink.href)) {
              element.classList.add('active');
          }
      }
  }
});

