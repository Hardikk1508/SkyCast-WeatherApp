document.getElementById('getWeather').addEventListener('click', function() {
    const city = document.getElementById('city').value;
    const apiKey = '12ba4b343dd0c1d34233fdb504c11f39'; // Replace with your OpenWeatherMap API key
    const unit = document.getElementById('unit').value;
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${unit}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=${unit}`;

    fetch(apiUrl)
        .then(response => {
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                return response.json();
            } else {
                throw new Error("Received non-JSON response");
            }
        })
        .then(data => {
            if (data.cod === 200) {
                document.getElementById('cityName').textContent = data.name;
                document.getElementById('temperature').textContent = `Temperature: ${Math.round(data.main.temp)} °${unit === 'metric' ? 'C' : 'F'}`;
                document.getElementById('description').textContent = `Weather: ${data.weather[0].description}`;
                return fetch(forecastUrl);
            } else {
                document.getElementById('cityName').textContent = 'City not found';
                document.getElementById('temperature').textContent = '';
                document.getElementById('description').textContent = '';
                document.getElementById('forecastItems').innerHTML = '';
                throw new Error('City not found');
            }
        })
        .then(response => response.json())
        .then(data => {
            const forecastItems = document.getElementById('forecastItems');
            forecastItems.innerHTML = '';
            data.list.forEach((item, index) => {
                if (index % 8 === 0) { // Display data every 8th item (every 24 hours)
                    const forecastItem = document.createElement('div');
                    forecastItem.className = 'forecast-item';
                    forecastItem.innerHTML = `
                        <div>${new Date(item.dt * 1000).toLocaleDateString()}</div>
                        <div>${Math.round(item.main.temp)} °${unit === 'metric' ? 'C' : 'F'}</div>
                        <img src="http://openweathermap.org/img/wn/${item.weather[0].icon}.png" alt="${item.weather[0].description}">
                        <div>${item.weather[0].description}</div>
                    `;
                    forecastItems.appendChild(forecastItem);
                }
            });
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
            document.getElementById('cityName').textContent = 'Error';
            document.getElementById('temperature').textContent = '';
            document.getElementById('description').textContent = '';
            document.getElementById('forecastItems').innerHTML = '';
        });
});

document.getElementById('getCurrentLocation').addEventListener('click', function() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            const apiKey = '12ba4b343dd0c1d34233fdb504c11f39'; // Replace with your OpenWeatherMap API key
            const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${document.getElementById('unit').value}`;

            fetch(apiUrl)
                .then(response => response.json())
                .then(data => {
                    if (data.cod === 200) {
                        document.getElementById('cityName').textContent = data.name;
                        document.getElementById('temperature').textContent = `Temperature: ${Math.round(data.main.temp)} °${document.getElementById('unit').value === 'metric' ? 'C' : 'F'}`;
                        document.getElementById('description').textContent = `Weather: ${data.weather[0].description}`;
                        document.getElementById('forecastItems').innerHTML = ''; // Clear the forecast
                    } else {
                        document.getElementById('cityName').textContent = 'Location not found';
                        document.getElementById('temperature').textContent = '';
                        document.getElementById('description').textContent = '';
                        document.getElementById('forecastItems').innerHTML = '';
                    }
                })
                .catch(error => {
                    console.error('Error fetching weather data:', error);
                    document.getElementById('cityName').textContent = 'Error';
                    document.getElementById('temperature').textContent = '';
                    document.getElementById('description').textContent = '';
                    document.getElementById('forecastItems').innerHTML = '';
                });
        });
    } else {
        alert("Geolocation is not supported by this browser.");
    }
});

document.getElementById('addToWishlist').addEventListener('click', function() {
    const city = document.getElementById('city').value;
    if (city) {
        const wishlistItems = document.getElementById('wishlistItems');
        const existingItem = Array.from(wishlistItems.children).find(item => item.textContent.includes(city));
        if (!existingItem) {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <span class="city-link">${city}</span>
                <button class="remove">Remove</button>
            `;
            wishlistItems.appendChild(listItem);
        }
    }
});

document.getElementById('wishlistItems').addEventListener('click', function(event) {
    if (event.target.classList.contains('remove')) {
        event.target.parentElement.remove();
    } else if (event.target.classList.contains('city-link')) {
        document.getElementById('city').value = event.target.textContent;
        document.getElementById('getWeather').click();
    }
});
