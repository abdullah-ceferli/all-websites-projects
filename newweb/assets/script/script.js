const headerSticky = document.querySelector(".header-sticky")

window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
        headerSticky.classList.add("background-header")
    }
    else {
        headerSticky.classList.remove("background-header")
    }
})

