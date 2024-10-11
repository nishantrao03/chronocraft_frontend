// Loading.js
import React from "react";
import styles from "./Loading.module.css"; // Import the CSS module

const Loading = () => {
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
