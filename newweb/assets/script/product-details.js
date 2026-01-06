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
    
const tabLinks = document.querySelectorAll('.nav-item-link')
const tabItems = document.querySelectorAll('.tab-pane')

tabItems.forEach(item => item.classList.add('show'))

tabLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault()

        tabLinks.forEach(l => l.classList.remove('active'))
        link.classList.add('active')

        const targetId = link.dataset.bsTarget.replace('#', '')

        tabItems.forEach(item => {
            const match = item.id === targetId

            if (match) {
                item.classList.remove('hide')
                item.classList.add('show')
            } 
            else {
                item.classList.remove('show')
                item.classList.add('hide')
            }
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