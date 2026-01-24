const txt = document.getElementById("txt")
const btn = document.getElementById("mySwitch")
const slider = document.getElementById("slider")
const body = document.querySelector("body")

btn.addEventListener("change", () => {
    const isOn = btn.checked

    if (isOn) {
        txt.style.color = "red"
        slider.classList.add('on')
        slider.classList.remove('off')
        body.style.backgroundColor = "black"
    } 
    else {
        txt.style.color = "black"
        slider.classList.add('off')
        slider.classList.remove('on')
        body.style.backgroundColor = "white"
    }
})