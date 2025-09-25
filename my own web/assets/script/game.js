const searchInput = document.getElementById("searchInput");
const suggestionsBox = document.getElementById("suggestionsBox");
const profileBtn = document.getElementById("profileBtn");
const profileMenu = document.getElementById("profileMenu");



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

let button = document.getElementById("camera-btn");

  // Change text on hover
  button.addEventListener("mouseenter", function() {
    button.textContent = "Screen Shot";
  });

  // Change back when mouse leaves
  button.addEventListener("mouseleave", function() {
    button.textContent = "Scr Sht";
  });

  // Screenshot function
  button.addEventListener("click", async function() {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: { mediaSource: "screen" } });
      const video = document.createElement("video");
      video.srcObject = stream;
      video.play();

      video.onplaying = async () => {
        await new Promise(resolve => setTimeout(resolve, 500));

        const canvas = document.getElementById("screenshotCanvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);

        let link = document.createElement("a");
        link.href = canvas.toDataURL("image/png");
        link.download = "screenshot.png";
        link.click();

        setTimeout(() => {
          stream.getTracks().forEach(track => track.stop());
        }, 1000);
      };
    } catch (err) {
      console.error("Error capturing screen: ", err);
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

document.getElementById("shareButton").onclick = function() {
    var currentURL = window.location.href;  // Get the current webpage URL
    var subject = "Check out this page!";
    var body = "Hey, I found this cool page: " + currentURL;
    window.location.href = "mailto:?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
}
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
 
// Get the buttons and sections
var section1Btn = document.getElementById("section1-btn");
var section2Btn = document.getElementById("section2-btn");
var section3Btn = document.getElementById("section3-btn");

var section1 = document.getElementById("section1");
var section2 = document.getElementById("section2");
var section3 = document.getElementById("section3");

// Function to show a specific section and hide the others
function showSection(sectionToShow) {
    // Hide all sections
    section1.classList.remove("active");
    section2.classList.remove("active");
    section3.classList.remove("active");

    // Show the selected section
    sectionToShow.classList.add("active");
}

// Add event listeners to buttons
section1Btn.onclick = function() {
    showSection(section1);
}

section2Btn.onclick = function() {
    showSection(section2);
}

section3Btn.onclick = function() {
    showSection(section3);
}

// Optionally, you can show the first section by default
showSection(section1);