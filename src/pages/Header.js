// src/components/Header.js

import React, { useState } from 'react';
import './Header.css';
import logo from '../logo.png';

const Header = () => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <nav className="top-navbar">
      <div className="nav-left">
        <img src={logo} alt="LegalGPT" className="logo-img" />
        <span className="brand-name">LegalGPT</span>
      </div>

      <div className="nav-right">
        <div
          className="nav-toggle"
          onClick={() => setShowMenu((prev) => !prev)}
        >
          ☰
        </div>

        <div className={`nav-links ${showMenu ? 'show' : ''}`}>
          <button>About</button>
          <button>Info</button>
          <button>Contact</button>
        </div>
      </div>
    </nav>
  );
};

export default Header;
