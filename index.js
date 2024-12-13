var navLinks = document.getElementById("navLinks");
function showMenu(){
    navLinks.style.right = "0"
}

function hideMenu(){
    navLinks.style.right = "-200px"
}

let slideInterval = setInterval(nextSlide, 6000);

function nextSlide() {
    let lists = document.querySelectorAll('.item');
    document.querySelector('.slide').appendChild(lists[0]);
}

document.getElementById('next').onclick = function() {
    nextSlide();
    clearInterval(slideInterval);
};

document.getElementById('prev').onclick = function() {
    let lists = document.querySelectorAll('.item');
    document.querySelector('.slide').prepend(lists[lists.length-1]);
    clearInterval(slideInterval);
};

ScrollReveal({
    reset: true,
    distance: '60px',
    duration: 2500,
    delay: 400
});

ScrollReveal().reveal('.an_logo', { delay: 200, origin: 'left' });
ScrollReveal({reset: false}).reveal('.nav-links li, a', { delay: 300, origin: 'right', interval: 200 });
ScrollReveal().reveal('.text-box, .course, .an', { delay: 400, origin: 'left' });
ScrollReveal().reveal('.product-col img', { delay: 500, origin: 'left', interval: 400 });
ScrollReveal().reveal('.mtdv-col', { delay: 500, origin: 'left', interval: 200 });
ScrollReveal().reveal('.founder-col', { delay: 200, origin: 'left', interval: 200 });
ScrollReveal().reveal('.an_1', { delay: 600, origin: 'top' });