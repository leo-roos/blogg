var nav;

document.addEventListener("DOMContentLoaded", function() {
    nav = document.querySelectorAll(".sidebar-items .sidebar-item .items .item");
    
    const currentPage = window.location.pathname;
    for (let index = 0; index < nav.length; index++) {
        const item = nav[index];
        const page = item.getAttribute("data-page");
        if (currentPage == page) {
            item.classList.add("active")
        }
    }
})