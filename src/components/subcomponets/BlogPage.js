import React, { useState } from "react";
import { Highlight, themes } from "prism-react-renderer";
import { Container, Form, Button, Card } from "react-bootstrap";
import { API } from "../../Api";
import { useParams } from "react-router-dom";
import axios from "axios";

const api = new API();

const BlogPage = () => {
  const { id } = useParams();
  const [blogEntry, setBlogEntry] = useState(null);
  const [newComment, setNewComment] = useState({ author: "", comment: "" });
  const [comments, setComments] = useState([]);
  const [error, setError] = useState("");

  React.useEffect(() => {
    const initFetch = async () => {
      try {
        const entry = await api.getBlogEntry(id);
        setBlogEntry(entry[0]);
        setComments(entry[0].comments || []); // Initialize comments from db
      } catch (error) {
        console.error("Error fetching blog entry:", error);
      }
    };
    initFetch();
  }, [id]);

  if (!blogEntry) {
    return <div>Loading...</div>;
  }

  // Function to render content blocks
  const renderBlock = (block, index) => {
    switch (block.type) {
      case "header":
        return (
          <h2 key={index} className="mt-4">
            {block.content}
          </h2>
        );
      case "subheader":
        return (
          <h3 key={index} className="mt-3">
            {block.content}
          </h3>
        );
      case "paragraph":
        return (
          <div
            key={index}
            className="mt-2"
            dangerouslySetInnerHTML={{ __html: block.content }}
          ></div>
        );
      case "image":
        return (
          <img
            key={index}
            src={`data:image/jpeg;base64,${block.content}`}
            alt=""
            className="img-fluid mt-3"
          />
        );
      case "code":
        return (
          <div key={index} className="mt-3">
            <Highlight
              theme={themes.nightOwl}
              code={block.content}
              language={block.language || "javascript"}
            >
              {({ className, style, tokens, getLineProps, getTokenProps }) => (
                <pre
                  className={className}
                  style={{ ...style, padding: "20px", overflowX: "auto" }}
                >
                  {tokens.map((line, i) => (
                    <div key={i} {...getLineProps({ line, key: i })}>
                      {line.map((token, key) => (
                        <span key={key} {...getTokenProps({ token, key })} />
                      ))}
                    </div>
                  ))}
                </pre>
              )}
            </Highlight>
          </div>
        );
      case "iframe video":
        return (
          <div
            key={index}
            className="embed-responsive embed-responsive-16by9 mt-3"
          >
            <iframe
              src={block.content}
              title={`Video ${index}`}
              frameBorder="0"
              allowFullScreen
              className="embed-responsive-item"
            />
          </div>
        );
      default:
        return null;
    }
  };

  // Function to format date string to "Month Day, Year"
  // Function to format date string to "Month Day, Year"
  const formatDate = (dateString) => {
    const date = new Date(dateString);

    // Check if the date is valid
    if (isNaN(date.getTime())) {
      return "Invalid Date";
    }

    const options = { month: "long", day: "numeric", year: "numeric" };
    return date.toLocaleDateString(undefined, options);
  };

  // Handle adding a new comment
  // Handle adding a new comment
  const handleAddComment = async (e) => {
    e.preventDefault();

    if (!newComment.author || !newComment.comment) {
      setError("Please provide both an author and comment.");
      return;
    }

    // Create a dummy comment to display immediately
    const dummyComment = {
      author: newComment.author,
      comment: newComment.comment,
      date: new Date().toISOString(), // Use current time as a placeholder
    };

    // Add the dummy comment to the list instantly (without indicating it’s a dummy)
    setComments([...comments, dummyComment]);

    try {
      // Send the new comment to the server
      await api.pushComment(id, newComment.comment, newComment.author);

      // If the server returns OK, the dummy comment stays (it represents the real comment)
      // We don’t need to fetch the real comment again.
      // Reset the comment form
      setNewComment({ author: "", comment: "" });
      setError("");
    } catch (error) {
      // If there is an error, remove the dummy comment and show an error message
      setComments((prevComments) =>
        prevComments.filter((comment) => comment !== dummyComment)
      );
      setError("Failed to add comment.");
    }
  };

  // Render comments sorted by date (most recent first)
  const renderComments = () => {
    return comments
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .map((comment, index) => (
        <Card key={index} className="mb-3">
          <Card.Body>
            <Card.Title>{comment.author}</Card.Title>
            <Card.Subtitle className="mb-2 text-muted">
              {formatDate(comment.date)}
            </Card.Subtitle>
            <Card.Text>{comment.comment}</Card.Text>
          </Card.Body>
        </Card>
      ));
  };

  return (
    <Container className="mt-4" style={{ paddingBottom: "50px" }}>
      <h1>{blogEntry.title}</h1>
      <p className="text-muted">
        By {blogEntry.author} | {formatDate(blogEntry.entry_date)}
      </p>
      <hr />
      <div>
        {blogEntry.content.map((block, index) => (
          <div key={index}>{renderBlock(block, index)}</div>
        ))}
      </div>

      {/* Divider between blog content and comment section */}
      <hr className="mt-5 mb-5" />

      {/* Comment Section */}
      <div className="comment-section">
        <h3>Comments</h3>
        {comments.length > 0 ? (
          renderComments()
        ) : (
          <p>No comments yet. Be the first to comment!</p>
        )}

        {/* Add Comment Form */}
        <Form onSubmit={handleAddComment} className="mt-4">
          <Form.Group controlId="formAuthor">
            <Form.Label>Author</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your name"
              value={newComment.author}
              onChange={(e) =>
                setNewComment({ ...newComment, author: e.target.value })
              }
            />
          </Form.Group>
          <Form.Group controlId="formComment">
            <Form.Label>Comment</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Write your comment"
              value={newComment.comment}
              onChange={(e) =>
                setNewComment({ ...newComment, comment: e.target.value })
              }
            />
          </Form.Group>
          {error && <p className="text-danger">{error}</p>}
          <Button variant="primary" type="submit">
            Add Comment
          </Button>
        </Form>
      </div>
    </Container>
  );
};

export default BlogPage;
