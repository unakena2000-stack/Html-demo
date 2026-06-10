# Weather Dashboard Application

A fully functional weather dashboard that fetches real-time weather data from the Open-Meteo API. No API key required! Display current weather conditions, detailed metrics, and a 5-day forecast for any location.

## 📋 Features

### Core Functionality
- 🌍 **Search by City** - Find weather for any city in the world
- 📍 **Current Location** - Get weather for your current location using geolocation
- 🌡️ **Current Weather** - Display temperature, conditions, and detailed metrics
- 📅 **5-Day Forecast** - See weather predictions for the next 5 days
- 📊 **Detailed Metrics** - Humidity, wind speed, pressure, visibility, and more

### User Experience
- 📱 **Responsive Design** - Works perfectly on mobile, tablet, and desktop
- ✨ **Smooth Animations** - Beautiful transitions and loading effects
- 🎨 **Modern UI** - Clean, intuitive interface with weather icons
- ⌨️ **Keyboard Support** - Press Enter to search
- 🛡️ **Error Handling** - Graceful error messages and validation

### Data & API
- 🔓 **No API Key Required** - Uses free Open-Meteo API
- 💾 **Real-time Data** - Current weather information
- 🌐 **Global Coverage** - Works for any city worldwide
- ⚡ **Fast Performance** - Optimized API calls

## 📁 File Structure

```
weather-dashboard/
├── index.html       # Main application page
├── styles.css       # Responsive styling
├── script.js        # Application logic with API integration
└── README.md        # This file
```

## 🚀 How to Use

1. **Open the Application** - Open `index.html` in your web browser
2. **Search for a City** - Type a city name and click "Search" or press Enter
3. **View Current Weather** - See temperature, conditions, and detailed metrics
4. **Check 5-Day Forecast** - Scroll down to see weather predictions
5. **Use Your Location** - Click "📍 Current Location" to get weather for your area

## 🌐 API Details

### Open-Meteo API
- **Endpoint**: `https://api.open-meteo.com/v1/forecast`
- **Geocoding**: `https://geocoding-api.open-meteo.com/v1/search`
- **Authentication**: None required (free tier, no API key)
- **Rate Limiting**: Generous limits for public use
- **Documentation**: https://open-meteo.com/

### Data Retrieved
- **Current Weather**:
  - Temperature
  - Weather condition
  - Humidity
  - Wind speed
  - Pressure
  - Visibility

- **Forecast** (5 days):
  - Maximum temperature
  - Minimum temperature
  - Weather condition

## 📊 Display Elements

### Current Weather Section
- Location name and current time
- Large temperature display with weather icon
- "Feels like" temperature
- Description of weather conditions

### Weather Details Cards
- 💧 **Humidity** - Percentage of moisture in air
- 💨 **Wind Speed** - Wind velocity in km/h
- 🔍 **Pressure** - Atmospheric pressure in mb
- 👁️ **Visibility** - How far you can see in km
- ☀️ **UV Index** - Solar radiation index
- 🌡️ **Max/Min** - Daily high and low temperatures

### Forecast Cards
- Date of forecast
- Weather condition icon
- Description
- High and low temperatures

## 🎨 Weather Conditions

The app uses WMO weather codes to display accurate conditions:
- ☀️ Clear sky
- 🌤️ Mainly clear / Partly cloudy
- ☁️ Overcast
- 🌫️ Foggy
- 🌧️ Rain (light to moderate)
- ⛈️ Heavy rain / Thunderstorm
- ❄️ Snow
- 🌨️ Snow showers

## 💻 Technical Implementation

### HTML Structure
- Semantic HTML5 elements
- Accessible form inputs
- Organized sections for different features
- Dynamic content injection areas

### CSS Styling
- CSS Grid and Flexbox layouts
- Responsive design with media queries
- Smooth animations and transitions
- CSS variables for easy customization
- Modern gradients and shadows

### JavaScript (ES6+)
- Object-oriented WeatherDashboard class
- Fetch API for HTTP requests
- Geolocation API for location detection
- Event listener management
- Dynamic DOM manipulation
- Error handling and validation
- Timezone-aware date formatting

### APIs Used
1. **Fetch API** - Making HTTP requests
2. **Geolocation API** - Getting user's location
3. **Open-Meteo API** - Weather data
4. **Geocoding API** - City name to coordinates

## 📱 Responsive Breakpoints

- **Desktop** (>768px): Full layout with 6 detail cards in 3 columns
- **Tablet** (768px): Adjusted spacing, 2 columns for cards
- **Mobile** (<480px): Stack layout for optimal readability

## 🎯 Usage Examples

### Searching for Weather
1. Type "Tokyo" in the search box
2. Click "Search" or press Enter
3. View current weather and 5-day forecast

### Using Your Location
1. Click "📍 Current Location"
2. Allow browser to access your location
3. See weather for your area (auto-detected city)

### Reading Weather Details
- **Temperature**: Large number in blue
- **Condition**: Text description (e.g., "Slight rain")
- **Humidity**: Percentage value
- **Wind**: Speed in kilometers per hour
- **Forecast**: Each day shows high/low temps

## 🔒 Privacy & Security

- Location data only used locally
- No tracking or data storage
- All requests go to public APIs
- No personal data collected
- Safe HTML escaping for user input

## 🌐 Browser Compatibility

- ✅ Chrome (all versions)
- ✅ Firefox (all versions)
- ✅ Safari (all versions)
- ✅ Edge (all versions)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile, etc.)
- ⚠️ IE11 not supported (uses modern JavaScript)

## 🎓 Learning Resources

This project demonstrates:
- HTML5 semantic structure
- CSS3 layout techniques (Grid, Flexbox)
- Modern JavaScript (ES6+, Classes)
- Fetch API for data retrieval
- Geolocation API usage
- Error handling and user feedback
- Responsive web design
- Third-party API integration
- Date and timezone handling

## 💡 Code Highlights

### Fetching Weather Data
```javascript
async fetchWeatherByCity(city) {
    const geoResponse = await fetch(
        `${this.geoCodeUrl}?name=${encodeURIComponent(city)}`
    );
    const geoData = await geoResponse.json();
    
    const location = geoData.results[0];
    await this.fetchWeatherByCoordinates(
        location.latitude, 
        location.longitude
    );
}
```

### Getting Geolocation
```javascript
getCurrentLocation() {
    navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        this.fetchWeatherByCoordinates(latitude, longitude);
    });
}
```

### Weather Code to Description
```javascript
getWeatherDescription(code) {
    const descriptions = {
        0: 'Clear sky',
        1: 'Mainly clear',
        2: 'Partly cloudy',
        // ... more codes
    };
    return descriptions[code];
}
```

## 🚀 Future Enhancement Ideas

- Temperature unit toggle (Celsius/Fahrenheit)
- Search history / favorite cities
- Weather alerts and warnings
- Air quality index display
- Pollen forecasts
- Sunrise/sunset times
- Hourly forecast view
- Dark mode toggle
- Weather maps integration
- Multiple location tracking

## ⚡ Performance Tips

- **Fast Loading**: API calls are optimized
- **Caching**: Consider adding local caching for frequent searches
- **Lazy Loading**: Images load as needed
- **Minimal Dependencies**: No external libraries required

## 📞 Support & Troubleshooting

### Common Issues

**"City not found" error**
- Check spelling of city name
- Try with country name (e.g., "London, UK")
- Some small cities may not be available

**Geolocation not working**
- Ensure HTTPS is being used (required for geolocation)
- Check browser permissions for location access
- Try on a different browser

**No internet connection**
- API requires active internet connection
- Check your network connectivity

## 📚 API Documentation

For more information about the Open-Meteo API:
- [Open-Meteo Documentation](https://open-meteo.com/)
- [Weather Codes Reference](https://open-meteo.com/en/docs)
- [Geocoding API Docs](https://open-meteo.com/en/docs/geocoding-api)

## 🏆 Best Practices Implemented

- ✅ Error handling and validation
- ✅ Semantic HTML structure
- ✅ Responsive design patterns
- ✅ Accessibility considerations
- ✅ Performance optimization
- ✅ Code organization and comments
- ✅ User feedback (loading, errors)
- ✅ Clean, maintainable code

---

**Created**: 2026  
**Purpose**: Real-time weather information and forecasting  
**Technology**: HTML5, CSS3, Vanilla JavaScript, Fetch API, Geolocation API, Open-Meteo API
