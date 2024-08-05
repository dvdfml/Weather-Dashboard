const formEl = document.getElementById('search-form');
const inputEl = document.getElementById('search-input');
const apiKey = '30cd920476e578641380e3efd7353e7c';

async function searchHandler(event) {

    event.preventDefault();
    const city = inputEl.value;
    const url = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`
    console.log(url);

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: { accept: 'application/json' },
        });
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const json = response.json();
        console.log(json);

    } catch (error) {
        console.error(error.message);
    }


}

console.log(formEl);
console.log(inputEl);
formEl.addEventListener('submit', searchHandler);