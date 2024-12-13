const navHTML = `
    <button id="menu-btn">
        <span class="material-icons-sharp">
            menu
        </span>
    </button>
    <div class="dark-mode">
        <span class="material-icons-sharp active">
            light_mode
        </span>
        <span class="material-icons-sharp">
            dark_mode
        </span>
    </div>

    <div>
        <a id="langBtn" class="lang">Vi</a>
    </div>

    <div class="profile">
        <div class="info">
            <p>Hi, <b id="nameuser1"></b></p>
            <small class="text-muted">User</small>
        </div>
        <div class="profile-photo">
            <img src="images/ute_avt.jpeg" id="avt_user1">
    </div>
`;

// Hàm để chèn sidebar vào một phần tử cụ thể
function loadNavSidebar(containerId) {
    const container = document.getElementById(containerId);
    if (container) {
        container.innerHTML = navHTML;
    }
}

// Gọi hàm loadSidebar khi trang đã được tải
document.addEventListener('DOMContentLoaded', () => {
    loadNavSidebar('sidebar-nav'); 
});