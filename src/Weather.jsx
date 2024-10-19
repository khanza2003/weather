import React, { useState } from 'react';
import './style.css';

function Weather() {
    const [data, setData] = useState({
        celcius: null,
        name: '',
        humidity: null,
        speed: null,
        image: ''
    });
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchWeatherData = () => {
        console.log("Fetching weather data for:", name);
        setLoading(true);
        setError(null);

        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${name}&appid=8ac5c4d57ba6a4b3dfcf622700447b1e&units=metric`)
            .then(res => {
                if (!res.ok) {
                    throw new Error('Network response was not ok');
                }
                return res.json(); 
            })
            .then(weatherData => {
                console.log("Weather data:", weatherData);

               
                const condition = weatherData.weather[0].main; 
                let imagePath = ''; 

                if (condition === "Clear") {
                    imagePath = "/images/clear.png";
                } else if (condition === "Haze") {
                    imagePath = "/images/dizzler.png";
                } else if (condition === "Rain") {
                    imagePath = "/images/rain.png";
                } else if (condition === "Clouds") {
                    imagePath = "/images/cloud.png";
                } else if (condition === "Snow") {
                    imagePath = "/images/snow.png";
                } else {
                    imagePath = "/images/sun.png"; 
                }

                if (weatherData && weatherData.main) {
                    setData({
                        celcius: weatherData.main.temp,
                        name: weatherData.name,
                        humidity: weatherData.main.humidity,
                        speed: weatherData.wind.speed,
                        image: imagePath
                    });
                } else {
                    throw new Error('Data format error');
                }
            })
            .catch(err => {
                setError('Please Enter A Valid City Name');
                console.error("Fetch error:", err);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const handleClick = () => {
        const trimmedName = name.trim();
        if (trimmedName !== "") {
            fetchWeatherData();
        } else {
            setError('Please enter a city name');
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className='container'>
            <div className="weather">
                <div className="search">
                    <input
                        type="text"
                        placeholder='Enter City Name'
                        onChange={e => setName(e.target.value)}
                        value={name}
                    />
                    <button onClick={handleClick}>
                        <img style={{ width: '40px' }} src="/images/search.png" alt="Search" />
                    </button>
                </div>
                {data.celcius !== null && (
                    <div className="winfo">
                        <img src={data.image} alt="Weather icon" />
                        <h1>{Math.round(data.celcius)}°C</h1>
                        <h2>{data.name || 'N/A'}</h2>
                        <div className="details">
                            <div className="col">
                                <img src="/images/humidity.png" alt="Humidity icon" />
                                <div className='humidity'>
                                    <p>{Math.round(data.humidity)}%</p>
                                    <p>Humidity</p>
                                </div>
                            </div>
                            <div className="col">
                                <img src="/images/wind.png" alt="Wind icon" />
                                <div className='wind'>
                                    <p>{Math.round(data.speed)} km/h</p>
                                    <p>Wind</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Weather;