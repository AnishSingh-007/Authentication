import React, { useState } from "react";
import { Link } from "react-router-dom";

// import Dropdow from '../components/Dropdow';

import classes from "./Categories.module.css";
import { ExamCategoryHome } from "../../../DummyDatabase";

// import Institute from "../InstituteOverview/Institute";

const Categories = () => {

  // const DropdownMenu = ({ isOpen }) => {
  //   return isOpen ? (
  //     <ul className={classes.DropdownMenu}>
  //       {ExamCategory.map((data, index) => {
  //         return (
  //           <li key={index} className={classes.dropdownItem}>
  //             <Link to="/institutes" >
  //               <img
  //                 src={require(`../images/${data.image}`)}
  //                 alt={data.exam}
  //               />
  //               <span>{data.exam}</span>
  //             </Link>
  //           </li>
  //         );
  //       })}
  //     </ul>
  //   ) : null;
  // };

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleMouseEnter = () => {
    setIsDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    setIsDropdownOpen(false);
  };
         
  return (
    <div
      className={classes.hoverContainer}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <p>Categories</p>
   
      { isDropdownOpen && (
        <ul className={classes.DropdownMenu}>
          {ExamCategoryHome.map((data, index) => {
            return (
              <li key={index} className={classes.dropdownItem}>
                <Link to="/institutes" >
                  <img
                    src={require(`../images/${data.image}`)}
                    alt={data.exam}
                  />
                  <span>{data.exam}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      )
    }
    </div>
  );
};

export default Categories;
