import React from "react";
import { API } from "../Api.js";
import { Link } from "react-router-dom"; // Import Link

const api = new API();

const Blog = () => {
  const [blogEntries, setBlogEntries] = React.useState([]);
  const [searchQuery, setSearchQuery] = React.useState("");

  async function init() {
    const entries = await api.getBlogEntries();
    setBlogEntries(entries);
  }

  React.useEffect(() => {
    init();
  }, []);

  const styles = {
    container: {
      padding: "20px",
      fontFamily: "'Helvetica Neue', Arial, sans-serif",
      backgroundColor: "#f5f5f5",
    },
    searchBar: {
      width: "100%",
      padding: "12px 20px",
      fontSize: "1em",
      marginBottom: "20px",
      boxSizing: "border-box",
      border: "1px solid #ccc",
      borderRadius: "25px",
      outline: "none",
    },
    blogContainer: {
      maxHeight: "80vh",
      overflowY: "auto",
    },
    blogEntry: {
      display: "flex",
      flexDirection: "row",
      borderBottom: "1px solid #e0e0e0",
      padding: "20px 0",
      alignItems: "center",
    },
    entryDetails: {
      flex: 1,
      marginRight: "20px",
    },
    thumbnail: {
      width: "200px",
      height: "200px",
      objectFit: "cover",
      borderRadius: "8px",
    },
    title: {
      fontSize: "1.6em",
      margin: "0 0 5px 0",
      color: "#333",
    },
    entryDate: {
      fontSize: "1em",
      color: "#999",
    },
    summary: {
      width: "50%",
      paddingLeft: "3px",
      marginTop: "10px",
      fontSize: "0.9em",
      color: "#666",
    },
  };

  // Function to format date string to "Month Day"
  const formatDate = (dateString) => {
    const options = { month: "long", day: "numeric", year: "numeric" };
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, options);
  };

  // Filter blog entries based on the search query
  const filteredEntries = blogEntries.filter((entry) =>
    entry.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={styles.container}>
      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={styles.searchBar}
      />

      {/* Blog Entries Container */}
      <div style={styles.blogContainer}>
        {filteredEntries.map((entry) => (
          <Link
            to={`/blog/${entry.id}`}
            key={entry.id}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <div style={styles.blogEntry}>
              {/* Entry Details */}
              <div style={styles.entryDetails}>
                <h2 style={styles.title}>{entry.title}</h2>
                <div style={styles.entryDate}>{formatDate(entry.entry_date)}</div>
                <div style={styles.summary}>
                  {entry.summary
                    ? entry.summary.length > 350
                      ? entry.summary.substr(0, 350)
                      : entry.summary
                    : ""}
                </div>
              </div>

              {/* Thumbnail Image */}
              <img
                src={`data:image/jpeg;base64,${entry.thumbnail}`}
                alt="thumbnail"
                style={styles.thumbnail}
              />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Blog;
