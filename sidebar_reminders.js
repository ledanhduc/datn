const remindersHTML = `
<div class="reminders">
    <div class="header" id="trans_reminders">
        <h2>Reminders</h2>
        <span class="material-icons-sharp">
            notifications_none
        </span>
    </div>

    <div class="notification">
        <div class="icon">
            <span class="material-icons-sharp">
                volume_up
            </span>
        </div>
        <div class="content">
            <div class="info" id="trans_paymentduedate">
                <h3>Payment due date</h3>
                <small class="text_muted">
                    31/12/2023
                </small>
            </div>
            <span class="material-icons-sharp">
                more_vert
            </span>
        </div>
    </div>

    <div class="notification deactive">
        <div class="icon">
            <span class="material-icons-sharp">
                receipt_long
            </span>
        </div>
        <div class="content">
            <div class="info" id="trans_lastmonthsbill">
                <h3>Last month's bill</h3>
                <small class="text_muted">
                    1.500k vnd
                </small>
            </div>
            <span class="material-icons-sharp">
                more_vert
            </span>
        </div>
    </div>

    <div class="notification add-reminder">
        <div id="trans_respond">
            <span class="material-icons-sharp">
                forward_to_inbox
            </span>
            <h3>Respond</h3>
        </div>
    </div>

</div>
`;

// Hàm để chèn sidebar vào một phần tử cụ thể
function loadRemindersSidebar(containerId) {
    const container = document.getElementById(containerId);
    if (container) {
        container.innerHTML = remindersHTML;
    }
}

// Gọi hàm loadSidebar khi trang đã được tải
document.addEventListener('DOMContentLoaded', () => {
    loadRemindersSidebar('sidebar-reminders'); // 'sidebar-container' là id của phần tử chứa sidebar
});