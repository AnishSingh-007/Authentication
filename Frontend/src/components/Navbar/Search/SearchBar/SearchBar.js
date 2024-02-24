import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";

// import "./SearchBar.css";

import classes from "./SearchBar.module.css";

const SearchBar = ({setResults}) => {
  const [input, setInput] = useState("");

  const fetchData = (value) => {

    fetch("http://localhost:8080/api/institute")
      .then((response) => response.json())
      .then((json) => {
        const results = json.filter((data) => {
          return (
            (
            value &&
            data &&
            data.institutename &&
            data.institutename.toLowerCase().includes(value.toLowerCase()))
            ||
            (
           data.address &&
           data.address.toLowerCase().includes(value.toLowerCase()))
           ||
         ( data.exams &&
          Array.isArray(data.exams) &&
          data.exams.some(
            (exam) =>
              typeof exam === "string" &&
              exam.toLowerCase().includes(value.toLowerCase())))|| 
           (
           data.pin && 
           data.pin.toString().includes(value)
           )
          );
        });
        setResults(results); 
      });
  };
   

  const handleChange = (value) => {
    setInput(value);
    fetchData(value);
  };

  return (
    <div className={classes.input_wrapper}>
      <FaSearch id={classes.search_icon}/>
      <input
        placeholder="Type to Search..."
        value={input}
        onChange={(e) => handleChange(e.target.value)}
      />
    </div>
  );
};

export default SearchBar;
