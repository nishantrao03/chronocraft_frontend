import React, { useState } from 'react';
import Login from '../components/Auth/LogIn';
import Signup from '../components/Auth/SignUp';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setUserId, setToken } from '../redux/user/userSlice';
import { getIdToken } from 'firebase/auth';
import { auth } from '../firebase';
import {jwtDecode} from 'jwt-decode';

export default function Authenticate() {
    const [view, setView] = useState(0);
    const token = useSelector((state) => state.user.token);
    const dispatch = useDispatch();

    const DirectToSignUp = () => {
        setView(1)
    };

    const DirectToLogin = () => {
        setView(0)
    };

    const CreateUser = (uid) => {
      axios.post(`${process.env.REACT_APP_API_URL}/api/auth`, 
        { userID: uid },
        {
          headers: {
            'Content-Type': 'application/json'
          },
          withCredentials: true // Ensure cookies (including access_token) are sent with the request
        }
      )
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.error('Error signing up:', error);
      });
    };
    

  //   // Function to fetch user details by userID
  //   const FetchUser = (userID) => {
  //     axios.get(`http://localhost:5000/api/user/${userID}`)
  //         .then((response) => {
  //             console.log('User details:', response.data);
  //             // Save the user details in Redux
  //             dispatch(setUserDetails(response.data));
              
  //             // Generate JWT token after successful fetching of user details
  //             getIdToken(auth.currentUser) // Pass the current user for the token generation
  //                 .then((token) => {
  //                     console.log('Generated Token:', token);
  //                     // Save the token in Redux
  //                     dispatch(setToken(token));
  //                 })
  //                 .catch((error) => {
  //                     console.error('Error generating token:', error);
  //                 });
  //         })
  //         .catch((error) => {
  //             console.error('Error fetching user details:', error);
  //         });
  // };

  const setUserDetails = (uid) => {
    // Generate JWT token for user with ID uid using Firebase
    getIdToken(auth.currentUser)
        .then((token) => {
            console.log('Generated Token:', token);
            // Decode the JWT token to get authentication details
            const decodedToken = jwtDecode(token);
            console.log('Decoded Token:', decodedToken);
            
            // You can access user details like auth_time, exp, etc.
            console.log('Auth Time:', new Date(decodedToken.auth_time * 1000).toLocaleString());
            console.log('Expiration Time:', new Date(decodedToken.exp * 1000).toLocaleString());
            console.log('User UID:', decodedToken.user_id);

            // Set User ID and Token in Redux

            dispatch(setUserId(uid));
            dispatch(setToken(token));


        })
        .catch((error) => {
            console.error('Error generating token:', error);
        });
};

  return (
    
        (view==0) ?
        <Login DirectToSignUp={DirectToSignUp} CreateUser={(uid) => CreateUser(uid)} setUserDetails={(uid) => setUserDetails(uid)}/>
        :
        <Signup DirectToLogin={DirectToLogin} CreateUser={(uid) => CreateUser(uid)} setUserDetails={setUserDetails} />
    
  )
}
