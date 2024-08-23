import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import '../../App.css';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const { setUser } = useUser(); // Use context

  const validate = (name, value) => {
    const newErrors = { ...errors };

    switch (name) {
      case 'email':
        newErrors.email = !value || !/\S+@\S+\.\S+/.test(value) ? 'Please enter a valid email address.' : '';
        break;
      case 'password':
        newErrors.password = !value || value.length < 6 ? 'Password must be at least 6 characters long.' : '';
        break;
      default:
        break;
    }

    setErrors(newErrors);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    validate(name, value);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (Object.keys(errors).every(key => !errors[key])) {
      try {
        setLoading(true);
  
        const response = await axios.post('http://localhost:5000/api/auth/login', formData, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
  
        // Log the entire response object
        console.log('Response data:', response.data);
  
        const { token, id, fullName, email, phoneNumber, gender } = response.data;
  
        // Log the ID to the console
        console.log('User ID from response:', id);
  
        if (token) {
          localStorage.setItem('token', token);
          localStorage.setItem('id', id);
  
          setUser({ id, fullName, email, phoneNumber, gender });
  
          Swal.fire({
            title: 'Welcome!',
            text: 'Your login was successful!',
            icon: 'success',
            confirmButtonText: 'OK'
          }).then(() => {
            navigate('/profile');
          });
        } else {
          setErrorMessage('Token or user data is missing.');
        }
      } catch (error) {
        console.error('Login error:', error.response ? error.response.data : error);
        setErrorMessage(error.response?.data?.message || 'An error occurred. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };
  

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'error' : ''}
            />
            {errors.email && <p className="error-message">{errors.email}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? 'error' : ''}
            />
            {errors.password && <p className="error-message">{errors.password}</p>}
          </div>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <button type="submit" disabled={loading}>Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
