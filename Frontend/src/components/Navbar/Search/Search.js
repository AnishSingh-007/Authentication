import React, {useState} from "react";
// import SearchResultsList from "./SearchBar/SearchResultsList";
// import SearchBar from "./SearchBar/SearchBar";

// import "./Search.css";
import  classes  from "./Search.module.css";

const Search = () => {
  const [results, setResults] = useState([]);

  return (
    <>
      <div className={classes.search_bar_container}>
      {/*
        <SearchBar setResults={setResults}/>
        <SearchResultsList results={results}/>
        */}
      </div>
    </>
  );
};


export default Search;