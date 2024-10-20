import React from "react";
import { API } from "../Api.js";
const api = new API();

const Blog = () => {
  const [blogEntries, setBlogEntries] = React.useState([]); 
  async function init () {
    const blogEntries = await api.getBlogEntries();
    setBlogEntries(blogEntries);
  }
  React.useEffect(() => {
    init();
  }, []);

  return (
    <div>
      {
         blogEntries.map((entry) => {
          return (
            <div key={entry.id}>
              <h1>{entry.title}</h1>
              <h1>{entry.author}</h1>
              <h1>{entry.entry_date}</h1>
            </div>
          );
        })
      }
      <h1>Blog</h1>
      <h2>Content goes here...Oscar</h2>
      <p>Welcome to my blog! This is oscarmmgg1234 and this is my blog</p>
    </div>
  );
};

export default Blog;
