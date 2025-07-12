import React, { useState } from 'react';
import './Feedback.css'; // Assuming you have a CSS file for styling

const Feedback = () => {
  const [formData, setFormData] = useState({
    feedback_text: '',
    rating: 5,
    appointment_id: '',
    service_id: '',
    user_id: '',
    feedback_date: new Date().toISOString().slice(0, 19).replace('T', ' ')
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8080/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error(`Lỗi HTTP: ${response.status}`);
      }

      const result = await response.json();
      console.log('Đã gửi thành công:', result);
      setMessage('✅ Gửi phản hồi thành công!');

      // Reset form
      setFormData({
        feedback_text: '',
        rating: 5,
        appointment_id: '',
        service_id: '',
        user_id: '',
        feedback_date: new Date().toISOString().slice(0, 19).replace('T', ' ')
      });
    } catch (error) {
      console.error('Gửi thất bại:', error);
      setMessage('❌ Gửi phản hồi thất bại.');
    }
  };

  return (
    <div style={styles.container}>
      <h2>Gửi Phản Hồi</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <label>Phản hồi:</label>
        <textarea
          name="feedback_text"
          value={formData.feedback_text}
          onChange={handleChange}
          rows="4"
          required
          style={styles.input}
        />

        <label>Đánh giá (1-5):</label>
        <select
          name="rating"
          value={formData.rating}
          onChange={handleChange}
          style={styles.input}
        >
          {[5, 4, 3, 2, 1].map((star) => (
            <option key={star} value={star}>{star} sao</option>
          ))}
        </select>

        <label>ID Cuộc hẹn (appointment_id):</label>
        <input
          type="number"
          name="appointment_id"
          value={formData.appointment_id}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <label>ID Dịch vụ (service_id):</label>
        <input
          type="number"
          name="service_id"
          value={formData.service_id}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <label>ID Người dùng (user_id):</label>
        <input
          type="number"
          name="user_id"
          value={formData.user_id}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <button type="submit" style={styles.button}>Gửi phản hồi</button>
        {message && <p style={{ marginTop: '1rem' }}>{message}</p>}
      </form>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '500px',
    margin: 'auto',
    padding: '2rem',
    backgroundColor: '#f5f5f5',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)'
  },
  form: {
    display: 'flex',
    flexDirection: 'column'
  },
  input: {
    padding: '0.5rem',
    marginTop: '0.3rem',
    marginBottom: '1rem',
    borderRadius: '5px',
    border: '1px solid #ccc'
  },
  button: {
    padding: '0.7rem',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer'
  }
};

export default Feedback;
