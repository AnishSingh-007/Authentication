import React from 'react'
import SearchResult from './SearchResult'
// import "./SearchResultsList.css";
import classes from "./SearchResultsList.module.css";

const SearchResultsList = ({results}) => {
  return (
    <div className={classes.results_list}>
        {results.map((result, id) => {
            return <SearchResult key={id} result={result} />;
        })}
    </div>
  )
}

export default SearchResultsList