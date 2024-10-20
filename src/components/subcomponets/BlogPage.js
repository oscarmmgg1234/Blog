//db for blog post info and comments
//set up basic blog skeleton for dynamic content
//figure out dymic content for blog like custom graphs and etc

import React from "react";
import { Prism as SyntaxHighlighter } from "prism-react-renderer";
import theme from "prism-react-renderer/themes/nightOwl";
import { API } from "../../api";

const api = new API();

const renderBlock = (block) => {
  //switch statement for diffrent types of blocks
};

const BlogPage = ({ route }) => {
  const [blogskeleton, setBlogskeleton] = React.useState(null);
  //fetch with entry id to get content
  const initFetch = async (id) => {
    //fetch with id
    //{author, title, date,thumbnail, content: [{type: "header" | "paragraph" | "code" | "image" | "subheader" | "iframe video" | graph, data}]}
  };

  React.useEffect(() => {
    initFetch(route.id);
  }, []);
  
  return (
    <div>
      <h1>{route.title}</h1>
      <div>{route.blocks.map((block) => renderBlock(block))}</div>
    </div>
  );
};
