
import React from "react";
import { FaPlus, FaTrash } from "react-icons/fa";
import {API} from "../../Api";

const api = new API();
 
const CreateBlogEntry = () => {
  const [blocks, setBlocks] = React.useState([]);
  const [author, setAuthor] = React.useState("");
  const [title, setTitle] = React.useState("");
  const [summary, setSummary] = React.useState("");
  const [thumbnail, setThumbnail] = React.useState(null);


const submit = async (formData) => {
  try {
    const res = await api.pushNewEntry(formData);
    if (res.status === "success") {
      alert("Blog post uploaded successfully!");
      // Optionally, reset the form or redirect
    } else {
      alert("Failed to upload blog post.");
    }
  } catch (err) {
    console.error(err);
    alert("An error occurred while uploading the blog post.");
  }
};




  const handleAddBlock = (type) => {
    const newBlock = { type, content: "", id: Date.now() };
    if (type === "code") {
      newBlock.language = "javascript"; // Default language
    }
    setBlocks([...blocks, newBlock]);
  };

  const handleDeleteBlock = (id) => {
    setBlocks(blocks.filter((block) => block.id !== id));
  };

  const handleBlockChange = (id, field, value) => {
    setBlocks(
      blocks.map((block) =>
        block.id === id ? { ...block, [field]: value } : block
      )
    );
  };

  const handleImageUpload = (id, file) => {
    setBlocks(
      blocks.map((block) =>
        block.id === id ? { ...block, file, content: file.name } : block
      )
    );
  };

 const handleSubmit = (e) => {
   e.preventDefault();

   // Validate required fields
   if (!author || !title || !thumbnail || !summary) {
     alert("Please fill in all required fields.");
     return;
   }

   // Build the content array
   const contentArray = blocks.map((block, index) => {
     const { type, content, language, file } = block;
     if (type === "image") {
       const fieldName = `image_${index}`; // Generate a unique field name
       return {
         type,
         content: fieldName, // This will be the field name of the image file
       };
     } else if (type === "code") {
       return {
         type,
         content,
         language,
       };
     } else {
       return {
         type,
         content,
       };
     }
   });

   // Create FormData and append fields
   const formData = new FormData();
   formData.append("author", author);
   formData.append("title", title);
   formData.append("summary", summary);
   formData.append("content", JSON.stringify(contentArray));
   formData.append("thumbnail", thumbnail);

   // Append image files
   blocks.forEach((block, index) => {
     if (block.type === "image" && block.file) {
       const fieldName = `image_${index}`;
       formData.append(fieldName, block.file);
     }
   });

   // Submit the formData
   submit(formData);
 };
  const styles = {
    container: {
      padding: "20px",
      maxWidth: "800px",
      margin: "0 auto",
    },
    input: {
      width: "100%",
      padding: "10px",
      marginBottom: "10px",
      fontSize: "1em",
      boxSizing: "border-box",
    },
    blockContainer: {
      border: "1px solid #ccc",
      padding: "10px",
      marginBottom: "10px",
      position: "relative",
      borderRadius: "4px",
    },
    textarea: {
      width: "100%",
      height: "100px",
      padding: "10px",
      fontSize: "1em",
      boxSizing: "border-box",
    },
    deleteButton: {
      position: "absolute",
      top: "10px",
      right: "10px",
      backgroundColor: "transparent",
      color: "red",
      border: "none",
      cursor: "pointer",
      fontSize: "1.2em",
    },
    addButton: {
      padding: "10px 20px",
      fontSize: "1em",
      cursor: "pointer",
      marginBottom: "20px",
    },
    submitButton: {
      padding: "10px 20px",
      fontSize: "1em",
      cursor: "pointer",
    },
    plusIcon: {
      marginRight: "5px",
    },
    select: {
      width: "100%",
      padding: "10px",
      fontSize: "1em",
      marginBottom: "10px",
    },
  };

  return (
    <div style={styles.container}>
      <h1>Create Blog Entry</h1>
      <form onSubmit={handleSubmit}>
        {/* Author Input */}
        <input
          type="text"
          placeholder="Author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          style={styles.input}
          required
        />
        {/* Title Input */}
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={styles.input}
          required
        />
        {/* Summary Input */}
        <textarea
          placeholder="Summary"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          style={styles.textarea}
          required
        ></textarea>
        {/* Thumbnail Upload */}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setThumbnail(e.target.files[0])}
          style={styles.input}
          required
        />

        {/* Content Blocks */}
        {blocks.map((block) => (
          <div key={block.id} style={styles.blockContainer}>
            <button
              style={styles.deleteButton}
              onClick={() => handleDeleteBlock(block.id)}
              type="button"
            >
              <FaTrash />
            </button>
            {block.type === "image" ? (
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(block.id, e.target.files[0])}
                style={styles.input}
              />
            ) : block.type === "code" ? (
              <>
                <textarea
                  placeholder="Enter code"
                  value={block.content}
                  onChange={(e) =>
                    handleBlockChange(block.id, "content", e.target.value)
                  }
                  style={styles.textarea}
                ></textarea>
                {/* Language Selection */}
                <select
                  value={block.language}
                  onChange={(e) =>
                    handleBlockChange(block.id, "language", e.target.value)
                  }
                  style={styles.select}
                >
                  <option value="javascript">JavaScript</option>
                  <option value="python">Python</option>
                  <option value="c++">C++</option>
                  <option value="go">Go</option>
                  <option value="rust">Rust</option>
                  {/* Add more languages as needed */}
                </select>
              </>
            ) : (
              <textarea
                placeholder={`Enter ${block.type}`}
                value={block.content}
                onChange={(e) =>
                  handleBlockChange(block.id, "content", e.target.value)
                }
                style={styles.textarea}
              ></textarea>
            )}
          </div>
        ))}

        {/* Add Block Section */}
        <div>
          <select id="blockType" style={styles.select}>
            <option value="">Select Block Type</option>
            <option value="header">Header</option>
            <option value="subheader">Subheader</option>
            <option value="paragraph">Paragraph</option>
            <option value="code">Code</option>
            <option value="image">Image</option>
            <option value="iframe video">Video (iframe)</option>
          </select>
          <button
            style={styles.addButton}
            type="button"
            onClick={() => {
              const select = document.getElementById("blockType");
              const type = select.value;
              if (type) {
                handleAddBlock(type);
                select.value = "";
              } else {
                alert("Please select a block type");
              }
            }}
          >
            <FaPlus style={styles.plusIcon} /> Add Block
          </button>
        </div>

        {/* Submit Button */}
        <button style={styles.submitButton} type="submit">
          Submit
        </button>
      </form>
    </div>
  );
};

export default CreateBlogEntry;
