import './App.css';
import { useState } from 'react';
import axios from 'axios';

function App() {
  const [query, setQuery] = useState('');
  const [weather, setWeather] = useState({
    loading: false,
    data: {},
    error: false,
  });

  const toDate = () => {
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',  // Fixed typo here from 'Nocvember'
      'December',
    ];
    const days = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];

    const currentDate = new Date();
    const date = `${days[currentDate.getDay()]} ${currentDate.getDate()} ${months[currentDate.getMonth()]}`;
    return date;
  }

  const search = async () => {
    if (!query) return;  // Prevent search if query is empty
    setWeather({ ...weather, loading: true });
    const url = 'https://api.openweathermap.org/data/2.5/weather';
    const appid = '023431cfe3cf64071acaac1e6f01b225';

    try {
      const res = await axios.get(url, {
        params: {
          q: query,
          units: 'metric',
          appid: appid,
        },
      });
      setWeather({ data: res.data, loading: false, error: false });
      setQuery('');  // Clear query after search
    } catch (error) {
      setWeather({ ...weather, data: {}, loading: false, error: true });
      console.error('Error fetching weather:', error);
    }
  };

  return (
    <div className="App">
      <h1>Know Weather using React JS App</h1>
      <div className='search-bar'>
        <input
          type="text"
          className='city-search'
          placeholder='Search city'
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && search()}
        />
        <button onClick={search} className='search-button'>
          Search
        </button>
      </div>

      {weather.loading && <h4>Searching...</h4>}
      
      {weather.error && (
        <span className='error-message'>
          Sorry city not found, please try again.
        </span>
      )}

      {weather.data && weather.data.main && (
        <div>
          <div className='city-name'>
            <h2>
              {weather.data.name}, <span>{weather.data.sys.country}</span>
            </h2>
          </div>
          <div className='date'>
            <span>{toDate()}</span>
          </div>
          <div className='icon-temp'>
            <img
              src={`https://openweathermap.org/img/wn/${weather.data.weather[0].icon}@2x.png`}
              alt={weather.data.weather[0].description}
            />
            {Math.round(weather.data.main.temp)}<sup className='deg'>°C</sup>
          </div>
          <div className='des-wind'>
            <p>{weather.data.weather[0].description.toUpperCase()}</p>
            <p>Wind speed: {weather.data.wind.speed} m/s</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
