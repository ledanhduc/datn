function updateLinkHrefs(pageLinks, currentUrl, idDevice, value) {
    pageLinks.forEach(link => {
      const linkElement = document.getElementById(link.id);
      if (linkElement) {
        // Kiểm tra xem đường dẫn của trang hiện tại có chứa href của link không
        if (currentUrl.includes(link.href)) {
          // Nếu đúng, thay đổi href thành '#'
          linkElement.href = '#';
        } else {
          // Nếu không, thêm tham số id vào đường dẫn của các liên kết còn lại
          linkElement.href = `${link.href}?id=${idDevice || value}`;
        }
      }
    });
}
  
// pageLinks.forEach(link => {
//   const linkElement = document.getElementById(link.id);
//   if (linkElement) {
//       // Thêm tham số `id=${value}` vào đường dẫn
//       linkElement.href = `${link.href}?id=${value}`;
//   }
// });
