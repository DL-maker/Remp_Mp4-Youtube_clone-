import React, { useState } from 'react';
import './page.css';

export default function Login() {
  const [activeForm, setActiveForm] = useState('login');

  const handleSlideChange = (formType) => {
    setActiveForm(formType);
  };

  return (
    <div className="wrapper">
      <div className="title-text">
        <div className={`title login ${activeForm === 'login' ? 'active' : ''}`}>Login Form</div>
        <div className={`title signup ${activeForm === 'signup' ? 'active' : ''}`}>Signup Form</div>
      </div>
      <div className="form-container">
        <div className="slide-controls">
          <input 
            type="radio" 
            name="slide" 
            id="login" 
            checked={activeForm === 'login'}
            onChange={() => handleSlideChange('login')}
          />
          <input 
            type="radio" 
            name="slide" 
            id="signup" 
            checked={activeForm === 'signup'}
            onChange={() => handleSlideChange('signup')}
          />
          <label 
            htmlFor="login" 
            className={`slide login ${activeForm === 'login' ? 'active' : ''}`}
            onClick={() => handleSlideChange('login')}
          >
            Login
          </label>
          <label 
            htmlFor="signup" 
            className={`slide signup ${activeForm === 'signup' ? 'active' : ''}`}
            onClick={() => handleSlideChange('signup')}
          >
            Signup
          </label>
          <div className="slider-tab"></div>
        </div>
        <div className="form-inner">
          <form 
            action="#" 
            className={`login ${activeForm === 'login' ? 'active' : ''}`}
            style={{ 
              marginLeft: activeForm === 'login' ? '0%' : '-50%' 
            }}
          >
            <div className="field">
              <input type="text" placeholder="Email Address" required />
            </div>
            <div className="field">
              <input type="password" placeholder="Password" required />
            </div>
            <div className="pass-link">
              <a href="#">Forgot password?</a>
            </div>
            <div className="field btn">
              <div className="btn-layer"></div>
              <input type="submit" value="Login" />
            </div>
            <div className="signup-link">
              Not a member? <a href="#" onClick={() => handleSlideChange('signup')}>Signup now</a>
            </div>
          </form>
          <form 
            action="#" 
            className={`signup ${activeForm === 'signup' ? 'active' : ''}`}
            style={{ 
              marginLeft: activeForm === 'signup' ? '0%' : '0%' 
            }}
          >
            <div className="field">
              <input type="text" placeholder="Email Address" required />
            </div>
            <div className="field">
              <input type="password" placeholder="Password" required />
            </div>
            <div className="field">
              <input type="password" placeholder="Confirm password" required />
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