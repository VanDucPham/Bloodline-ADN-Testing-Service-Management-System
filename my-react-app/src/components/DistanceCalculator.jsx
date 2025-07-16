import React, { useState } from 'react';
import { getDistance } from '../service/api/ApiServiceManage';

function DistanceCalculator() {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [distance, setDistance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCalculate = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getDistance(origin, destination);
      setDistance(result);
    } catch (err) {
      setError('Lỗi khi tính khoảng cách');
      setDistance(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '2rem auto', padding: 20, border: '1px solid #ccc', borderRadius: 8 }}>
      <h2>Tính khoảng cách (Google Maps API)</h2>
      <input
        value={origin}
        onChange={e => setOrigin(e.target.value)}
        placeholder="Điểm xuất phát (ví dụ: 10.762622,106.660172)"
        style={{ width: '100%', marginBottom: 8, padding: 8 }}
      />
      <input
        value={destination}
        onChange={e => setDestination(e.target.value)}
        placeholder="Điểm đến (ví dụ: 10.776889,106.700806)"
        style={{ width: '100%', marginBottom: 8, padding: 8 }}
      />
      <button onClick={handleCalculate} disabled={loading || !origin || !destination} style={{ width: '100%', padding: 10 }}>
        {loading ? 'Đang tính...' : 'Tính khoảng cách'}
      </button>
      {distance !== null && !error && (
        <div style={{ marginTop: 16 }}>Khoảng cách: <b>{distance} km</b></div>
      )}
      {error && <div style={{ color: 'red', marginTop: 16 }}>{error}</div>}
    </div>
  );
}

export default DistanceCalculator; 