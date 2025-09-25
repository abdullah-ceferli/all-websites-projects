let mainTxt = document.getElementById("mainTxt")
let player1Txt = document.getElementById("player1Txt")
let player2Txt = document.getElementById("player2Txt")
let player1Dice = document.getElementById("player1Dice")
let player2Dice = document.getElementById("player2Dice")
let rollDice = document.getElementById("rollDice")
let editDice = document.getElementById("editDice")
let dots1Ply = document.getElementById("dots1Ply")
let dots2Ply = document.getElementById("dots2Ply")
let dot1Ply1 = document.getElementById("dot1Ply1")
let dot2Ply1 = document.getElementById("dot2Ply1")
let dot3Ply1 = document.getElementById("dot3Ply1")
let dot4Ply1 = document.getElementById("dot4Ply1")
let dot5Ply1 = document.getElementById("dot5Ply1")
let dot6Ply1 = document.getElementById("dot6Ply1")
let dot1Ply2 = document.getElementById("dot1Ply2")
let dot2Ply2 = document.getElementById("dot2Ply2")
let dot3Ply2 = document.getElementById("dot3Ply2")
let dot4Ply2 = document.getElementById("dot4Ply2")
let dot5Ply2 = document.getElementById("dot5Ply2")
let dot6Ply2 = document.getElementById("dot6Ply2")

editDice.addEventListener("click", function() {
    player1Txt.innerHTML = prompt("Change Player1 name")
    player2Txt.innerHTML = prompt("Change Player2 name")
    if (player1Txt.innerHTML === "" || player2Txt.innerHTML === "") { // я незнаю но когда пишу два раза === "" то работает
        alert("Can you write there something")
        player1Txt.innerHTML = "Player 1"
        player2Txt.innerHTML = "Player 2"
    }
})
rollDice.addEventListener("click", function() {
    let randomNumberPly1 = Math.floor(Math.random() * 6) + 1 
    let randomNumberPly2 = Math.floor(Math.random() * 6) + 1
    blocking()

    if (randomNumberPly1 > randomNumberPly2) {
        mainTxt.innerHTML = `${player1Txt.innerHTML} Wins!!`
        
    }

    else if (randomNumberPly1 < randomNumberPly2) {
        mainTxt.innerHTML = `${player2Txt.innerHTML} Wins!!`
    }

    else{
        mainTxt.innerHTML = `No One Wins`
    }

    switchCase(randomNumberPly1, randomNumberPly2)
})

function blocking() {
    dot1Ply1.style.display = "block"
    dot2Ply1.style.display = "block"
    dot3Ply1.style.display = "block"
    dot4Ply1.style.display = "block"
    dot5Ply1.style.display = "block"
    dot6Ply1.style.display = "block"
    dot3Ply1.style.gridRow = "2"
    dot3Ply1.style.gridColumn = "1"
    dot1Ply2.style.display = "block"
    dot2Ply2.style.display = "block"
    dot3Ply2.style.display = "block"
    dot4Ply2.style.display = "block"
    dot5Ply2.style.display = "block"
    dot6Ply2.style.display = "block"
    dot3Ply2.style.gridRow = "2"
    dot3Ply2.style.gridColumn = "1"
}

function switchCase(a,b) {
    switch (a) {
        case 1:
            dot2Ply1.style.display = "none"
            dot3Ply1.style.display = "none"
            dot4Ply1.style.display = "none"
            dot5Ply1.style.display = "none"
            dot6Ply1.style.display = "none"
            break;
        case 2:
            dot2Ply1.style.display = "none"
            dot3Ply1.style.display = "none"
            dot4Ply1.style.display = "none"
            dot5Ply1.style.display = "none"
            break;
        case 3:
            dot2Ply1.style.display = "none"
            dot4Ply1.style.display = "none"
            dot5Ply1.style.display = "none"
            dot3Ply1.style.gridRow = "2"
            dot3Ply1.style.gridColumn = "2"
            break;
        case 4:
            dot3Ply1.style.display = "none"
            dot4Ply1.style.display = "none"
            break;
        case 5:
            dot4Ply1.style.display = "none"
            dot3Ply1.style.gridRow = "2"
            dot3Ply1.style.gridColumn = "2"
            break;
    }
    switch (b) {
        case 1:
            dot2Ply2.style.display = "none"
            dot3Ply2.style.display = "none"
            dot4Ply2.style.display = "none"
            dot5Ply2.style.display = "none"
            dot6Ply2.style.display = "none"
            break;
        case 2:
            dot2Ply2.style.display = "none"
            dot3Ply2.style.display = "none"
            dot4Ply2.style.display = "none"
            dot5Ply2.style.display = "none"
            break;
        case 3:
            dot2Ply2.style.display = "none"
            dot4Ply2.style.display = "none"
            dot5Ply2.style.display = "none"
            dot3Ply2.style.gridRow = "2"
            dot3Ply2.style.gridColumn = "2"
            break;
        case 4:
            dot3Ply2.style.display = "none"
            dot4Ply2.style.display = "none"
            break;
        case 5:
            dot4Ply2.style.display = "none"
            dot3Ply2.style.gridRow = "2"
            dot3Ply2.style.gridColumn = "2"
            break;
    }
}