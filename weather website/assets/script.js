const apiKey = "9b45c0fdebf101f1dade3098fd1228e6"
const input = document.getElementById("weatherCountryInput")
const locationEl = document.getElementById("location")
const tempMainEl = document.getElementById("weatherNowTempMain")
const feelsLikeEl = document.getElementById("weatherNowTemp")
const stateEl = document.getElementById("weatherNowState")
const humidityEl = document.getElementById("weatherNowWet")
const windEl = document.getElementById("weatherNowSpeed")
const visibilityEl = document.getElementById("weatherNowVisibility")
const currentCountryEl = document.getElementById("currentCountry")
const searchBtn = document.getElementById("searchBtn")
const title = document.getElementById("title")

const forecastDays = [
    { day: "Mon", to: "tempMonTo", from: "tempMonFrom", date: "dayMon" },
    { day: "Tue", to: "tempTueTo", from: "tempTueFrom", date: "dayTue" },
    { day: "Wed", to: "tempAugTo", from: "tempAugFrom", date: "dayWed" },
    { day: "Thu", to: "tempThuTo", from: "tempThuFrom", date: "dayThu" },
    { day: "Fri", to: "tempFriTo", from: "tempFriFrom", date: "dayFri" },
    { day: "Sat", to: "tempSatTo", from: "tempSatFrom", date: "daySat" },
    { day: "Sun", to: "tempSunTo", from: "tempSunFrom", date: "daySun" },
]

searchBtn.addEventListener("click", function () {
    const city = input.value.trim()
    if (city) {
        getWeather(city)
    }
})

input.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
        const city = input.value.trim()
        if (city) {
            getWeather(city)
        }
    }
})

function getWeather(city) {
    fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`)
        .then(response => response.json())
        .then(geoData => {
            if (geoData.length === 0) {
                alert("City not found!")
                return
            }
            const { lat, lon, country, name } = geoData[0]

            fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`)
                .then(response => response.json())
                .then(weather => {
                    locationEl.innerHTML = `${name}, ${country}`
                    title.innerHTML = `Weather, ${name}`
                    currentCountryEl.innerHTML = `Current: ${name}`
                    tempMainEl.innerHTML = `${Math.round(weather.main.temp)}°C`
                    feelsLikeEl.innerHTML = `${Math.round(weather.main.feels_like)}°C`
                    stateEl.innerHTML = weather.weather[0].description
                    humidityEl.innerHTML = `${weather.main.humidity}%`
                    windEl.innerHTML = `${Math.round(weather.wind.speed * 3.6)} km/h`
                    visibilityEl.innerHTML = `${weather.visibility / 1000} km`

                    updateWeatherIcon(weather.weather[0].icon, document.getElementById("weatherNowIcons"))
                })

            fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`)
                .then(response => response.json())
                .then(forecast => {
                    updateForecast(forecast)
                })
        })
        .catch(err => {
            console.error("Error:", err)
            alert("Could not fetch weather")
        })
}

function updateWeatherIcon(iconCode, iconElement) {
    const iconMap = {
        "01d": "sun", "01n": "moon", "02d": "cloud-sun", "02n": "cloud-moon",
        "03d": "cloud", "03n": "cloud", "04d": "cloud", "04n": "cloud",
        "09d": "cloud-rain", "09n": "cloud-rain", "10d": "cloud-rain", "10n": "cloud-rain",
        "11d": "cloud-lightning", "11n": "cloud-lightning", "13d": "snow", "13n": "snow",
        "50d": "mist", "50n": "mist"
    }
    const iconClass = iconMap[iconCode] || "cloud"
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-${iconClass}" aria-hidden="true">
        ${getIconPath(iconClass)}
    </svg>`
    iconElement.innerHTML = svg
}

function getIconPath(iconClass) {
    const paths = {
        "sun": `<circle cx="12" cy="12" r="4"></circle><path d="M12 2v2"></path><path d="M12 20v2"></path><path d="m4.93 4.93 1.41 1.41"></path><path d="m17.66 17.66 1.41 1.41"></path><path d="M2 12h2"></path><path d="M20 12h2"></path><path d="m6.34 17.66-1.41 1.41"></path><path d="m19.07 4.93-1.41 1.41"></path>`,
        "moon": `<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>`,
        "cloud": `<path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"></path>`,
        "cloud-sun": `<path d="M12 2v2"></path><path d="m4.93 4.93 1.41 1.41"></path><path d="M20 12h2"></path><path d="m19.07 4.93-1.41 1.41"></path><path d="M15.947 12.65a4 4 0 0 0-5.925-4.128"></path><path d="M13 22H7a5 5 0 1 1 4.9-6H13a3 3 0 0 1 0 6Z"></path>`,
        "cloud-moon": `<path d="M13 22H7a5 5 0 1 1 4.9-6H13a3 3 0 0 1 0 6Z"></path><path d="M10.083 9.36a4 4 0 0 0 5.606-5.607"></path><path d="M10.5 6a9 9 0 0 0 9 9"></path>`,
        "cloud-rain": `<path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"></path><path d="M16 14v6"></path><path d="M8 14v6"></path><path d="M12 16v6"></path>`,
        "cloud-lightning": `<path d="M6 16.326A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 .5 8.973"></path><path d="m13 12-3 5h4l-3 5"></path>`,
        "snow": `<path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"></path><path d="M12 12v6"></path><path d="m10 16 2-2 2 2"></path>`,
        "mist": `<path d="M4 12h16"></path><path d="M2 15h10"></path><path d="M12 15h10"></path><path d="M2 9h10"></path><path d="M14 9h6"></path>`
    }
    return paths[iconClass] || paths["cloud"]
}

function updateForecast(forecast) {
    const dailyData = forecast.list.filter(item => item.dt_txt.includes("12:00:00")).slice(0, 7)
    dailyData.forEach((dayData, index) => {
        const forecastDay = forecastDays[index]
        const date = new Date(dayData.dt * 1000)
        const dayEl = document.getElementById(forecastDay.date)
        const tempToEl = document.getElementById(forecastDay.to)
        const tempFromEl = document.getElementById(forecastDay.from)
        const iconEl = dayEl.closest("div").parentElement.querySelector("svg")

        if (dayEl && tempToEl && tempFromEl && iconEl) {
            dayEl.textContent = date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
            tempToEl.textContent = `${Math.round(dayData.main.temp_max)}°`
            tempFromEl.textContent = `${Math.round(dayData.main.temp_min)}°`
            updateWeatherIcon(dayData.weather[0].icon, iconEl)
        } 
        else {
            console.error(`Element missing for ${forecastDay.day}:`, { dayEl, tempToEl, tempFromEl, iconEl })
        }
    })
}