// Weather API Configuration
const API_KEY = '1534e73bb6443078a97d57f0fc017d66'; // Replace with your actual API key
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

class WeatherAPI {
    constructor() {
        this.apiKey = API_KEY;
    }

  
    // Get current weather by coordinates
    async getCurrentWeatherByCoords(lat, lon) {
        try {
            const response = await fetch(
                `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric`
            );
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error fetching current weather by coords:', error);
            throw error;
        }
    }

    // Get current weather by city name
    async getCurrentWeatherByCity(city) {
        try {
            const response = await fetch(
                `${BASE_URL}/weather?q=${encodeURIComponent(city)}&appid=${this.apiKey}&units=metric`
            );
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error fetching current weather by city:', error);
            throw error;
        }
    }

    // Get 5-day forecast by coordinates
    async getForecastByCoords(lat, lon) {
        try {
            const response = await fetch(
                `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric`
            );
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error fetching forecast by coords:', error);
            throw error;
        }
    }

    // Get 5-day forecast by city name
    async getForecastByCity(city) {
        try {
            const response = await fetch(
                `${BASE_URL}/forecast?q=${encodeURIComponent(city)}&appid=${this.apiKey}&units=metric`
            );
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error fetching forecast by city:', error);
            throw error;
        }
    }

    // Get weather icon URL
    getIconUrl(iconCode) {
        return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    }

    // Process forecast data to get daily forecasts
    processForecastData(forecastData) {
        const dailyForecasts = [];
        const processedDates = new Set();

        forecastData.list.forEach(item => {
            const date = new Date(item.dt * 1000);
            const dateString = date.toDateString();

            // Skip today and only process one forecast per day
            if (!processedDates.has(dateString) && dailyForecasts.length < 5) {
                processedDates.add(dateString);
                
                dailyForecasts.push({
                    date: date,
                    day: date.toLocaleDateString('en-US', { weekday: 'short' }),
                    temp: {
                        min: Math.round(item.main.temp_min),
                        max: Math.round(item.main.temp_max)
                    },
                    description: item.weather[0].description,
                    icon: item.weather[0].icon
                });
            }
        });

        return dailyForecasts;
    }
}

// Geolocation Helper
class LocationService {
    static async getCurrentPosition() {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error('Geolocation is not supported by this browser'));
                return;
            }

            const options = {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 300000 // 5 minutes
            };

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    resolve({
                        lat: position.coords.latitude,
                        lon: position.coords.longitude
                    });
                },
                (error) => {
                    let errorMessage;
                    switch (error.code) {
                        case error.PERMISSION_DENIED:
                            errorMessage = 'Location access denied by user';
                            break;
                        case error.POSITION_UNAVAILABLE:
                            errorMessage = 'Location information unavailable';
                            break;
                        case error.TIMEOUT:
                            errorMessage = 'Location request timed out';
                            break;
                        default:
                            errorMessage = 'An unknown error occurred';
                            break;
                    }
                    reject(new Error(errorMessage));
                },
                options
            );
        });
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { WeatherAPI, LocationService };
}