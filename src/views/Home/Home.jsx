import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import MyNav from '../../components/Navbar/MyNav';
import MyTasks from '../MyTasks/MyTasks';
import "./Home.css";

export default function Home() {
  return (
    <>
    <MyNav />
    <div className="home-container">
      
      <header className="home-header">
        <h1 className="home-title">ChronoCraft</h1>
        <p className="home-description">
          Boost productivity and teamwork with effortless task management and seamless collaboration.
        </p>
        <Link className="home-btn" to="/MyTasks">Get started</Link>
      </header>
    </div>
    </>
  );
}
