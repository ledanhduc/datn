const sideMenu = document.querySelector('aside');
const menuBtn = document.getElementById('menu-btn');
const closeBtn = document.getElementById('close-btn');

const darkMode = document.querySelector('.dark-mode');

menuBtn.addEventListener('click', () => {
    sideMenu.style.display = 'block';
});

closeBtn.addEventListener('click', () => {
    sideMenu.style.display = 'none';
});

darkMode.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode-variables');
    darkMode.querySelector('span:nth-child(1)').classList.toggle('active');
    darkMode.querySelector('span:nth-child(2)').classList.toggle('active');
})

let a = 3;
Orders1.forEach(order => {
    const tr = document.createElement('tr');
    const trContent = `
        <td>${order.current}</td>
        <td>${a}</td>
        <td>${order.productNumber}</td>
        <td>${order.paymentStatus}</td>
    `;
    a++;
    tr.innerHTML = trContent;
    document.querySelector('table tbody').appendChild(tr);
});