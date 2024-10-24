// Loading.js
import React from "react";
import styles from "./Loading.module.css";
import { useEffect } from "react";
import axios from "axios"; // Import the CSS module

const Loading = () => {

  useEffect(() => {
    // Function to make an API call to the backend
    const wakeBackend = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/healthcheck`);
        console.log('Backend is awake:', response.status);
      } catch (error) {
        console.error('Error waking up the backend:', error);
      }
    };

    // Call the function to wake up the backend
    wakeBackend();
  }, []); // Empty dependency array ensures this runs only once when the component is mounted

  return (
    <div className={styles.loadingContainer}>
      {/* <div className={styles.logoContainer}>
        <img src="/logo.svg" alt="Logo" className={styles.loadingLogo} />
      </div> */}
      <div className={styles.spinner}></div>
      <p className={styles.loadingText}>Loading, please wait...</p>
    </div>
  );
};

export default Loading;
