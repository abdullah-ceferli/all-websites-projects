const menuBtn = document.getElementById("menuBtn");
const menu = document.getElementById("menu");
const profileBtn = document.getElementById("profileBtn");
const profileMenu = document.getElementById("profileMenu");
const searchInput = document.getElementById("searchInput");
const suggestionsBox = document.getElementById("suggestionsBox");
const addCircle = document.getElementById("addCircle");
const inputContainer = document.getElementById("inputContainer");
const linkInput = document.getElementById("linkInput");
const nameInput = document.getElementById("nameInput");
const submitButton = document.getElementById("submitButton");
const cancelButton = document.getElementById("cancelButton");
const circleContainer = document.getElementById("circleContainer");

// Open menu when clicking dots menu
menuBtn.addEventListener("click", () => {
    menu.style.display = menu.style.display === "block" ? "none" : "block";
});

// Close menu when clicking outside dots menu
document.addEventListener("click", (event) => {
    if (!menuBtn.contains(event.target) && !menu.contains(event.target)) {
        menu.style.display = "none";
    }
});

// Toggle profile menu on click
profileBtn.addEventListener("click", () => {
    profileMenu.classList.toggle("show");
});

// Close profile menu when clicking outside
document.addEventListener("click", (event) => {
    if (!profileBtn.contains(event.target) && !profileMenu.contains(event.target)) {
        profileMenu.classList.remove("show");
    }
});

// Example data with URLs
const suggestions = [
    { name: "Wiki", url: "../html/wiki.html" },
    { name: "My game", url: "../html/game.html" },
    { name: "My all works", url: "../html/allworks.html" }
];

// Function to show suggestions
function showSuggestions(value) {
    suggestionsBox.innerHTML = ""; // Clear previous results
    if (!value) {
        suggestionsBox.style.display = "none";
        return;
    }

    let filteredSuggestions = suggestions.filter(item =>
        item.name.toLowerCase().includes(value.toLowerCase())
    );

    if (filteredSuggestions.length === 0) {
        suggestionsBox.style.display = "none";
        return;
    }

    filteredSuggestions.forEach(item => {
        let div = document.createElement("div");
        div.textContent = item.name;
        div.addEventListener("click", () => {
            window.location.href = item.url; // Redirect to the selected page
        });
        suggestionsBox.appendChild(div);
    });

    suggestionsBox.style.display = "block";
}

// Event listeners for search functionality
searchInput.addEventListener("keyup", () => showSuggestions(searchInput.value));
document.addEventListener("click", (event) => {
    if (!searchInput.contains(event.target) && !suggestionsBox.contains(event.target)) {
        suggestionsBox.style.display = "none";
    }
});

// Open the input box and change background color
addCircle.addEventListener("click", () => {
    inputContainer.style.display = "flex";
    document.body.style.backgroundColor = "#332a2a"; // Dark gray-brown
});

// Function to close input box and reset background
function closeInputContainer() {
    inputContainer.style.display = "none";
    document.body.style.backgroundColor = "white"; // Reset background to white
    linkInput.value = "";
    nameInput.value = "";
    validateInputs();
}

// Close the input box when clicking cancel
cancelButton.addEventListener("click", () => {
    closeInputContainer();
});

// Function to validate inputs
function validateInputs() {
    if (linkInput.value && nameInput.value) {
        submitButton.disabled = false;
        submitButton.classList.add("active");
    } else {
        submitButton.disabled = true;
        submitButton.classList.remove("active");
    }
}

// Add input validation event listeners
linkInput.addEventListener("input", validateInputs);
nameInput.addEventListener("input", validateInputs);

// Submit new shortcut circle
submitButton.addEventListener("click", () => {
    if (!linkInput.value || !nameInput.value) return;

    const newCircle = document.createElement("a");
    newCircle.classList.add("circle");
    newCircle.href = linkInput.value;
    newCircle.target = "_blank";

    const favicon = document.createElement("img");
    try {
        favicon.src = `https://www.google.com/s2/favicons?domain=${new URL(linkInput.value).hostname}`;
    } catch (error) {
        favicon.style.display = "none"; // If invalid URL, hide favicon
    }
    
    favicon.onerror = () => favicon.style.display = "none"; // Hide favicon if not found
    newCircle.appendChild(favicon);
    
    circleContainer.prepend(newCircle); // Add to the left side

    setTimeout(() => {
        closeInputContainer(); // Close input and reset background after a small delay
    }, 100);
});

var modal = document.getElementById("signInModal");
var btn = document.getElementById("signInBtn");
var span = document.getElementsByClassName("close")[0];
var form = document.getElementById("signInForm");

btn.onclick = function() {
            modal.style.display = "block";
}

span.onclick = function() {
            modal.style.display = "none";
}

window.onclick = function(event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
}
