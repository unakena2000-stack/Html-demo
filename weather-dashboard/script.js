// Weather Dashboard Application

class WeatherDashboard {
    constructor() {
        // Using Open-Meteo API (free, no API key required)
        this.geoCodeUrl = 'https://geocoding-api.open-meteo.com/v1/search';
        this.weatherUrl = 'https://api.open-meteo.com/v1/forecast';
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadDefaultCity();
        console.log('Weather Dashboard initialized');
    }

    setupEventListeners() {
        document.getElementById('searchBtn').addEventListener('click', () => this.handleSearch());
        document.getElementById('searchInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleSearch();
        });
        document.getElementById('currentLocationBtn').addEventListener('click', () => this.getCurrentLocation());
    }

    // Handle search
    async handleSearch() {
        const searchInput = document.getElementById('searchInput');
        const city = searchInput.value.trim();

        if (!city) {
            this.showError('Please enter a city name');
            return;
        }

        await this.fetchWeatherByCity(city);
        searchInput.value = '';
    }

    // Get current location
    getCurrentLocation() {
        if (!navigator.geolocation) {
            this.showError('Geolocation is not supported by your browser');
            return;
        }

        this.showLoading();
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                this.fetchWeatherByCoordinates(latitude, longitude);
            },
            (error) => {
                this.showError('Unable to retrieve your location. Please try searching for a city.');
                console.error('Geolocation error:', error);
            }
        );
    }

    // Fetch weather by city name
    async fetchWeatherByCity(city) {
        this.showLoading();

        try {
            // First, get coordinates from city name
            const geoResponse = await fetch(
                `${this.geoCodeUrl}?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
            );

            if (!geoResponse.ok) throw new Error('City not found');

            const geoData = await geoResponse.json();

            if (!geoData.results || geoData.results.length === 0) {
                this.showError('City not found. Please try another search.');
                return;
            }

            const location = geoData.results[0];
            await this.fetchWeatherByCoordinates(location.latitude, location.longitude, location);
        } catch (error) {
            this.showError('Error fetching weather data. Please try again.');
            console.error('Error:', error);
        }
    }

    // Fetch weather by coordinates
    async fetchWeatherByCoordinates(latitude, longitude, locationData = null) {
        try {
            const response = await fetch(
                `${this.weatherUrl}?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,pressure_msl,visibility&daily=weather_code,temperature_2m_max,temperature_2m_min&temperature_unit=celsius&wind_speed_unit=kmh&timezone=auto`
            );

            if (!response.ok) throw new Error('Weather data not available');

            const data = await response.json();
            this.displayWeather(data, locationData);
            this.hideLoading();
        } catch (error) {
            this.showError('Error fetching weather data. Please try again.');
            console.error('Error:', error);
            this.hideLoading();
        }
    }

    // Display weather data
    displayWeather(data, locationData) {
        const current = data.current;
        const daily = data.daily;
        const timezone = data.timezone;

        // Get location name
        let locationName = 'Unknown Location';
        if (locationData) {
            locationName = `${locationData.name}${locationData.admin1 ? ', ' + locationData.admin1 : ''}${locationData.country ? ', ' + locationData.country : ''}`;
        } else {
            locationName = timezone || 'Your Location';
        }

        // Update current weather
        document.getElementById('cityName').textContent = locationName;
        document.getElementById('dateTime').textContent = this.formatDate(new Date());
        document.getElementById('temperature').textContent = Math.round(current.temperature_2m);
        document.getElementById('weatherDescription').textContent = this.getWeatherDescription(current.weather_code);
        document.getElementById('feelsLike').textContent = `Feels like ${Math.round(current.temperature_2m - 1)}°C`;
        document.getElementById('humidity').textContent = `${current.relative_humidity_2m}%`;
        document.getElementById('windSpeed').textContent = `${Math.round(current.wind_speed_10m)} km/h`;
        document.getElementById('pressure').textContent = `${Math.round(current.pressure_msl)} mb`;
        document.getElementById('visibility').textContent = `${(current.visibility / 1000).toFixed(1)} km`;
        document.getElementById('uvIndex').textContent = 'N/A';
        document.getElementById('tempRange').textContent = `${Math.round(daily.temperature_2m_max[0])}° / ${Math.round(daily.temperature_2m_min[0])}°`;

        // Set weather icon
        const iconUrl = this.getWeatherIcon(current.weather_code);
        document.getElementById('weatherIcon').src = iconUrl;

        // Show weather section
        document.getElementById('currentWeatherSection').classList.remove('hidden');

        // Display forecast
        this.displayForecast(daily);
        document.getElementById('forecastSection').classList.remove('hidden');
    }

    // Display forecast
    displayForecast(daily) {
        const forecastContainer = document.getElementById('forecastContainer');
        forecastContainer.innerHTML = '';

        // Get next 5 days (skip today)
        for (let i = 1; i <= 5 && i < daily.time.length; i++) {
            const date = new Date(daily.time[i]);
            const maxTemp = Math.round(daily.temperature_2m_max[i]);
            const minTemp = Math.round(daily.temperature_2m_min[i]);
            const weatherCode = daily.weather_code[i];

            const card = document.createElement('div');
            card.className = 'forecast-card';
            card.innerHTML = `
                <div class="forecast-date">${this.formatDateShort(date)}</div>
                <div class="forecast-icon">
                    <img src="${this.getWeatherIcon(weatherCode)}" alt="Weather">
                </div>
                <div class="forecast-desc">${this.getWeatherDescription(weatherCode)}</div>
                <div class="forecast-temps">
                    <span class="forecast-temp-high">${maxTemp}°</span>
                    <span class="forecast-temp-low">${minTemp}°</span>
                </div>
            `;
            forecastContainer.appendChild(card);
        }
    }

    // Get weather description from WMO code
    getWeatherDescription(code) {
        const descriptions = {
            0: 'Clear sky',
            1: 'Mainly clear',
            2: 'Partly cloudy',
            3: 'Overcast',
            45: 'Foggy',
            48: 'Depositing rime fog',
            51: 'Light drizzle',
            53: 'Moderate drizzle',
            55: 'Dense drizzle',
            61: 'Slight rain',
            63: 'Moderate rain',
            65: 'Heavy rain',
            71: 'Slight snow',
            73: 'Moderate snow',
            75: 'Heavy snow',
            77: 'Snow grains',
            80: 'Slight rain showers',
            81: 'Moderate rain showers',
            82: 'Violent rain showers',
            85: 'Slight snow showers',
            86: 'Heavy snow showers',
            95: 'Thunderstorm',
            96: 'Thunderstorm with hail',
            99: 'Thunderstorm with hail'
        };
        return descriptions[code] || 'Unknown';
    }

    // Get weather icon URL
    getWeatherIcon(code) {
        const iconMap = {
            0: '☀️', // Clear sky
            1: '🌤️', // Mainly clear
            2: '⛅', // Partly cloudy
            3: '☁️', // Overcast
            45: '🌫️', // Foggy
            48: '🌫️', // Depositing rime fog
            51: '🌧️', // Light drizzle
            53: '🌧️', // Moderate drizzle
            55: '🌧️', // Dense drizzle
            61: '🌧️', // Slight rain
            63: '🌧️', // Moderate rain
            65: '⛈️', // Heavy rain
            71: '❄️', // Slight snow
            73: '❄️', // Moderate snow
            75: '❄️', // Heavy snow
            77: '❄️', // Snow grains
            80: '🌧️', // Slight rain showers
            81: '🌧️', // Moderate rain showers
            82: '⛈️', // Violent rain showers
            85: '🌨️', // Slight snow showers
            86: '🌨️', // Heavy snow showers
            95: '⛈️', // Thunderstorm
            96: '⛈️', // Thunderstorm with hail
            99: '⛈️'  // Thunderstorm with hail
        };

        const icon = iconMap[code] || '🌍';
        return `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">${icon}</text></svg>`;
    }

    // Load default city
    async loadDefaultCity() {
        await this.fetchWeatherByCity('London');
    }

    // Format date
    formatDate(date) {
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return date.toLocaleDateString('en-US', options);
    }

    // Format date short
    formatDateShort(date) {
        const options = { 
            weekday: 'short', 
            month: 'short', 
            day: 'numeric'
        };
        return date.toLocaleDateString('en-US', options);
    }

    // Show error
    showError(message) {
        const errorEl = document.getElementById('errorMessage');
        errorEl.textContent = message;
        errorEl.classList.remove('hidden');
        document.getElementById('currentWeatherSection').classList.add('hidden');
        document.getElementById('forecastSection').classList.add('hidden');

        setTimeout(() => {
            errorEl.classList.add('hidden');
        }, 5000);
    }

    // Show loading
    showLoading() {
        document.getElementById('loadingSpinner').classList.remove('hidden');
        document.getElementById('currentWeatherSection').classList.add('hidden');
        document.getElementById('forecastSection').classList.add('hidden');
        document.getElementById('errorMessage').classList.add('hidden');
    }

    // Hide loading
    hideLoading() {
        document.getElementById('loadingSpinner').classList.add('hidden');
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.weatherApp = new WeatherDashboard();
});
