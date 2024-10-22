// Blog.js
import React from "react";
import { Link } from "react-router-dom";
import { Card, Container, Row, Col, Form } from "react-bootstrap";
import { API } from "../Api.js";

const api = new API();

const Blog = () => {
  const [blogEntries, setBlogEntries] = React.useState([]);
  const [searchQuery, setSearchQuery] = React.useState("");

  React.useEffect(() => {
    async function init() {
      const entries = await api.getBlogEntries();
      setBlogEntries(entries);
    }
    init();
  }, []);

  // Function to format date string to "Month Day, Year"
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
    <Container>
      {/* Search Bar */}
      <Form.Control
        type="text"
        placeholder="Search..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="my-3"
      />

      {/* Blog Entries */}
      <Row xs={1} md={2} className="g-4">
        {filteredEntries.map((entry) => (
          <Col key={entry.id}>
            <Card className="h-100">
              <Link
                to={`/blog/${entry.id}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <Card.Img
                  variant="top"
                  src={`data:image/jpeg;base64,${entry.thumbnail}`}
                  alt="thumbnail"
                  style={{ height: "200px", objectFit: "cover" }}
                />
                <Card.Body>
                  <Card.Title>{entry.title}</Card.Title>
                  <Card.Text>
                    <small className="text-muted">
                      {formatDate(entry.entry_date)}
                    </small>
                  </Card.Text>
                  <Card.Text>
                    {entry.summary && entry.summary.length > 150
                      ? entry.summary.substr(0, 150) + "..."
                      : entry.summary}
                  </Card.Text>
                </Card.Body>
              </Link>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Blog;
