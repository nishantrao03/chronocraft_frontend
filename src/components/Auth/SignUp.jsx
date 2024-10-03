import React, { useState } from 'react';
import { auth, provider } from '../../firebase';
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import axios from 'axios';
import { useDispatch,useSelector } from 'react-redux';
import { setUserId } from '../../redux/user/userSlice';
import "./Auth.css";

const Signup = ({ DirectToLogin, CreateUser, setUserDetails }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();

  const handleSignup = async (e) => {
    e.preventDefault();
  
    try {
      // Step 1: Create user with email and password using Firebase
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log(userCredential);
  
      const uid = userCredential.user.uid;
  
      // Step 2: Get the Firebase ID token (Access Token)
      const firebaseToken = await userCredential.user.getIdToken();
      console.log("Firebase Token:", firebaseToken);
  
      // Step 3: Send Firebase token to the backend for JWT generation and HTTP-only cookie setup
      const response = await axios.post(
        'http://localhost:5000/login', 
        { firebaseToken }, 
        { withCredentials: true, timeout: 40000 } // Ensure credentials are passed for cookie setup
      );
      console.log(response);
      console.log("Signup successful:", response.data.message);
  
      // Step 4: Set the userId in Redux to the current user id
      dispatch(setUserId(uid));
  
      // Step 5: Create the user in MongoDB
      await CreateUser(uid);
  
      // Optionally, call FetchUser if needed
      // await FetchUser(uid);
      
    } catch (error) {
      console.error('Error during sign-up:', error);
    }
  };
  
  

  const googleLogin = async () => {
    const googleProvider = new GoogleAuthProvider();
    try {
      // Step 1: Firebase Google Sign-In
      const result = await signInWithPopup(auth, googleProvider);
      
      // Step 2: Get the Firebase ID token (Access Token)
      const firebaseToken = await result.user.getIdToken();
      console.log("Firebase Token:", firebaseToken);
  
      // Step 3: Send Firebase Token to the Backend for JWT Generation and Cookie Setup
      const response = await axios.post('http://localhost:5000/login', 
        { firebaseToken }, 
        {
          withCredentials: true, 
          timeout: 40000 // Timeout of 40 seconds (40,000 milliseconds)
        }
      );
      console.log(response);
      // Step 4: The backend response will include an HTTP-only cookie with the access token.
      console.log("Login successful:", response.data.message);
      //set the userId in redux to the current user id
      const userId = result.user.uid; // Get user ID from Firebase
    dispatch(setUserId(userId));
    //create user in mongodb
    await CreateUser(userId);
      
    } catch (error) {
      console.error('Google login error:', error);
    }
  };

  // return (
  //   <div>
  //     <h2>Signup</h2>
  //     <form onSubmit={handleSignup}>
  //       <label>Email:
  //         <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
  //       </label>
  //       <br />
  //       <label>Password:
  //         <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
  //       </label>
  //       <br />
  //       <button type="submit" onClick={handleSignup}>Signup</button>
  //     </form>
  //     <button onClick={googleLogin}>Sign In with Google</button>
  //     <p>
  //       Already have an account? <a href="#" onClick={ DirectToLogin }>Log in here</a>
  //     </p>
  //   </div>
  // );
  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Signup</h2>
        <form onSubmit={handleSignup}>
          <input 
            type="email" 
            placeholder="Email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
          <button type="submit">Signup</button>
        </form>
        <button className="google-btn" onClick={googleLogin}>Sign In with Google</button>
        <p className="signup-link">
          Already have an account? <a href="#" onClick={DirectToLogin}>Log in here</a>
        </p>
      </div>
    </div>
  );
};

export default Signup;
