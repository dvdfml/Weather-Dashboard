const formEl = document.getElementById('search-form');
const inputEl = document.getElementById('search-input');
const cityCardEl = document.getElementById('city-card');
const searchHistoryEl = document.getElementById('search-history');
const apiKey = '30cd920476e578641380e3efd7353e7c';

async function getGeocodingApi(city) {
    const url = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`

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

    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`
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
    const cityResponse = await getGeocodingApi(city);
    if (cityResponse) {
        const { lat, lon } = cityResponse[0];
        const currentWeather = await getWeatherApi(lat, lon);
        const forecast = await getForecastApi(lat, lon);
        if (currentWeather) {
            renderWeather(currentWeather);
        }
        if (forecast) {
            renderForecast(forecast);
        }
        setSearchHistory(city);
        renderSearchHistory();
    }
}

function setSearchHistory(city) {
    const storedCities = JSON.parse(localStorage.getItem('cities'));
    if (storedCities) {
        const cities = storedCities.filter(item => {
            return item != city
        })
        cities.push(city);
        localStorage.setItem('cities', JSON.stringify(cities));
    } else {
        localStorage.setItem('cities', JSON.stringify([city]));
    }
}

function renderSearchHistory() {
    searchHistoryEl.innerHTML = "";
    const cities = JSON.parse(localStorage.getItem('cities'));
    if (cities) {
        for (let i = cities.length - 1; i >= 0; i--) {
            const cityButton = document.createElement('button');
            cityButton.textContent = cities[i];
            searchHistoryEl.appendChild(cityButton);
            cityButton.addEventListener('click', searchButtonHandler)
        }
    }

}

async function searchButtonHandler(event) {
    const city = event.target.innerText;
    const cityResponse = await getGeocodingApi(city);
    if (cityResponse) {
        const { lat, lon } = cityResponse[0];
        const currentWeather = await getWeatherApi(lat, lon);
        const forecast = await getForecastApi(lat, lon);
        if (currentWeather) {
            renderWeather(currentWeather);
        }
        if (forecast) {
            renderForecast(forecast);
        }
    }
}

function renderWeather(currentWeather) {
    const date = new Date();
    cityCardEl.innerHTML = `
                <h2 id="card-heading">${currentWeather.name} (${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()})</h2>
                <img src="https://openweathermap.org/img/wn/${currentWeather.weather[0].icon}@2x.png">
                <ul>
                    <li>Temp: ${currentWeather.main.temp} F</li>
                    <li>Wind: ${currentWeather.wind.speed} MPH</li>
                    <li>Humidity: ${currentWeather.main.humidity}%</li>
                </ul>
    `
}

function renderForecast(forecast) {
    let listIndex = 3;
    for (let i = 1; i <= 5; i++) {
        const date = new Date(forecast.list[listIndex].dt * 1000)
        const forecastCardEl = document.getElementById(`forecast-card-${i}`);
        forecastCardEl.innerHTML = `
                    <h4>${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}</h4>
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

renderSearchHistory();
formEl.addEventListener('submit', searchHandler);