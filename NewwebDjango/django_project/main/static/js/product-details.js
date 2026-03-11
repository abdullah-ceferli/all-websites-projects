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

function tabHider() {
    const tabLinks = document.querySelectorAll('.nav-item-link')
    const tabItems = document.querySelectorAll('.tab-pane')

    function initTabs() {
        tabLinks.forEach((link, index) => {
            if (index === 0) {
                link.classList.add('active')
            } else {
                link.classList.remove('active')
            }
        })

        tabItems.forEach((item, index) => {
            if (index === 0) {
                item.classList.add('show')
                item.classList.remove('hide')
            } else {
                item.classList.add('hide')
                item.classList.remove('show')
            }
        });
    }

    initTabs()

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
                } else {
                    item.classList.remove('show')
                    item.classList.add('hide')
                }
            })
        })
    })
}

function smoothUps() {
    const breadcrumb = document.querySelectorAll(".page-heading-breadcrumb a")
    const infoLinks = document.querySelectorAll(".game-info a")

    breadcrumb.forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault()
            window.scrollTo({ top: 0, behavior: "smooth" })
        })
    })

    infoLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault()
            window.scrollTo({ top: 0, behavior: "smooth" })
        })
    })
}

navBarSticky()

tabHider()

smoothUps()