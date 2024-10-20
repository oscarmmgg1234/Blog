import React from "react";
import  { Highlight,themes } from "prism-react-renderer";

import { API } from "../../Api";
import { useParams } from "react-router-dom";


const api = new API();

const BlogPage = () => {
  const { id } = useParams();
  const [blogEntry, setBlogEntry] = React.useState(null);

  // Fetch the blog entry by ID
  const initFetch = async () => {
    try {
      // Fetch the blog entry using the API
      const entry = await api.getBlogEntry(id);
      setBlogEntry(entry[0]);
    } catch (error) {
      console.error("Error fetching blog entry:", error);
    }
  };

  React.useEffect(() => {
    initFetch();
  }, [id]);

  // Render loading state
  if (!blogEntry) {
    return <div>Loading...</div>;
  }

  // Function to render content blocks
  const renderBlock = (block, index) => {
    switch (block.type) {
      case "header":
        return (
          <h2 key={index} style={styles.header}>
            {block.content}
          </h2>
        );
      case "subheader":
        return (
          <h3 key={index} style={styles.subheader}>
            {block.content}
          </h3>
        );
      case "paragraph":
        return (
          <p key={index} style={styles.paragraph}>
            {block.content}
          </p>
        );
      case "image":
        return (
          <img
            key={index}
            src={`data:image/jpeg;base64,${block.content}`}
            alt=""
            style={styles.image}
          />
        );
      case "code":
        return (
          <div key={index} style={styles.codeBlock}>
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
          <div key={index} style={styles.videoContainer}>
            <iframe
              src={block.content}
              title={`Video ${index}`}
              frameBorder="0"
              allowFullScreen
              style={styles.video}
            />
          </div>
        );
      // Add other cases as needed
      default:
        return null;
    }
  };
  // Function to format date string to "Month Day"
  const formatDate = (dateString) => {
    const options = { month: "long", day: "numeric", year: "numeric" };
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, options);
  };
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>{blogEntry.title}</h1>
      <p style={styles.author}>By {blogEntry.author}</p>
      <p style={styles.time}> {formatDate(blogEntry.entry_date)} </p>
      <hr style={styles.divider} />
      <div style={styles.content}>
        {blogEntry.content.map((block, index) => (
          <div key={index}>
            {renderBlock(block, index)}
            <hr style={styles.divider} />
          </div>
        ))}
      </div>
    </div>
  );
};

// Styles
const styles = {
  container: {
    maxWidth: "800px",
    margin: "0 auto",
    padding: "20px",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  title: {
    fontSize: "2.5em",
    marginBottom: "0.2em",
  },
  time: {
    fontSize: "1em",
    color: "#777",
    marginBottom: "1em",
  },
  author: {
    fontSize: "1em",
    color: "#777",
    marginBottom: "1em",
  },
  divider: {
    margin: "20px 0",
    border: "none",
    borderTop: "1px solid #eee",
  },
  header: {
    fontSize: "2em",
    marginBottom: "0.5em",
  },
  subheader: {
    fontSize: "1.5em",
    marginBottom: "0.5em",
  },
  paragraph: {
    fontSize: "1.1em",
    lineHeight: "1.6",
    marginBottom: "1em",
  },
  image: {
    width: "100%",
    height: "auto",
    marginBottom: "1em",
  },
  codeBlock: {
    marginBottom: "1em",
  },
  videoContainer: {
    position: "relative",
    paddingBottom: "56.25%", // 16:9 aspect ratio
    height: 0,
    overflow: "hidden",
    marginBottom: "1em",
  },
  video: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
  },
};

export default BlogPage;