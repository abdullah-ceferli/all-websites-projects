function navBarSticky() {
    const headerSticky = document.querySelector(".header-sticky")

    window.addEventListener("scroll", () => {
        if (window.scrollY > 300) {
            headerSticky.classList.add("background-header")
        }
        else {
            headerSticky.classList.remove("background-header")
        }
    })
}

function smoothUps() {
    const cards = document.querySelectorAll(".features-card a")
    const ctBtn = document.querySelectorAll(".cta-subscribe-search-input form button")
    const btn = document.querySelectorAll(".hero-search-input form button")

    cards.forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault()
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            })
        })
    })

    btn.forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault()
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            })
        })
    })

    ctBtn.forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault()
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            })
        })
    })
}

navBarSticky()

smoothUps()