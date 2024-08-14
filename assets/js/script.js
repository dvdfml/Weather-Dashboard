const formEl = document.getElementById('search-form');
const inputEl = document.getElementById('search-input');
const cityCardEl = document.getElementById('city-card');
const apiKey = '30cd920476e578641380e3efd7353e7c';

async function getGeocodingApi(city) {
    const url = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: { accept: 'application/json' },
        });
        if (!response.ok) {
            console.log(`Response status: ${response.status}`);
            throw new Error(`Response status: ${response.status}`);
        }
        return response.json();
    } catch (error) {
        console.error(error.message);
    }
}

async function getWeatherApi(lat, lon) {

    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: { accept: 'application/json' },
        });
        if (!response.ok) {
            console.log(`Response status: ${response.status}`);
            throw new Error(`Response status: ${response.status}`);
        }
        return response.json();

    } catch (error) {
        console.error(error.message);
        return error;
    }
}

async function getForecastApi(lat, lon) {

    const url = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: { accept: 'application/json' },
        });
        if (!response.ok) {
            console.log(`Response status: ${response.status}`);
            throw new Error(`Response status: ${response.status}`);
        }
        return response.json();

    } catch (error) {
        console.error(error.message);
        return error;
    }
}

async function searchHandler(event) {

    event.preventDefault();
    const city = inputEl.value;
    console.log(city);
    const cityResponse = await getGeocodingApi(city);
    if (cityResponse) {
        const { lat, lon } = cityResponse[0];
        const currentWeather = await getWeatherApi(lat, lon);
        const forecast = await getForecastApi(lat, lon);
        if (currentWeather) {
            renderWeather(currentWeather);
            console.log(currentWeather);
        }
        if (forecast) {
            renderForecast(forecast);
            console.log(forecast);
        }
    }
}

function renderWeather(currentWeather) {
    const date = new Date();
    cityCardEl.innerHTML = `
                <h2 id="card-heading">${currentWeather.name} (${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()})</h2>
                <img src="https://openweathermap.org/img/wn/${currentWeather.weather[0].icon}@2x.png">
                <ul>
                    <li>Temp: ${currentWeather.main.temp} F</li>
                    <li>Wind: ${currentWeather.wind.speed} MPH</li>
                    <li>Humidity: ${currentWeather.main.humidity}%</li>
                </ul>
    `
    // sectionEl.appendChild(cityCard);
}

function renderForecast(forecast) {
    let listIndex = 3;
    for (let i = 1; i <= 5; i++) {
        const forecastCardEl = document.getElementById(`forecast-card-${i}`);
        forecastCardEl.innerHTML = `
                    <h4>9/14/2022</h4>
                    <img src="https://openweathermap.org/img/wn/${forecast.list[listIndex].weather[0].icon}@2x.png">
                    <ul>
                        <li>Temp: ${forecast.list[listIndex].main.temp} F</li>
                        <li>Wind: ${forecast.list[listIndex].wind.speed} MPH</li>
                        <li>Humidity: ${forecast.list[listIndex].main.humidity}%</li>
                    </ul>
        `
        listIndex += 8
    }
}

formEl.addEventListener('submit', searchHandler);