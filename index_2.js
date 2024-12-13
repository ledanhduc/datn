document.addEventListener('DOMContentLoaded', () => {
    const sideMenu = document.querySelector('aside');
    const menuBtn = document.getElementById('menu-btn');
    const closeBtn = document.getElementById('close-btn');
    const darkMode = document.querySelector('.dark-mode');

    // Function to set dark mode
    function setDarkMode(enable) {
        if (enable) {
            document.body.classList.add('dark-mode-variables');
            darkMode.querySelector('span:nth-child(1)').classList.remove('active');
            darkMode.querySelector('span:nth-child(2)').classList.add('active');
            document.cookie = "darkMode=enabled; path=/; max-age=" + (30 * 24 * 60 * 60); // 1 year
        } else {
            document.body.classList.remove('dark-mode-variables');
            darkMode.querySelector('span:nth-child(1)').classList.add('active');
            darkMode.querySelector('span:nth-child(2)').classList.remove('active');
            document.cookie = "darkMode=disabled; path=/; max-age=" + (30 * 24 * 60 * 60); // 1 year
        }
    }

    // Check for existing dark mode preference
    function checkDarkModeCookie() {
        const cookies = document.cookie.split('; ');
        const darkModeCookie = cookies.find(row => row.startsWith('darkMode='));
        
        if (darkModeCookie) {
            const mode = darkModeCookie.split('=')[1];
            setDarkMode(mode === 'enabled');
        }
    }

    // Initial check for dark mode preference
    checkDarkModeCookie();

    menuBtn.addEventListener('click', () => {
        sideMenu.style.display = 'block';
    });

    closeBtn.addEventListener('click', () => {
        sideMenu.style.display = 'none';
    });

    darkMode.addEventListener('click', () => {
        const isDarkModeCurrently = document.body.classList.contains('dark-mode-variables');
        setDarkMode(!isDarkModeCurrently);
    });
});