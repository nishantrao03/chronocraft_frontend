// src/utils/authUtils.js

import { getIdToken } from 'firebase/auth'; // Import Firebase auth utilities
import {jwtDecode} from 'jwt-decode'; // Import JWT decode library
// import { setUserId, setToken } from '../redux/user/userSlice'; // Import Redux actions
// import { useDispatch } from 'react-redux'; // Import Redux dispatch
import { auth } from '../firebase';

// Utility function to set user details and generate token
export const SetUserDetails = (uid,dispatch,setUserId,setToken) => {
  //const dispatch = useDispatch(); // Use dispatch to interact with Redux
  getIdToken(auth.currentUser)
    .then((token) => {
      console.log('Generated Token:', token);
      // Decode the JWT token to get authentication details
      const decodedToken = jwtDecode(token);
      console.log('Decoded Token:', decodedToken);

      // Log user details like auth_time, exp, etc.
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
