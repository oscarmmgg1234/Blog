// BlogPage.js
import React from "react";
import { Highlight, themes } from "prism-react-renderer";
import { Container } from "react-bootstrap";
import { API } from "../../Api";
import { useParams } from "react-router-dom";

const api = new API();

const BlogPage = () => {
  const { id } = useParams();
  const [blogEntry, setBlogEntry] = React.useState(null);

  React.useEffect(() => {
    const initFetch = async () => {
      try {
        const entry = await api.getBlogEntry(id);
        setBlogEntry(entry[0]);
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
  const formatDate = (dateString) => {
    const options = { month: "long", day: "numeric", year: "numeric" };
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, options);
  };

  return (
    <Container className="mt-4">
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
    </Container>
  );
};

export default BlogPage;
