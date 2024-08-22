import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import '../../App.css';

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    gender: ''
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { setUser } = useUser(); // Use context to set user

  const validate = (name, value) => {
    const newErrors = { ...errors };

    switch (name) {
      case 'fullName':
        newErrors.fullName = !value || /\d/.test(value) ? 'Full Name should not contain numbers and cannot be empty.' : '';
        break;
      case 'email':
        newErrors.email = !value || !/\S+@\S+\.\S+/.test(value) ? 'Please enter a valid email address.' : '';
        break;
      case 'phoneNumber':
        newErrors.phoneNumber = !value || !/^\d{10}$/.test(value) ? 'Phone Number must be exactly 10 digits.' : '';
        break;
      case 'password':
        newErrors.password = !value || !/(?=.*[a-zA-Z])(?=.*\d)(?=.*[\W_]).{6,}/.test(value) ? 'Password must include letters, numbers, and symbols, and be at least 6 characters long.' : '';
        break;
      case 'confirmPassword':
        newErrors.confirmPassword = value !== formData.password ? 'Passwords do not match.' : '';
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
    if (validateAll()) {
      try {
        const response = await axios.post('http://localhost:5000/api/auth/register', formData);
        console.log('Registration successful:', response.data);

        // Store user data in UserContext
        setUser(response.data); // Update context with user data

        // Show SweetAlert2 message
        Swal.fire({
          title: 'Welcome!',
          text: `Hello, ${formData.fullName}. Your registration was successful!`,
          icon: 'success',
          confirmButtonText: 'OK'
        }).then(() => {
          navigate('/login');
        });

      } catch (error) {
        if (error.response) {
          console.log('Registration failed:', error.response.data);
        } else {
          console.error('Error:', error.message);
        }
      }
    }
  };

  const validateAll = () => {
    validate('fullName', formData.fullName);
    validate('email', formData.email);
    validate('phoneNumber', formData.phoneNumber);
    validate('password', formData.password);
    validate('confirmPassword', formData.confirmPassword);
    return Object.keys(errors).every(key => errors[key] === '');
  };

  return (
    <div className="registration-form-container">
      <h2 className="form-title">Register</h2>
      <form className="registration-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="fullName">Full Name</label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className="form-input"
          />
          {errors.fullName && <p className="error-message">{errors.fullName}</p>}
        </div>
    
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="form-input"
          />
          {errors.email && <p className="error-message">{errors.email}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="phoneNumber">Phone Number</label>
          <input
            type="text"
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            className="form-input"
          />
          {errors.phoneNumber && <p className="error-message">{errors.phoneNumber}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="form-input"
          />
          {errors.password && <p className="error-message">{errors.password}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="form-input"
          />
          {errors.confirmPassword && <p className="error-message">{errors.confirmPassword}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="gender">Gender</label>
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="form-select"
          >
            <option value="">Select</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="preferNotToSay">Prefer not to say</option>
          </select>
        </div>
        <button type="submit" className="form-button">Register</button>
      </form>
    </div>
  );
};

export default Register;
