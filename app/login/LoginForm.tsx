'use client';
// We put in place in another file to be able to implement the Google signUp in the file @/app/login/page.tsx
import React, { useState } from 'react';
import './page.css';

export default function LoginForm() {
  const [activeForm, setActiveForm] = useState('login');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<{ 
    email?: string; 
    password?: string; 
    confirmPassword?: string 
  }>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const validateForm = () => {
    let tempErrors: { 
      email?: string; 
      password?: string; 
      confirmPassword?: string 
    } = {};
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email)) {
      tempErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password || formData.password.length < 8) {
      tempErrors.password = 'Password must be at least 8 characters long';
    }

    if (activeForm === 'signup') {
      if (formData.password !== formData.confirmPassword) {
        tempErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (validateForm()) {
      console.log('Form submitted', formData);
      // Ajouter la logique de soumission côté client
    }
  };

  return (
    <div className="wrapper">
      <div className="title-text">
        <div className={`title login ${activeForm === 'login' ? 'active' : ''}`}>
          Login Form
        </div>
        <div className={`title signup ${activeForm === 'signup' ? 'active' : ''}`}>
          Signup Form
        </div>
      </div>
      <div className="form-container">
        <div className="slide-controls">
          <input 
            type="radio" 
            name="slide" 
            id="login" 
            checked={activeForm === 'login'}
            onChange={() => setActiveForm('login')}
          />
          <input 
            type="radio" 
            name="slide" 
            id="signup" 
            checked={activeForm === 'signup'}
            onChange={() => setActiveForm('signup')}
          />
          <label 
            htmlFor="login" 
            className={`slide login ${activeForm === 'login' ? 'active' : ''}`}
            onClick={() => setActiveForm('login')}
          >
            Login
          </label>
          <label 
            htmlFor="signup" 
            className={`slide signup ${activeForm === 'signup' ? 'active' : ''}`}
            onClick={() => setActiveForm('signup')}
          >
            Signup
          </label>
          <div className="slider-tab"></div>
        </div>
        <div className="form-inner">
          <form 
            onSubmit={handleSubmit}
            className={`login ${activeForm === 'login' ? 'active' : ''}`}
            style={{ marginLeft: activeForm === 'login' ? '0%' : '-50%' }}
          >
            <div className="field">
              <input 
                type="text" 
                name="email"
                placeholder="Email Address" 
                value={formData.email}
                onChange={handleInputChange}
                required 
              />
              {errors.email && <span className="error">{errors.email}</span>}
            </div>
            <div className="field">
              <input 
                type="password" 
                name="password"
                placeholder="Password" 
                value={formData.password}
                onChange={handleInputChange}
                required 
              />
              {errors.password && <span className="error">{errors.password}</span>}
            </div>
            <div className="pass-link">
              <a href="#">Forgot password?</a>
            </div>
            <div className="field btn">
              <div className="btn-layer"></div>
              <input type="submit" value="Login" />
            </div>
            <div className="signup-link">
              Not a member? <a href="#" onClick={() => setActiveForm('signup')}>Signup now</a>
            </div>
          </form>
          <form 
            onSubmit={handleSubmit}
            className={`signup ${activeForm === 'signup' ? 'active' : ''}`}
            style={{ marginLeft: activeForm === 'signup' ? '0%' : '0%' }}
          >
            <div className="field">
              <input 
                type="text" 
                name="email"
                placeholder="Email Address" 
                value={formData.email}
                onChange={handleInputChange}
                required 
              />
              {errors.email && <span className="error">{errors.email}</span>}
            </div>
            <div className="field">
              <input 
                type="password" 
                name="password"
                placeholder="Password" 
                value={formData.password}
                onChange={handleInputChange}
                required 
              />
              {errors.password && <span className="error">{errors.password}</span>}
            </div>
            <div className="field">
              <input 
                type="password" 
                name="confirmPassword"
                placeholder="Confirm password" 
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required 
              />
              {errors.confirmPassword && <span className="error">{errors.confirmPassword}</span>}
            </div>
            <div className="field btn">
              <div className="btn-layer"></div>
              <input type="submit" value="Signup" />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}