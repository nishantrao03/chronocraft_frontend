import React, { useState } from 'react';
import { auth, provider } from '../../firebase';
import { useSelector,useDispatch } from 'react-redux';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider} from "firebase/auth";
import { SetUserDetails } from '../../utils/authutils';
import { setUserId,setToken } from '../../redux/user/userSlice';
import axios from 'axios';
import './Auth.css';

const Login = ({ DirectToSignUp, CreateUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();

  // const handleLogin = (e) => {
  //   e.preventDefault();
  //   // Implement your login logic here
  //   // For simplicity, just printing the email for now
  //   console.log('Login with:', email);
  //   // Call onLogin prop to handle login logic in the parent component
  //   signInWithEmailAndPassword(auth,email,password)
  //   .then((userCredential) => {
  //     const uid = userCredential.uid;
  //     console.log(uid);
  //     SetUserDetails(uid,dispatch,setUserId,setToken);
  //     // Call FetchUser after login success
  //     //FetchUser(uid);
  //   }).catch((error) => {
  //       console.log(error);
  //   })
  // };

  const handleLogin = async (e) => {
    e.preventDefault();
  
    try {
      // Step 1: Log in using Firebase with email and password
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Step 2: Get the Firebase ID token
      const firebaseToken = await userCredential.user.getIdToken();
      console.log("Firebase Token:", firebaseToken);
  
      // Step 3: Send Firebase token to backend for JWT generation and HTTP-only cookie setup
      const response = await axios.post(
        'http://localhost:5000/login', 
        { firebaseToken }, 
        { withCredentials: true, timeout: 40000 } // Sending request with credentials for cookie setup
      );
      
      console.log(response);
      console.log("Login successful:", response.data.message);
  
      // Step 4: Set the userId in Redux to the current user id
      const userId = userCredential.user.uid;
      dispatch(setUserId(userId));
  
      // Step 5: Create the user in MongoDB
      //await CreateUser(userId);
      
    } catch (error) {
      console.error('Login error:', error);
    }
  };
  


  // const googleLogin = () => {
  //   const googleProvider = new GoogleAuthProvider();
  //   signInWithPopup(auth, googleProvider)
  //     .then(async (result) => {
  //       console.log('Google login success:', result.user);
  //       const uid =result.user.uid;
  //       //CreateUser(uid);
  //       await SetUserDetails(uid,dispatch,setUserId,setToken);
  //       console.log(uid);
  //       await CreateUser(uid);
  //       //call the fetchuser function
  //       //FetchUser(uid);
  //     })
  //     .catch((error) => {
  //       console.error('Google login error:', error);
  //     });
  // };

  // const googleLogin = async () => {
  //   const googleProvider = new GoogleAuthProvider();
  //   try {
  //     const result = await signInWithPopup(auth, googleProvider);
  //     const firebaseToken = await result.user.getIdToken();
  //     const uid = result.user.uid;
  //     console.log(firebaseToken,uid);
  //     // Send Firebase token to backend for JWT generation
  //     await axios.post('http://localhost:5000/login', { firebaseToken }, { withCredentials: true });
  //     // fetch('http://localhost:5000/login', {
  //     //   method: 'POST',
  //     //   headers: {
  //     //     'Content-Type': 'application/json',
  //     //     // 'Authorization': `Bearer ${token}`, // Optional: add if needed
  //     //   },
  //     //   body: JSON.stringify({ firebaseToken }),
  //     //   credentials: 'include', // Ensures cookies are sent with the request
  //     // })
  //     //   .then(response => {
  //     //     if (!response.ok) {
  //     //       throw new Error('Failed to log in');
  //     //     }
  //     //     return response.json();
  //     //   })
  //     //   .then(data => {
  //     //     console.log('Login successful:', data.message);
  //     //   })
  //     //   .catch(error => {
  //     //     console.error('Error logging in:', error);
  //     //     // Handle error
  //     //   });
      
  //     console.log('Google login successful');
  //     CreateUser(uid);
  //   } catch (error) {
  //     console.error('Google login error:', error);
  //   }
  // };

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

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
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
          <button type="submit">Login</button>
        </form>
        <button className="google-btn" onClick={googleLogin}>Sign In with Google</button>
        <p className="signup-link">
          Don't have an account? <a href="#" onClick={DirectToSignUp}>Create a new account here</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
