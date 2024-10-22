// CreateBlogEntry.js
import React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  Container,
  Form,
  Button,
  Alert,
  Spinner,
  ProgressBar,
} from "react-bootstrap";
import { API } from "../../Api";

const api = new API();

const CreateBlogEntry = () => {
  const [title, setTitle] = React.useState("");
  const [summary, setSummary] = React.useState("");
  const [author, setAuthor] = React.useState("");
  const [thumbnailFile, setThumbnailFile] = React.useState(null);
  const [thumbnailName, setThumbnailName] = React.useState("");
  const [contentBlocks, setContentBlocks] = React.useState([]);
  const [showSuccess, setShowSuccess] = React.useState(false);
  const [uploadProgress, setUploadProgress] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");

  // Key for localStorage
  const LOCAL_STORAGE_KEY = "createBlogEntryData";

  // Load data from localStorage on mount
  React.useEffect(() => {
    const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setTitle(parsedData.title || "");
      setSummary(parsedData.summary || "");
      setAuthor(parsedData.author || "");
      setContentBlocks(parsedData.contentBlocks || []);
      setThumbnailName(parsedData.thumbnailName || "");
      alert(
        "Recovered your unsaved blog post data. Please re-upload any images."
      );
    }
  }, []);

  // Auto-save data to localStorage every 10 seconds
  React.useEffect(() => {
    const interval = setInterval(() => {
      // Create a serializable version of contentBlocks
      const serializableContentBlocks = contentBlocks.map((block) => {
        if (block.type === "image" || block.type === "video") {
          return {
            ...block,
            content: null, // Images are handled separately
            placeholder: block.placeholder || "",
          };
        } else {
          return block;
        }
      });

      const dataToSave = {
        title,
        summary,
        author,
        contentBlocks: serializableContentBlocks,
        thumbnailName,
      };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(dataToSave));
      console.log("Auto-saved form data.");
    }, 10000); // 10 seconds in milliseconds

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, [title, summary, author, contentBlocks, thumbnailName]);

  const handleAddContentBlock = (type) => {
    setContentBlocks([
      ...contentBlocks,
      { type, content: "", placeholder: "" },
    ]);
  };

  const handleContentChange = (index, value) => {
    const updatedBlocks = [...contentBlocks];
    updatedBlocks[index].content = value;
    setContentBlocks(updatedBlocks);
  };

  const handleFileChange = (index, file) => {
    const updatedBlocks = [...contentBlocks];
    updatedBlocks[index].content = file;
    updatedBlocks[index].placeholder = file.name;
    setContentBlocks(updatedBlocks);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");
    setUploadProgress(0);

    // Prepare FormData
    const formData = new FormData();
    formData.append("title", title);
    formData.append("summary", summary);
    formData.append("author", author);

    if (thumbnailFile) {
      formData.append("thumbnail", thumbnailFile);
    }

    // Handle content blocks
    const contentData = contentBlocks.map((block, index) => {
      if (block.type === "image" && block.content instanceof File) {
        const fileKey = `content_image_${index}`;
        formData.append(fileKey, block.content);
        return { ...block, content: fileKey };
      } else if (block.type === "code") {
        return { ...block, content: block.content }; // Code as plain text
      } else {
        return block;
      }
    });

    // Append the content data as a JSON string
    formData.append("content", JSON.stringify(contentData));

    try {
      await api.pushNewEntry(formData, (percentCompleted) => {
        setUploadProgress(percentCompleted);
      });

      setShowSuccess(true);
      // Reset form
      setTitle("");
      setSummary("");
      setAuthor("");
      setThumbnailFile(null);
      setThumbnailName("");
      setContentBlocks([]);
      setUploadProgress(0);

      // Clear localStorage
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    } catch (error) {
      console.error("Error creating blog entry:", error);
      setErrorMessage("An error occurred while creating the blog entry.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container className="mt-4">
      <h2>Create Blog Entry</h2>
      {showSuccess && (
        <Alert
          variant="success"
          onClose={() => setShowSuccess(false)}
          dismissible
        >
          Blog entry created successfully!
        </Alert>
      )}
      {errorMessage && (
        <Alert variant="danger" onClose={() => setErrorMessage("")} dismissible>
          {errorMessage}
        </Alert>
      )}
      {isLoading && (
        <div className="text-center my-3">
          <Spinner animation="border" variant="primary" />
          <div>Submitting...</div>
        </div>
      )}
      {uploadProgress > 0 && uploadProgress < 100 && (
        <ProgressBar
          now={uploadProgress}
          label={`${uploadProgress}%`}
          className="my-3"
        />
      )}
      <Form onSubmit={handleSubmit}>
        {/* Title */}
        <Form.Group controlId="formTitle" className="mb-3">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter blog title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </Form.Group>

        {/* Summary */}
        <Form.Group controlId="formSummary" className="mb-3">
          <Form.Label>Summary</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Enter a short summary"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            required
          />
        </Form.Group>

        {/* Author */}
        <Form.Group controlId="formAuthor" className="mb-3">
          <Form.Label>Author</Form.Label>
          <Form.Control
            type="text"
            placeholder="Your name"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
          />
        </Form.Group>

        {/* Thumbnail */}
        <Form.Group controlId="formThumbnail" className="mb-3">
          <Form.Label>Thumbnail Image</Form.Label>
          {thumbnailName && !thumbnailFile && (
            <p>Please re-upload the thumbnail: {thumbnailName}</p>
          )}
          {thumbnailFile && <p>Selected file: {thumbnailFile.name}</p>}
          <Form.Control
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0];
              setThumbnailFile(file);
              setThumbnailName(file.name);
            }}
            required
          />
        </Form.Group>

        {/* Content Blocks */}
        <h4>Content Blocks</h4>
        {contentBlocks.map((block, index) => (
          <div key={index} className="mb-3">
            <Form.Label>
              Block {index + 1} -{" "}
              {block.type.charAt(0).toUpperCase() + block.type.slice(1)}
            </Form.Label>
            {block.type === "paragraph" && (
              <ReactQuill
                theme="snow"
                value={block.content}
                onChange={(value) => handleContentChange(index, value)}
                modules={{
                  toolbar: [
                    [{ header: "1" }, { header: "2" }, { font: [] }],
                    [{ size: [] }],
                    ["bold", "italic", "underline", "strike", "blockquote"],
                    [
                      { list: "ordered" },
                      { list: "bullet" },
                      { indent: "-1" },
                      { indent: "+1" },
                    ],
                    ["link", "image"],
                    ["clean"],
                  ],
                }}
                formats={[
                  "header",
                  "font",
                  "size",
                  "bold",
                  "italic",
                  "underline",
                  "strike",
                  "blockquote",
                  "list",
                  "bullet",
                  "indent",
                  "link",
                  "image",
                ]}
              />
            )}
            {block.type === "header" && (
              <Form.Control
                type="text"
                value={block.content || ""}
                onChange={(e) => handleContentChange(index, e.target.value)}
                required
              />
            )}
            {block.type === "subheader" && (
              <Form.Control
                type="text"
                value={block.content || ""}
                onChange={(e) => handleContentChange(index, e.target.value)}
                required
              />
            )}
            {block.type === "image" && (
              <>
                {block.placeholder && !block.content && (
                  <p>Please re-upload image: {block.placeholder}</p>
                )}
                {block.content instanceof File && (
                  <p>Selected file: {block.content.name}</p>
                )}
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(index, e.target.files[0])}
                  required
                />
              </>
            )}
            {block.type === "code" && (
              <>
                <Form.Control
                  as="textarea"
                  rows={5}
                  placeholder="Enter your code here"
                  value={block.content}
                  onChange={(e) => handleContentChange(index, e.target.value)}
                  required
                />
                <Form.Select
                  className="mt-2"
                  value={block.language || "javascript"}
                  onChange={(e) => {
                    const updatedBlocks = [...contentBlocks];
                    updatedBlocks[index].language = e.target.value;
                    setContentBlocks(updatedBlocks);
                  }}
                >
                  <option value="javascript">JavaScript</option>
                  <option value="python">Python</option>
                  <option value="java">Java</option>
                  <option value="csharp">C#</option>
                  <option value="cpp">C++</option>
                  <option value="ruby">Ruby</option>
                  <option value="go">Go</option>
                  <option value="typescript">TypeScript</option>
                  <option value="php">PHP</option>
                  {/* Add more languages as needed */}
                </Form.Select>
              </>
            )}
          </div>
        ))}

        {/* Add Content Block Buttons */}
        <div className="mb-3">
          <Button
            variant="secondary"
            onClick={() => handleAddContentBlock("paragraph")}
            className="me-2"
          >
            Add Paragraph
          </Button>
          <Button
            variant="secondary"
            onClick={() => handleAddContentBlock("header")}
            className="me-2"
          >
            Add Header
          </Button>
          <Button
            variant="secondary"
            onClick={() => handleAddContentBlock("subheader")}
            className="me-2"
          >
            Add Subheader
          </Button>
          <Button
            variant="secondary"
            onClick={() => handleAddContentBlock("image")}
            className="me-2"
          >
            Add Image
          </Button>
          <Button
            variant="secondary"
            onClick={() => handleAddContentBlock("code")}
            className="me-2"
          >
            Add Code Block
          </Button>
        </div>

        {/* Submit Button */}
        <Button variant="primary" type="submit" disabled={isLoading}>
          Publish
        </Button>
      </Form>
    </Container>
  );
};

export default CreateBlogEntry;
