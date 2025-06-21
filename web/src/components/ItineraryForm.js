import React, { useState } from 'react';
import './ItineraryForm.css';

const ItineraryForm = () => {
  const [formData, setFormData] = useState({
    itinerary: [
      {
        name: 'Starting Point',
        address: '100 Market St, Chattanooga, TN 37402',
        coordinates: {
          latitude: 35.0456,
          longitude: -85.3097
        }
      },
      {
        name: 'Hamilton Place Mall',
        address: '2100 Hamilton Place Blvd, Chattanooga, TN 37421',
        coordinates: {
          latitude: 35.0381,
          longitude: -85.1585
        }
      }
    ],
    targetDepartureTime: new Date().toISOString().slice(0, 16),
    modes: ['WALK', 'BUS', 'CAR'],
    maxWalkingDistance: 500,
    maxBikingDistance: 2000,
    costPriority: 0.7,
    timePriority: 0.3
  });

  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const apiUrl = 'http://vianooga.4rd.ai:3001';
      const res = await fetch(`${apiUrl}/itinerary`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          targetDepartureTime: new Date(formData.targetDepartureTime).toISOString()
        })
      });

      const data = await res.json();
      if (data.status === 'error') {
        setError(data.error || 'An error occurred');
      } else {
        setResponse(data);
      }
    } catch (err) {
      setError('Failed to connect to the server');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleModeToggle = (mode) => {
    setFormData(prev => ({
      ...prev,
      modes: prev.modes.includes(mode)
        ? prev.modes.filter(m => m !== mode)
        : [...prev.modes, mode]
    }));
  };

  const handleWaypointChange = (index, field, value) => {
    const newItinerary = [...formData.itinerary];
    if (field === 'latitude' || field === 'longitude') {
      newItinerary[index].coordinates = {
        ...newItinerary[index].coordinates,
        [field]: parseFloat(value) || 0
      };
    } else {
      newItinerary[index][field] = value;
    }
    setFormData(prev => ({ ...prev, itinerary: newItinerary }));
  };

  const addWaypoint = () => {
    setFormData(prev => ({
      ...prev,
      itinerary: [...prev.itinerary, { name: '', address: '', coordinates: { latitude: 0, longitude: 0 } }]
    }));
  };

  const removeWaypoint = (index) => {
    if (formData.itinerary.length > 2) {
      setFormData(prev => ({
        ...prev,
        itinerary: prev.itinerary.filter((_, i) => i !== index)
      }));
    }
  };

  return (
    <div className="itinerary-form-container">
      <h1>Vianooga - Chattanooga Travel Planner</h1>
      
      <form onSubmit={handleSubmit} className="itinerary-form">
        <div className="form-section">
          <h2>Waypoints</h2>
          {formData.itinerary.map((waypoint, index) => (
            <div key={index} className="waypoint-group">
              <h3>Stop {index + 1}</h3>
              <input
                type="text"
                placeholder="Name"
                value={waypoint.name || ''}
                onChange={(e) => handleWaypointChange(index, 'name', e.target.value)}
              />
              <input
                type="text"
                placeholder="Address"
                value={waypoint.address || ''}
                onChange={(e) => handleWaypointChange(index, 'address', e.target.value)}
              />
              <div className="coordinates">
                <input
                  type="number"
                  placeholder="Latitude"
                  step="0.0001"
                  value={waypoint.coordinates?.latitude || ''}
                  onChange={(e) => handleWaypointChange(index, 'latitude', e.target.value)}
                />
                <input
                  type="number"
                  placeholder="Longitude"
                  step="0.0001"
                  value={waypoint.coordinates?.longitude || ''}
                  onChange={(e) => handleWaypointChange(index, 'longitude', e.target.value)}
                />
              </div>
              {formData.itinerary.length > 2 && (
                <button type="button" onClick={() => removeWaypoint(index)} className="remove-btn">
                  Remove
                </button>
              )}
            </div>
          ))}
          <button type="button" onClick={addWaypoint} className="add-btn">
            Add Waypoint
          </button>
        </div>

        <div className="form-section">
          <h2>Travel Options</h2>
          
          <div className="form-group">
            <label>Departure Time:</label>
            <input
              type="datetime-local"
              value={formData.targetDepartureTime}
              onChange={(e) => setFormData(prev => ({ ...prev, targetDepartureTime: e.target.value }))}
            />
          </div>

          <div className="form-group">
            <label>Transportation Modes:</label>
            <div className="mode-toggles">
              {['WALK', 'BIKE', 'CAR', 'BUS', 'TRAIN'].map(mode => (
                <label key={mode} className="mode-toggle">
                  <input
                    type="checkbox"
                    checked={formData.modes.includes(mode)}
                    onChange={() => handleModeToggle(mode)}
                  />
                  {mode}
                </label>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Max Walking Distance: {formData.maxWalkingDistance}m</label>
            <input
              type="range"
              min="100"
              max="5000"
              step="100"
              value={formData.maxWalkingDistance}
              onChange={(e) => setFormData(prev => ({ ...prev, maxWalkingDistance: parseInt(e.target.value) }))}
            />
          </div>

          <div className="form-group">
            <label>Max Biking Distance: {formData.maxBikingDistance}m</label>
            <input
              type="range"
              min="500"
              max="20000"
              step="500"
              value={formData.maxBikingDistance}
              onChange={(e) => setFormData(prev => ({ ...prev, maxBikingDistance: parseInt(e.target.value) }))}
            />
          </div>

          <div className="form-group">
            <label>Cost Priority: {(formData.costPriority * 100).toFixed(0)}%</label>
            <div className="priority-labels">
              <span>Cheapest</span>
              <span>Most Expensive</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={formData.costPriority}
              onChange={(e) => setFormData(prev => ({ ...prev, costPriority: parseFloat(e.target.value) }))}
            />
          </div>

          <div className="form-group">
            <label>Time Priority: {(formData.timePriority * 100).toFixed(0)}%</label>
            <div className="priority-labels">
              <span>Fastest</span>
              <span>Most Scenic</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={formData.timePriority}
              onChange={(e) => setFormData(prev => ({ ...prev, timePriority: parseFloat(e.target.value) }))}
            />
          </div>
        </div>

        <button type="submit" disabled={loading} className="submit-btn">
          {loading ? 'Planning Route...' : 'Plan My Route'}
        </button>
      </form>

      {error && (
        <div className="error-message">
          <h3>Error</h3>
          <p>{error}</p>
        </div>
      )}

      {response && response.status === 'success' && (
        <div className="results">
          <h2>Route Options</h2>
          <div className="route-cards">
            {response.data.choices.map((choice, index) => (
              <div key={index} className="route-card">
                <h3>Option {index + 1}</h3>
                <div className="route-summary">
                  <p><strong>Total Time:</strong> {Math.round(choice.totalDuration / 60)} minutes</p>
                  <p><strong>Total Distance:</strong> {(choice.totalDistance / 1000).toFixed(1)} km</p>
                  <p><strong>Total Cost:</strong> ${choice.totalCost.toFixed(2)}</p>
                </div>
                
                <h4>Steps:</h4>
                <div className="route-steps">
                  {choice.steps.map((step, stepIndex) => (
                    <div key={stepIndex} className="step">
                      <div className="step-header">
                        <span className={`mode-badge ${step.mode.toLowerCase()}`}>{step.mode}</span>
                        <span className="duration">{Math.round(step.duration / 60)} min</span>
                      </div>
                      <p className="description">{step.description}</p>
                      <div className="step-details">
                        <span>{(step.distance / 1000).toFixed(1)} km</span>
                        <span>${step.cost.toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="start-times">
                  <h4>Available Start Times:</h4>
                  {choice.possibleStartTimes.map((time, timeIndex) => (
                    <span key={timeIndex} className="start-time">
                      {new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ItineraryForm;