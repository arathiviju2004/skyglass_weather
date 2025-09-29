// Main Application Logic
class SkyGlassWeatherApp {
    constructor() {
        this.weatherAPI = new WeatherAPI();
        this.ui = new UIManager();
        this.init();
    }

    // Initialize the application
    init() {
        this.bindEvents();
        this.loadWeatherByLocation();
        this.showAPIKeyInfo();
    }

    // Bind event listeners
    bindEvents() {
        // Search functionality
        const searchBtn = document.getElementById('searchBtn');
        const cityInput = document.getElementById('cityInput');
        const retryBtn = document.getElementById('retryBtn');
        const locationBtn = document.getElementById('locationBtn');

        searchBtn.addEventListener('click', () => this.handleSearch());
        cityInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleSearch();
            }
        });
        
        retryBtn.addEventListener('click', () => this.loadWeatherByLocation());
        locationBtn.addEventListener('click', () => this.loadWeatherByLocation());

        // Add input focus effects
        cityInput.addEventListener('focus', () => {
            cityInput.parentElement.style.transform = 'scale(1.02)';
        });
        
        cityInput.addEventListener('blur', () => {
            cityInput.parentElement.style.transform = 'scale(1)';
        });
    }

    // Show API key setup information
    showAPIKeyInfo() {
        if (this.weatherAPI.apiKey === 'YOUR_OPENWEATHERMAP_API_KEY_HERE') {
            console.warn(`
🌤️ SkyGlass Weather Setup Required:

To use this app, you need an OpenWeatherMap API key:

1. Visit: https://openweathermap.org/api
2. Sign up for a free account
3. Get your API key from the dashboard
4. Replace 'YOUR_OPENWEATHERMAP_API_KEY_HERE' in weather-api.js with your actual API key

The app will show demo data until you add your API key.
            `);
            
            // Show demo data for now
            this.showDemoData();
        }
    }

    // Handle search functionality
    async handleSearch() {
        const city = this.ui.getInputValue();
        
        if (!city) {
            this.ui.showToast('Please enter a city name', 'warning');
            return;
        }

        if (this.weatherAPI.apiKey === 'YOUR_OPENWEATHERMAP_API_KEY_HERE') {
            this.ui.showToast('API key required for search functionality', 'warning');
            return;
        }

        try {
            this.ui.showLoading();
            await this.loadWeatherByCity(city);
            this.ui.clearInput();
        } catch (error) {
            console.error('Search error:', error);
            this.ui.showError(`Unable to find weather data for "${city}"`);
        }
    }

    // Load weather data by user's location
    async loadWeatherByLocation() {
        if (this.weatherAPI.apiKey === 'YOUR_OPENWEATHERMAP_API_KEY_HERE') {
            this.showDemoData();
            return;
        }

        try {
            this.ui.showLoading();
            
            // Get user's coordinates
            const coords = await LocationService.getCurrentPosition();
            
            // Fetch weather data
            const [currentWeather, forecast] = await Promise.all([
                this.weatherAPI.getCurrentWeatherByCoords(coords.lat, coords.lon),
                this.weatherAPI.getForecastByCoords(coords.lat, coords.lon)
            ]);

            this.displayWeatherData(currentWeather, forecast);
            
        } catch (error) {
            console.error('Location weather error:', error);
            let errorMessage = 'Unable to fetch weather data';
            
            if (error.message.includes('denied')) {
                errorMessage = 'Location access denied. Please enable location services or search for a city.';
            } else if (error.message.includes('unavailable')) {
                errorMessage = 'Location unavailable. Please search for a city manually.';
            }
            
            this.ui.showError(errorMessage);
        }
    }

    // Load weather data by city name
    async loadWeatherByCity(city) {
        try {
            const [currentWeather, forecast] = await Promise.all([
                this.weatherAPI.getCurrentWeatherByCity(city),
                this.weatherAPI.getForecastByCity(city)
            ]);

            this.displayWeatherData(currentWeather, forecast);
            
        } catch (error) {
            console.error('City weather error:', error);
            throw error;
        }
    }

    // Display weather data
    displayWeatherData(currentWeather, forecastData) {
        try {
            // Update current weather
            this.ui.updateCurrentWeather(currentWeather);
            
            // Process and update forecast
            const processedForecast = this.weatherAPI.processForecastData(forecastData);
            this.ui.updateForecast(processedForecast);
            
            // Update background theme
            this.ui.updateBackgroundTheme(currentWeather.weather[0].main);
            
            // Show weather content
            this.ui.showWeatherContent();
            
        } catch (error) {
            console.error('Display error:', error);
            this.ui.showError('Error displaying weather data');
        }
    }

    // Show demo data when API key is not configured
    showDemoData() {
        const demoCurrentWeather = {
            name: 'San Francisco',
            sys: { country: 'US' },
            main: {
                temp: 22,
                feels_like: 24,
                humidity: 68,
                pressure: 1013
            },
            weather: [{
                main: 'Clear',
                description: 'clear sky',
                icon: '01d'
            }],
            wind: { speed: 3.5 },
            visibility: 10000
        };

        const demoForecast = [
            { day: 'Mon', temp: { min: 18, max: 25 }, description: 'sunny', icon: '01d' },
            { day: 'Tue', temp: { min: 16, max: 23 }, description: 'partly cloudy', icon: '02d' },
            { day: 'Wed', temp: { min: 19, max: 26 }, description: 'clear sky', icon: '01d' },
            { day: 'Thu', temp: { min: 17, max: 22 }, description: 'light rain', icon: '10d' },
            { day: 'Fri', temp: { min: 20, max: 27 }, description: 'sunny', icon: '01d' }
        ];

        setTimeout(() => {
            this.ui.updateCurrentWeather(demoCurrentWeather);
            this.ui.updateForecast(demoForecast);
            this.ui.updateBackgroundTheme(demoCurrentWeather.weather[0].main);
            this.ui.showWeatherContent();
        }, 1500);
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new SkyGlassWeatherApp();
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
        // Refresh data when user returns to the tab (optional)
        console.log('Page is visible again');
    }
});

// Handle online/offline status
window.addEventListener('online', () => {
    console.log('Connection restored');
});

window.addEventListener('offline', () => {
    console.log('Connection lost');
});