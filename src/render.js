const { ipcRenderer } = require('electron');

const weatherMessages = {
  0: 'the sky is clear',
  1: 'the sky is clear',
  2: 'it is cloudy',
  3: 'it is cloudy',
  45: 'it is foggy',
  48: 'it is foggy',
  51: 'it is raining lightly',
  53: 'it is raining moderately',
  55: 'it is raining',
  61: 'it is raining',
  63: 'it is raining',
  65: 'it is raining heavily',
  71: 'it is snowing',
  73: 'it is snowing',
  75: 'it is snowing heavily',
  80: 'it is raining',
  81: 'it is raining',
  82: 'it is raining heavily',
  95: 'there is a thunderstom, be careful!',
  96: 'there is a thunderstom with hail, be careful!',
  99: 'there is a thunderstom with heavy hail, be careful!',
};

let currentTemperatureCelsius = null;
let isCelsius = true; 

async function fetchAndDisplayWeather() {
  const latitude = 14.6042; 
  const longitude = 120.9822; 

  try {
    const weatherData = await ipcRenderer.invoke('fetch-weather', { latitude, longitude });

    console.log(weatherData);

    // update the temperature display with the fetched data
    currentTemperatureCelsius = weatherData.temperature; 
    updateTemperatureDisplay();

    const weatherMessageDisplay = document.getElementById('weather-message-display');
    
    console.log('Weather Data:', weatherData);
    
    const weatherMessage = weatherMessages[weatherData.weatherCode];
    weatherMessageDisplay.textContent = weatherMessage || 'Weather information not available';
  
    const weatherBGDisplay = document.querySelector('.weather-card');
    const kuromiImage = document.querySelector('weather-app-kuromi');

    if (weatherData.isDay === 1){
      //this is for day time
      weatherBGDisplay.style.backgroundImage = "url('./assets/images/background_weather_day.jpg')";
      document.querySelector('.day-image').style.display = 'block';
      document.querySelector('.night-image').style.display = 'none';
    } else {
      // this is for night time
      weatherBGDisplay.style.backgroundImage = "url('./assets/images/background_weather_night.jpg')";
      document.querySelector('.day-image').style.display = 'none';
      document.querySelector('.night-image').style.display = 'block';
    }

  } catch (error) {
    console.error('Error fetching weather data:', error);
  }
}

function updateTemperatureDisplay() {
  const tempDisplay = document.getElementById('temp-display');
  if (isCelsius) {
    tempDisplay.textContent = `${currentTemperatureCelsius}`;
    tempDisplay.style.fontSize = '27px';
    tempDisplay.style.left =  '80px';
    tempDisplay.style.top = '105px';
  } else {
    // this is for fahrenheit
    const tempFahrenheit = (currentTemperatureCelsius * 9/5) + 32;
    tempDisplay.textContent = `${tempFahrenheit.toFixed(2)}`;
    tempDisplay.style.fontSize = '27px';
    tempDisplay.style.left =  '73px';
    tempDisplay.style.top = '105px';
  }
}

document.getElementById('celsius-btn').addEventListener('click', () => {
  isCelsius = true;
  updateTemperatureDisplay();
});

document.getElementById('fahrenheit-btn').addEventListener('click', () => {
  isCelsius = false;
  updateTemperatureDisplay();
});

document.addEventListener('DOMContentLoaded', fetchAndDisplayWeather);
