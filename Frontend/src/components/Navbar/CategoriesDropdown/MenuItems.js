import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

import Dropdown from "./Dropdown";
// import categoriesIcon from "./exam-svgrepo-com.svg";
import './NavbarCategories.css';

// import { ExamCategory } from "../../../DummyDatabase";


const MenuItems = ({ items, depthLevel }) => {
  const [dropdown, setDropdown] = useState(false);

  let ref = useRef();

  useEffect(() => {
    const handler = (event) => {
      if (dropdown && ref.current && !ref.current.contains(event.target)) {
        setDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    document.addEventListener("touchstart", handler);
    return () => {
      // Cleanup the event listener
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("touchstart", handler);
    };
  }, [dropdown]);

  const onMouseEnter = () => {
   setDropdown(true);
  };

  const onMouseLeave = () => {
     setDropdown(false);
  };

  const closeDropdown = () => {
    dropdown && setDropdown(false);
  };

  return (
    <div
      className="menu-items"
      ref={ref}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={closeDropdown}
    >
      {items.url && items.submenu ? (
        <>
          <button
            type="button"
            aria-haspopup="menu"
            aria-expanded={dropdown ? "true" : "false"}
            onClick={() => setDropdown((prev) => !prev)}
          >
            {depthLevel === 0 ? (items.title)
               : (
              <Link to={items.url} >
              <li className="list">
              <img src={require(`../../images/${items.image}`)} alt="categories" />
              {items.title}
              </li>
              </Link>
            )}
            {depthLevel > 0 ? <span>&raquo;</span> : <span className="arrow" />}
          </button>

          <Dropdown
            depthLevel={depthLevel}
            submenus={items.submenu}
            dropdown={dropdown}
          />
        </>
      ) : !items.url && items.submenu ? (
        <>
          <button
            type="button"
            aria-haspopup="menu"
            aria-expanded={dropdown ? "true" : "false"}
            onClick={() => setDropdown((prev) => !prev)}
          >
           <li className="list">
          <img src={require(`../../images/${items.image}`)} alt="categories" />
          {items.title}{" "}
          </li>
            {depthLevel > 0 ? <span>&raquo;</span> : <span className="arrow" />}
          </button>

          <Dropdown
            depthLevel={depthLevel}
            submenus={items.submenu}
            dropdown={dropdown}
          />
        </>
      ) : (
         <Link to={items.url}>
         {/* <Link to="about-exam"> */}
         {/* {ExamCategory.submenu.data && ExamCategory.submenu.data.map((exam, index) => ( */}
        {/* <Link to={`/Show-institutes/${exam.title}`} key={index}> */}
        <li className="list">
        <img src={require(`../../images/${items.image}`)}  alt="categories" />
        {items.title}
        </li>
       </Link>
        //  ))
        //     
      )}
    </div>
  );
};
                          
export default MenuItems;
