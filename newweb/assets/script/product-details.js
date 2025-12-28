const headerSticky = document.querySelector(".header-sticky")

window.addEventListener("scroll", () => {
    if (window.scrollY > 150) {
        headerSticky.classList.add("background-header")
    }
    else {
        headerSticky.classList.remove("background-header")
    }
})

const infoLinks = document.querySelectorAll(".game-info a")

infoLinks.forEach(link => {
    link.addEventListener("click", (e) => {
        e.preventDefault()
        window.scrollTo({ top: 0, behavior: "smooth" })
    })
})
