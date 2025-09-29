// UI Helper Functions
class UIManager {
    constructor() {
        this.elements = {
            loadingState: document.getElementById('loadingState'),
            errorState: document.getElementById('errorState'),
            weatherContent: document.getElementById('weatherContent'),
            currentLocation: document.getElementById('currentLocation'),
            currentDate: document.getElementById('currentDate'),
            currentTemp: document.getElementById('currentTemp'),
            weatherIcon: document.getElementById('weatherIcon'),
            weatherDescription: document.getElementById('weatherDescription'),
            feelsLike: document.getElementById('feelsLike'),
            humidity: document.getElementById('humidity'),
            windSpeed: document.getElementById('windSpeed'),
            visibility: document.getElementById('visibility'),
            pressure: document.getElementById('pressure'),
            forecastCards: document.getElementById('forecastCards'),
            cityInput: document.getElementById('cityInput'),
            errorMessage: document.querySelector('.error-message')
        };
    }

    // Show loading state
    showLoading() {
        this.elements.loadingState.classList.remove('hidden');
        this.elements.errorState.classList.add('hidden');
        this.elements.weatherContent.classList.add('hidden');
    }

    // Show error state
    showError(message = 'Unable to fetch weather data') {
        this.elements.loadingState.classList.add('hidden');
        this.elements.errorState.classList.remove('hidden');
        this.elements.weatherContent.classList.add('hidden');
        this.elements.errorMessage.textContent = message;
    }

    // Show weather content
    showWeatherContent() {
        this.elements.loadingState.classList.add('hidden');
        this.elements.errorState.classList.add('hidden');
        this.elements.weatherContent.classList.remove('hidden');
        this.elements.weatherContent.classList.add('fade-in');
    }

    // Update current weather display
    updateCurrentWeather(data) {
        // Location and date
        this.elements.currentLocation.textContent = `${data.name}, ${data.sys.country}`;
        this.elements.currentDate.textContent = new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        // Temperature
        this.elements.currentTemp.textContent = `${Math.round(data.main.temp)}°`;
        this.elements.feelsLike.textContent = `Feels like ${Math.round(data.main.feels_like)}°`;

        // Weather condition
        this.elements.weatherDescription.textContent = data.weather[0].description;
        this.elements.weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
        this.elements.weatherIcon.alt = data.weather[0].description;

        // Weather details
        this.elements.humidity.textContent = `${data.main.humidity}%`;
        this.elements.windSpeed.textContent = `${Math.round(data.wind.speed * 3.6)} km/h`;
        this.elements.visibility.textContent = `${(data.visibility / 1000).toFixed(1)} km`;
        this.elements.pressure.textContent = `${data.main.pressure} hPa`;
    }

    // Update forecast display
    updateForecast(forecastData) {
        this.elements.forecastCards.innerHTML = '';
        
        forecastData.forEach(day => {
            const forecastCard = document.createElement('div');
            forecastCard.className = 'forecast-card';
            
            forecastCard.innerHTML = `
                <div class="forecast-day">${day.day}</div>
                <div class="forecast-weather">
                    <img src="https://openweathermap.org/img/wn/${day.icon}@2x.png" 
                         alt="${day.description}" class="forecast-icon">
                    <div class="forecast-desc">${day.description}</div>
                </div>
                <div class="forecast-temps">
                    <span class="temp-high">${day.temp.max}°</span>
                    <span class="temp-low">${day.temp.min}°</span>
                </div>
            `;
            
            this.elements.forecastCards.appendChild(forecastCard);
        });
    }

    // Clear input field
    clearInput() {
        this.elements.cityInput.value = '';
    }

    // Get input value
    getInputValue() {
        return this.elements.cityInput.value.trim();
    }

    // Add loading animation to button
    addButtonLoading(button) {
        const originalText = button.innerHTML;
        button.innerHTML = `
            <div class="loading-spinner" style="width: 20px; height: 20px; margin: 0 auto;"></div>
        `;
        button.disabled = true;
        
        return () => {
            button.innerHTML = originalText;
            button.disabled = false;
        };
    }

    // Show toast notification (for future enhancements)
    showToast(message, type = 'info') {
        // This can be implemented for user feedback
        console.log(`${type.toUpperCase()}: ${message}`);
    }

    // Add smooth transition animations
    addTransitionEffect(element) {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            element.style.transition = 'all 0.5s ease';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, 50);
    }

    // Update background based on weather condition
    updateBackgroundTheme(weatherMain) {
        const body = document.body;
        const gradient = document.querySelector('.background-gradient');
        
        // Remove existing theme classes
        body.className = body.className.replace(/weather-theme-\w+/g, '');
        
        let themeClass;
        switch (weatherMain.toLowerCase()) {
            case 'clear':
                themeClass = 'weather-theme-clear';
                break;
            case 'clouds':
                themeClass = 'weather-theme-cloudy';
                break;
            case 'rain':
            case 'drizzle':
                themeClass = 'weather-theme-rainy';
                break;
            case 'snow':
                themeClass = 'weather-theme-snowy';
                break;
            case 'thunderstorm':
                themeClass = 'weather-theme-stormy';
                break;
            default:
                themeClass = 'weather-theme-default';
        }
        
        body.classList.add(themeClass);
        
        // Update gradient overlay for different weather conditions
        const themes = {
            'weather-theme-clear': 'linear-gradient(135deg, rgba(255, 193, 7, 0.8) 0%, rgba(255, 87, 34, 0.8) 100%)',
            'weather-theme-cloudy': 'linear-gradient(135deg, rgba(96, 125, 139, 0.8) 0%, rgba(84, 110, 122, 0.8) 100%)',
            'weather-theme-rainy': 'linear-gradient(135deg, rgba(63, 81, 181, 0.8) 0%, rgba(33, 150, 243, 0.8) 100%)',
            'weather-theme-snowy': 'linear-gradient(135deg, rgba(207, 216, 220, 0.9) 0%, rgba(159, 168, 218, 0.9) 100%)',
            'weather-theme-stormy': 'linear-gradient(135deg, rgba(55, 71, 79, 0.9) 0%, rgba(38, 50, 56, 0.9) 100%)',
            'weather-theme-default': 'linear-gradient(135deg, rgba(102, 126, 234, 0.8) 0%, rgba(118, 75, 162, 0.8) 100%)'
        };
        
        if (gradient && themes[themeClass]) {
            gradient.style.background = themes[themeClass];
        }
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UIManager;
}