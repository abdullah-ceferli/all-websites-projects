function navBarSticky() {
    const headerSticky = document.querySelector(".header-sticky")

    window.addEventListener("scroll", () => {
        if (window.scrollY > 150) {
            headerSticky.classList.add("background-header")
        }
        else {
            headerSticky.classList.remove("background-header")
        }
    })
}

function upSender() {
    const breadcrumb = document.querySelectorAll(".page-heading-breadcrumb a")

    breadcrumb.forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault()
            window.scrollTo({ top: 0, behavior: "smooth" })
        })
    })
}

navBarSticky()

upSender()