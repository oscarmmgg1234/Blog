import React from "react";
import {
  HashRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
} from "react-router-dom";

import Home from "./components/Home";
import Portfolio from "./components/Portfolio";
import Blog from "./components/Blog";
import BlogPage from "./components/subcomponets/BlogPage";
import CreateBlogEntry from "./components/subcomponets/CreateBlogEntry"; // Import the CreateBlogEntry component
import AdminModal from "./components/AdminModal"; // We'll create this component

function App() {
  const [showAdminModal, setShowAdminModal] = React.useState(false);

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
              <Link to="/blog" style={styles.navLink}>
                Blog
              </Link>
            </li>
          </ul>
          {/* Admin Button */}
          <button
            style={styles.adminButton}
            onClick={() => setShowAdminModal(true)}
          >
            Admin
          </button>
        </nav>

        {/* Admin Modal */}
        {showAdminModal && (
          <AdminModal onClose={() => setShowAdminModal(false)} />
        )}

        {/* Page Content */}
        <div style={styles.content}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:id" element={<BlogPage />} />
            <Route path="/admin" element={<CreateBlogEntry />} />
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
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  navList: {
    listStyleType: "none",
    display: "flex",
    gap: "1em",
    margin: 0,
    padding: 0,
  },
  navItem: {},
  navLink: {
    color: "white",
    textDecoration: "none",
  },
  adminButton: {
    backgroundColor: "#555",
    color: "white",
    border: "none",
    padding: "0.5em 1em",
    cursor: "pointer",
    borderRadius: "4px",
  },
  content: {
    padding: "1em",
  },
};

export default App;
