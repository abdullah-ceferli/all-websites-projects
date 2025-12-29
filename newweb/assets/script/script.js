const headerSticky = document.querySelector(".header-sticky")

window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
        headerSticky.classList.add("background-header")
    }
    else {
        headerSticky.classList.remove("background-header")
    }
})

const cards = document.querySelectorAll(".features-card a")

cards.forEach(link => {
    link.addEventListener("click", (e) => {
        e.preventDefault()
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        })
    })
})

const btn = document.querySelectorAll(".hero-search-input form button")

btn.forEach(link => {
    link.addEventListener("click", (e) => {
        e.preventDefault()
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        })
    })
})

const ctBtn = document.querySelectorAll(".cta-subscribe-search-input form button")

ctBtn.forEach(link => {
    link.addEventListener("click", (e) => {
        e.preventDefault()
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        })
    })
})