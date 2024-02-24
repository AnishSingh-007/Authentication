import React from "react";
// import "./SearchResult.css";
import classes from "./SearchResult.module.css";

const SearchResult = ({ result }) => {
  return (
    <div
      className={classes.search_result}
      onClick={(e) => alert(`You clicked on \n Name: ${result.institutename}\n Address: ${result.address}\n Pin: ${result.pin}`)}
    >
      {result.institutename}
    </div>
  );
};

export default SearchResult;
