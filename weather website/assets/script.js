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
    { to: "tempMonTo", from: "tempMonFrom", date: "dayMon" },
    { to: "tempTueTo", from: "tempTueFrom", date: "dayTue" },
    { to: "tempWedTo", from: "tempWedFrom", date: "dayWed" },
    { to: "tempThuTo", from: "tempThuFrom", date: "dayThu" },
    { to: "tempFriTo", from: "tempFriFrom", date: "dayFri" },
    { to: "tempSatTo", from: "tempSatFrom", date: "daySat" },
    { to: "tempSunTo", from: "tempSunFrom", date: "daySun" },
]

// ================= EVENTS =================

searchBtn.addEventListener("click", () => startSearch())
input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") startSearch()
})

function startSearch() {
    const city = input.value.trim()
    if (!city) return
    showLoading()
    getWeather(city)
}

// ================= LOADING =================

function showLoading() {
    tempMainEl.innerHTML = `<div class="loader"></div>`
    feelsLikeEl.innerHTML = "--"
    stateEl.innerHTML = "--"
    humidityEl.innerHTML = "--"
    windEl.innerHTML = "--"
    visibilityEl.innerHTML = "--"
    searchBtn.disabled = true
}

function resetButton() {
    searchBtn.disabled = false
}

// ================= WEATHER =================

function getWeather(city) {

    fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`)
        .then(res => res.json())
        .then(geo => {

            if (!geo.length) {
                alert("City not found!")
                resetButton()
                return
            }

            const { lat, lon, country, name } = geo[0]

            fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`)
                .then(res => res.json())
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

                    updateWeatherIcon(
                        weather.weather[0].icon,
                        document.getElementById("weatherNowIcons")
                    )

                    resetButton()
                })
                .catch(() => {
                    alert("Weather load error")
                    resetButton()
                })

            fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`)
                .then(res => res.json())
                .then(forecast => updateForecast(forecast))

        })
        .catch(() => {
            alert("Fetch error")
            resetButton()
        })
}

// ================= FORECAST (FIXED VERSION) =================

function updateForecast(forecast) {

    const dailyMap = {}

    forecast.list.forEach(item => {
        const date = item.dt_txt.split(" ")[0]
        if (!dailyMap[date]) dailyMap[date] = []
        dailyMap[date].push(item)
    })

    const today = new Date().toISOString().split("T")[0]

    if (!dailyMap[today]) {
        dailyMap[today] = [forecast.list[0]]
    }

    const dailyData = Object.keys(dailyMap)
        .sort()
        .slice(0, 7)
        .map(date => dailyMap[date])

    dailyData.forEach((dayItems, index) => {

        const forecastDay = forecastDays[index]
        if (!forecastDay) return

        const temps = dayItems.map(i => i.main.temp)

        const maxTemp = Math.max(...temps)
        const minTemp = Math.min(...temps)

        const date = new Date(dayItems[0].dt * 1000)

        const dayEl = document.getElementById(forecastDay.date)
        const tempToEl = document.getElementById(forecastDay.to)
        const tempFromEl = document.getElementById(forecastDay.from)

        if (!dayEl || !tempToEl || !tempFromEl) return

        dayEl.textContent =
            date.toLocaleDateString("en-US", {
                day: "numeric",
                month: "short"
            })

        tempToEl.textContent = `${Math.round(maxTemp)}°`
        tempFromEl.textContent = `${Math.round(minTemp)}°`
    })
}


// ================= ICON SYSTEM =================

function updateWeatherIcon(iconCode, iconElement) {

    const iconMap = {
        "01d": "sun", "01n": "moon",
        "02d": "cloud-sun", "02n": "cloud-moon",
        "03d": "cloud", "03n": "cloud",
        "04d": "cloud", "04n": "cloud",
        "09d": "cloud-rain", "09n": "cloud-rain",
        "10d": "cloud-rain", "10n": "cloud-rain",
        "11d": "cloud-lightning", "11n": "cloud-lightning",
        "13d": "snow", "13n": "snow",
        "50d": "mist", "50n": "mist"
    }

    const iconClass = iconMap[iconCode] || "cloud"

    iconElement.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg"
            width="24" height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round">
            ${getIconPath(iconClass)}
        </svg>
    `
}

function getIconPath(type) {

    const icons = {
        sun: `<circle cx="12" cy="12" r="4"/>
              <path d="M12 2v2M12 20v2M2 12h2M20 12h2"/>`,

        moon: `<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>`,

        cloud: `<path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/>`,

        "cloud-rain": `<path d="M4 14.9A7 7 0 1 1 15.7 8h1.8a4.5 4.5 0 0 1 2.5 8.2"/>
                       <path d="M12 16v6"/>`,

        "cloud-lightning": `<path d="M6 16A7 7 0 1 1 15.7 8h1.8a4.5 4.5 0 0 1 .5 9"/>
                            <path d="m13 12-3 5h4l-3 5"/>`,

        snow: `<path d="M4 14.9A7 7 0 1 1 15.7 8h1.8a4.5 4.5 0 0 1 2.5 8.2"/>`,

        mist: `<path d="M4 12h16"/>`
    }

    return icons[type] || icons.cloud
}
