const sidebarHTML = `
<div class="sidebar">
    <a id="ref_dashboard" href="#">
        <span class="material-icons-sharp">dashboard</span>
        <h3>Dashboard</h3>
    </a>

    <a id="ref_user" href="#">
        <span class="material-icons-sharp">person_outline</span>
        <h3>Users</h3>
    </a>

    <a id="ref_history" href="#">
        <span class="material-icons-sharp">history</span>
        <h3>History</h3>
    </a>

    <a id="ref_download" href="#">
        <span class="material-icons-sharp">receipt_long</span>
        <h3>Receipt</h3>
    </a>

    <a id="ref_settings" href="#">
        <span class="material-icons-sharp">settings</span>
        <h3>Settings</h3>
    </a>

    <a id="ref_add_devices" href="#" target="_blank">
        <span class="material-icons-sharp">add</span>
        <h3>Add Devices</h3>
    </a>
    
    <a id="ref_logout" class="logout">
        <span class="material-icons-sharp">logout</span>
        <h3>Logout</h3>
    </a>
</div>
`;

// Hàm để chèn sidebar vào một phần tử cụ thể
function loadParentSidebar(containerId) {
    const container = document.getElementById(containerId);
    if (container) {
        container.innerHTML = sidebarHTML;
    }
}

// Gọi hàm loadSidebar khi trang đã được tải
document.addEventListener('DOMContentLoaded', () => {
    loadParentSidebar('sidebar-container'); // 'sidebar-container' là id của phần tử chứa sidebar
});