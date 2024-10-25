// Loading.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./Loading.module.css";

const quotes = [
  "If a task can be accomplished in under a minute, initiate it immediately.",
  "Delegate effectively, elevate productivity.",
  "Plan your work, work your plan.",
  "Efficiency is doing things right, effectiveness is doing the right things.",
  "Organization is the backbone of productivity.",
  "Collaborate, innovate, elevate.",
  "You are one task closer to your dreams."
];

const Loading = () => {
  const [quote, setQuote] = useState("");

  useEffect(() => {
    // Wake up the backend
    const wakeBackend = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/healthcheck`);
        console.log('Backend is awake:', response.status);
      } catch (error) {
        console.error('Error waking up the backend:', error);
      }
    };

    wakeBackend();

    // Set a random motivational quote
    let index=Math.floor(Math.random() * quotes.length);
    console.log(index);
    setQuote(quotes[index]);
  }, []);

  return (
    <div className={styles.loadingContainer}>
      <div className={styles.spinner}></div>
      <p className={styles.loadingText}>Loading, please wait... This might take up a minute or two.</p>
      <p className={styles.quote}>{quote}</p>
    </div>
  );
};

export default Loading;
