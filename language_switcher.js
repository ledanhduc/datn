function languageSwitcher(langBtnId,isEnglish, translations, elementSelectors) {
    var langBtn = document.getElementById(langBtnId);
  
    langBtn.addEventListener('click', function() {
    
        document.documentElement.lang = isEnglish ? 'en' : 'vi';
        console.log(isEnglish)
        // Hàm dịch nội dung
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

            h3Element.textContent = translations[translationKey] || h3Element.textContent;
            }
        });
        }

        // Dịch các phần tử theo các selector được truyền vào
        elementSelectors.forEach(selector => {
        var items = document.querySelectorAll(selector);
        translateItems(items);
        });

        // Cập nhật ngôn ngữ trên nút (đổi từ 'En' sang 'Vi' hoặc ngược lại)
        langBtn.textContent = isEnglish ? 'Vi' : 'En';
    });
  }
  
  // Export hàm để có thể tái sử dụng trong các trang khác
  export { languageSwitcher };
  
  
  