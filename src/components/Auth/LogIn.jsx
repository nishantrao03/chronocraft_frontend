import React, { useState } from 'react';
import { auth, provider } from '../../firebase';
import { useDispatch } from 'react-redux';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { setUserId } from '../../redux/user/userSlice';
import axios from 'axios';
import './Auth.css';

const Login = ({ DirectToSignUp, CreateUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  console.log(process.env.REACT_APP_API_URL)
  const apiurl=process.env.REACT_APP_API_URL;
  console.log(apiurl);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseToken = await userCredential.user.getIdToken();
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/login`,
        { firebaseToken },
        { withCredentials: true, timeout: 40000 }
      );
      const userId = userCredential.user.uid;
      dispatch(setUserId(userId));
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const googleLogin = async () => {
    const googleProvider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log("Debug 1");
      const firebaseToken = await result.user.getIdToken();
      console.log("Debug 2");
      const response = await axios.post(
        `${apiurl}/login`,
        { firebaseToken },
        { withCredentials: true, timeout: 80000 }
      );
      console.log("Debug 3");
      const userId = result.user.uid;
      console.log("Debug 4");
      dispatch(setUserId(userId));
      console.log("Debug 5");
      await CreateUser(userId);
    } catch (error) {
      console.error('Google login error:', error);
    }
  };

  return (
    <div className="login-container">
      <div className="login-content">
        <h2 className="login-heading">Welcome to ChronoCraft</h2>
        <p className="login-description">Log in to get started with task management and seamless collaboration.</p>
        <form className="login-form" onSubmit={handleLogin}>
          <input 
            type="email" 
            placeholder="Email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
            className="login-input"
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
            className="login-input"
          />
          <button type="submit" className="login-button">Login</button>
        </form>
        <button className="google-btn" onClick={googleLogin}>Sign In with Google</button>
        <p className="signup-link">
          Don’t have an account? <a href="#" onClick={DirectToSignUp}>Create a new account here</a>
        </p>
      </div>
    </div>
  );
  
};

export default Login;
