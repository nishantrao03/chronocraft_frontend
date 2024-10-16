// App.js
import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./views/Home/Home";
import Authenticate from "./views/Authenticate";
import MyTasks from "./views/MyTasks/MyTasks";
import { useSelector, useDispatch } from "react-redux";
import { setToken,setUserId } from "./redux/user/userSlice";
import axios from "axios";
import TaskDetails from "./views/TaskDetailsRoute/TaskDetailsRoute";
import Loading from "./components/Loading/Loading";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Get user ID and token from Redux
  const userId = useSelector((state) => state.user.userId);
  const token = useSelector((state) => state.user.token);
  const dispatch = useDispatch();
  //dispatch(setUserId(null));

  // useEffect hook to check for refresh token and validate authentication
    // useEffect hook to check for userId and validate refresh token
    useEffect(() => {
      const checkAuth = async () => {
        if (!userId) {
          // If userId is null, user is not authenticated
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }
  
        try {
          // Step 1: Call the refresh token API
          const response = await axios.post(`${process.env.REACT_APP_API_URL}/refresh-token`, {}, { withCredentials: true });
  
          // Step 2: If the response is successful, set isAuthenticated to true
          if (response.status === 200) {
            console.log("Token refreshed successfully");
            setIsAuthenticated(true);
          } else {
            // If token refresh fails, set authentication to false and reset userId
            setIsAuthenticated(false);
            dispatch(setUserId(null));
          }
        } catch (error) {
          console.error("Error during token refresh:", error);
          setIsAuthenticated(false);
          dispatch(setUserId(null)); // Reset userId to null if token refresh fails
        } finally {
          setIsLoading(false); // Ensure loading state is updated
        }
      };
  
      checkAuth(); // Trigger the authentication check on component mount
    }, [userId, dispatch]); // Runs again if userId changes

  // Function to validate token and authenticate user
  // const authenticated = async () => {
  //   // If userId or token is not available, return false
  //   if (!userId || !token) {
  //     return false;
  //   }

  //   try {
  //     // Call the validate token API
  //     const response = await axios.get("http://localhost:5000/api/validate-token", {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });

  //     console.log(response.status);
  //     if (response.status === 200) {
  //       // Token is valid, return true
  //       return true;
  //     } else {
  //       // Token is invalid, set userId and token to null in Redux and return false
  //       dispatch(setToken(null));
  //     dispatch(setUserId(null));
  //       return false;
  //     }
  //   } catch (error) {
  //     console.error("Token validation failed:", error);
  //     // Token is invalid, set userId and token to null in Redux and return false
  //     dispatch(setToken(null));
  //     dispatch(setUserId(null));
  //     return false;
  //   }
  // };

  // // useEffect to authenticate user on component mount
  // useEffect(() => {
  //   const checkAuth = async () => {
  //     const authStatus = await authenticated();
  //     setIsAuthenticated(authStatus);
  //     setIsLoading(false);
  //   };

  //   checkAuth();
  // }, [userId, token]); // Dependency array to re-check authentication if userId/token changes

  // Loading state handling
  if (isLoading) {
    return <Loading />; // Or a loading spinner
  }

  // Render routes based on authentication status
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={isAuthenticated ? <Home /> : <Authenticate />} />
        <Route exact path="/MyTasks" element={isAuthenticated ? <MyTasks /> : <Authenticate />} />
        <Route exact path="/task/:taskId" element={isAuthenticated ? <TaskDetails /> : <Authenticate />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
