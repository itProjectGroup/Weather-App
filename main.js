const apiKey = 'YOUR_API_KEY';
const apiUrl = 'https://api.open-meteo.com/v1/forecast';

const srchButton = document.getElementById('searchButton');
const locElement = document.getElementById('location');
const tempElement = document.getElementById('temperature');
const descElement = document.getElementById('description');
const resultElement = document.getElementById('result');
const tempLogoElement = document.getElementById('temp_logo');

function getUserInput() {
    return {
        "latitude": document.getElementById('location_Lat').value,
        "longitude": document.getElementById('location_Log').value,
        "forecast_days": 1
    };
}

function buildEndpointUrl() {
    var data = getUserInput();
    if (data.latitude && data.longitude) {
        return `${apiUrl}?latitude=${data.latitude}&longitude=${data.longitude}&current=apparent_temperature,is_day,rain,cloud_cover,wind_speed_10m,relative_humidity_2m,precipitation&forecast_days=${data.forecast_days}`;
    }
    else {
        console.log("Error: input values are null.")
        return null;
    }
}

srchButton.addEventListener('click', () => {
    fetchWeather();
});

function fetchWeather() {
    const url = buildEndpointUrl();
    if (url != null) {
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                resultElement.setAttribute('class', 'output-container');
                tempElement.textContent = `${Math.round(data.current.apparent_temperature)}°C`;
                setWeatherInfoElement(data);
                setAdditionalWeatherElement(data);
            })
            .catch(error => {
                console.error('Error fetching weather data:', error);
            });
    }
}

function getWeatherDataInfo(data) {
    if (data.current.is_day === 0) {
        return { path: 'Assets\\moon-regular.svg', text: 'Beautiful Night Sky' };
    } else if (data.current.rain > 0) {
        return { path: 'Assets\\cloud-rain-solid.svg', text: 'Lovely Rainy Day.' };
    } else if (data.current.cloud_cover > 50) {
        return { path: 'Assets\\cloud-solid.svg', text: 'Its A Cloudy Day' };
    } else if (data.current.wind_speed_10m > 5) {
        return { path: 'Assets\\wind-solid.svg', text: 'The Wind Blew Me Off' };
    } else {
        return { path: 'Assets\\sun-regular.svg', text: 'Bright Sunny Day' };
    }
}

function setWeatherInfoElement(data) {
    var img = document.createElement('img');
    img.src = getWeatherDataInfo(data).path;
    descElement.textContent = getWeatherDataInfo(data).text;
    tempLogoElement.appendChild(img);
}

function setAdditionalWeatherElement(data) {
    var precipitationElement = document.getElementById('precipitation');
    var precipitation_img = document.getElementById('precipitation_img');
    precipitation_img.style.display = 'block';
    precipitationElement.textContent = `${Math.round(data.current.precipitation)}%`;
    precipitation_img.src = 'public\\Assets\\precipitation-solid.svg'

    var humidityElement = document.getElementById('humidity');
    var humidity_img = document.getElementById('humidity_img');
    humidity_img.style.display = 'block';
    humidityElement.textContent = `${Math.round(data.current.relative_humidity_2m)}%`;
    humidity_img.src = 'public\\Assets\\humidity-high-solid.svg'
}

