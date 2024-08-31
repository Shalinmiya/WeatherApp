const apiKey = "b5f558462160da78810acd0bb997a9fd";
const button = document.getElementById('getWeatherBtn');
const unitToggleBtn = document.getElementById('unitToggleBtn');
const cityInput = document.getElementById('cityInput');
const currentWeatherDiv = document.getElementById('currentWeather');
const highlightsDiv = document.getElementById('highlights');
const forecastList = document.getElementById('forecastList');
let unit = 'metric'; // Default to Celsius

button.addEventListener('click', getWeather);
unitToggleBtn.addEventListener('click', toggleUnit);

function toggleUnit() {
    unit = unit === 'metric' ? 'imperial' : 'metric';
    unitToggleBtn.textContent = unit === 'metric' ? '°C' : '°F';
    getWeather(); // Refetch weather data with new unit
     }


function getWeather() {
    const city = cityInput.value || 'Delhi';
const currentWeatherUrl =
`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}
&units=${unit}`;
const forecastUrl =
`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey
}&units=${unit}`;

Promise.all([fetch(currentWeatherUrl), fetch(forecastUrl)])
.then(responses => {
    if (!responses[0].ok || !responses[1].ok) {
        throw new Error('City not found or API error');
    }
    return Promise.all(responses.map(response => response.json()));
})
.then(data => {
    displayCurrentWeather(data[0]);
    displayHighlights(data[0]);
    displayForecast(data[1]);
})
.catch(error => {
    currentWeatherDiv.textContent = error.message;
    highlightsDiv.innerHTML = '';
    forecastList.innerHTML = '';
});
}
function displayCurrentWeather(data) {
    const { main, weather, wind, name } = data;

currentWeatherDiv.innerHTML = `
<h2>${name}</h2>
<p>${weather[0].description}</p>
<h1>${main.temp} °${unit === 'metric' ? 'C' : 'F'}</h1>
`;
}


function displayHighlights(data) {
    const { main, wind } = data;

highlightsDiv.innerHTML = `
<div class="highlight-item">
<h3>Humidity</h3>
    <p>${main.humidity} %</p>
</div>
<div class="highlight-item">
<h3>Wind Speed</h3>
<p>${wind.speed} ${unit === 'metric' ? 'm/s' : 'mph'}</p>
</div>
<div class="highlight-item">
<h3>Pressure</h3>
<p>${main.pressure} hPa</p>
</div>
<div class="highlight-item">
<h3>Cloudiness</h3>
<p>${data.clouds.all} %</p>
</div>
`;
}
function displayForecast(data) {
forecastList.innerHTML = `
<div id="forecastList" class="forecast-grid"></div>
<h2>This week</h2><br><br><br>
`;

const forecastData = {};

data.list.forEach(entry => {
const date = new Date(entry.dt * 1000).toLocaleDateString();
if (!forecastData[date]) {
forecastData[date] = {
temp: entry.main.temp,
weather: entry.weather[0].description,
};
}
});
for (const [date, values] of Object.entries(forecastData)) {
const forecastItem = document.createElement('div');
forecastItem.classList.add('forecast-item');
forecastItem.innerHTML = `
<h3>${date}</h3>
<p>${values.weather}</p>
<p>${values.temp} °${unit === 'metric' ? 'C' : 'F'}</p>
`;
forecastList.appendChild(forecastItem);
}
}