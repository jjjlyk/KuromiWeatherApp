const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('node:path');
const axios = require('axios');

let mainWindow;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 512,
    height: 512,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration:true,
      contextIsolation: false,
    },
  });


  mainWindow.loadFile(path.join(__dirname, 'index.html'));
  mainWindow.webContents.openDevTools();

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
};

  ipcMain.handle('fetch-weather', async (event, { latitude, longitude }) => {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;

    try {
      const response = await axios.get(url);
      const temperature = response.data.current_weather.temperature; // Current temperature
      const weatherCode = response.data.current_weather.weathercode; // Weather condition code
      const isDay = response.data.current_weather.is_day; // Day or night indicator
      return { temperature, weatherCode, isDay }; // Return both temperature and weather code
    } catch (error) {
      console.error('Error fetching weather data:', error);
      throw error;
    }
  });

app.whenReady().then(() => {
  createWindow();


  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
