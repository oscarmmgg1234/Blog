import React from "react";
import { HashRouter as Router, Routes, Route, Link } from "react-router-dom";

import Home from "./components/Home";
import Portfolio from "./components/Portfolio";
import Blog from "./components/Blog";
//create a about page


function App() {
  return (
    <Router>
      <div>
        {/* Navbar */}
        <nav style={styles.navbar}>
          <ul style={styles.navList}>
            <li style={styles.navItem}>
              <Link to="/" style={styles.navLink}>
                Home
              </Link>
            </li>
            <li style={styles.navItem}>
              <Link to="/portfolio" style={styles.navLink}>
                Portfolio
              </Link>
            </li>
            <li style={styles.navItem}>
              <Link to="/blog" style={styles.navLink}>
                Blog
              </Link>
            </li>
          </ul>
        </nav>

        {/* Page Content */}
        <div style={styles.content}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/blog" element={<Blog />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

// Optional inline styles
const styles = {
  navbar: {
    backgroundColor: "#333",
    padding: "1em",
  },
  navList: {
    listStyleType: "none",
    display: "flex",
    gap: "1em",
  },
  navItem: {},
  navLink: {
    color: "white",
    textDecoration: "none",
  },
  content: {
    padding: "1em",
  },
};

export default App;
