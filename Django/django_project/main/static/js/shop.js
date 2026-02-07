const filterLinks = document.querySelectorAll(".trending-filter a")
const items = document.querySelectorAll(".trending-item")

items.forEach(item => item.classList.add("show"))

filterLinks.forEach(link => {
    link.addEventListener("click", (e) => {
        e.preventDefault()

        filterLinks.forEach(l => l.classList.remove("is_active"))
        link.classList.add("is_active")

        const filter = link.dataset.filter

        items.forEach(item => {
            const match =
                filter === "*" ||
                item.classList.contains(filter.replace(".", ""))

            if (match) {
                item.classList.remove("hide")
                item.classList.add("show")
            } else {
                item.classList.remove("show")
                item.classList.add("hide")
            }
        })
    })
})



const footerLinks = document.querySelectorAll(".main-trending-footer-ul a")

footerLinks.forEach(link => {
    link.addEventListener("click", (e) => {
        e.preventDefault()
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        })
    })
})

const breadcrumb = document.querySelectorAll(".page-heading-breadcrumb a")

breadcrumb.forEach(link => {
    link.addEventListener("click", (e) => {
        e.preventDefault()
        window.scrollTo({ top: 0, behavior: "smooth" })
    })
})

const headerSticky = document.querySelector(".header-sticky")

window.addEventListener("scroll", () => {
    if (window.scrollY > 150) {
        headerSticky.classList.add("background-header")
    }
    else {
        headerSticky.classList.remove("background-header")
    }
})


