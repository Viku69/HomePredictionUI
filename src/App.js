import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [totalSqft, setTotalSqft] = useState('');
  const [location, setLocation] = useState('');
  const [bhk, setBhk] = useState('');
  const [bath, setBath] = useState('');
  const [estimatedPrice, setEstimatedPrice] = useState(null);
  const [error, setError] = useState('');
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false); // Loading state

  // Fetch locations when the component mounts
  useEffect(() => {
    const fetchLocations = async () => {
      setLoading(true); 
      try {
        const response = await axios.get('https://homepredictionapi.onrender.com/get_location_names');
        setLocations(response.data.locations);
      } catch (err) {
        setError('Error fetching locations.');
      } finally {
        setLoading(false); // Hide loading after response
      }
    };
    fetchLocations();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); 

    try {
      const response = await axios.post('https://homepredictionapi.onrender.com/predict_home_price', null, {
        params: {
          total_sqft: totalSqft,
          location: location,
          bhk: bhk,
          bath: bath,
        },
      });
      setEstimatedPrice(response.data.estimated_price);
      setError('');
    } catch (err) {
      setError('Error fetching prediction. Please check the input data.');
      setEstimatedPrice(null);
    } finally {
      setLoading(false); // Hide loading after response
    }
  };

  // Reset the form fields and result
  const handleReset = () => {
    setTotalSqft('');
    setLocation('');
    setBhk('');
    setBath('');
    setEstimatedPrice(null);
    setError('');
  };


  return (
    <div className="App">
      <h1>Home Price Prediction</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Location:</label>
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          >
            <option value="">Select a Location</option>
            {locations.map((loc, index) => (
              <option key={index} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Total Sqft:</label>
          <input
            type="number"
            value={totalSqft}
            onChange={(e) => setTotalSqft(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Bedrooms (BHK):</label>
          <input
            type="number"
            value={bhk}
            onChange={(e) => setBhk(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Bathrooms (Bath):</label>
          <input
            type="number"
            value={bath}
            onChange={(e) => setBath(e.target.value)}
            required
          />
        </div>
        <button type="submit">Get Estimated Price</button>
      </form>

      {/* Reset Button */}
      <button onClick={handleReset} style={{ marginTop: '10px' }}>Reset</button>

      {/* Loading Bar */}
      {loading && (
        <div className="loading-container">
          <div className="loading-bar"></div>
        </div>
      )}

      {estimatedPrice !== null && (
        <div>
          <h2>Estimated Price: ₹{estimatedPrice}</h2>
        </div>
      )}

      {error && (
        <div style={{ color: 'red' }}>
          <h3>{error}</h3>
        </div>
      )}
    </div>
  );
}

export default App;
