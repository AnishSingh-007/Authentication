import React from "react";
import { NavLink, Form, useRouteLoaderData } from "react-router-dom"; //, useNavigate

import logo from "../images/bearded-man-icon.svg";
import playstore from "../images/playstore.svg";
import home from "../images/home.svg";
import mobile from "../images/icons8-phone.svg";
// import searchIcon from "../images/search.svg";

import classes from "./Navbar.module.css";
import Search from "./Search/Search";
// import Categories from "./Categories";
// import { useAuth0 } from "@auth0/auth0-react";

function Navbar() {
  const token = useRouteLoaderData("root");

  // const isAuthenticated = localStorage.getItem("token");
  // const nvigate = useNavigate();
  // const logout = () => {
  //   localStorage.clear();
  //   nvigate("/signup");
  // };

  // const { loginWithRedirect, logout, isAuthenticated, user } = useAuth0();
  return (
    <ul className={classes.container}>
    
      <li className={`${classes.item} ${classes.mainlogo}`}>
      <NavLink to="/" className={classes.homeLink}>
        <img src={logo} alt="logoIcon" className={classes.logo} style={{ height: "40px", margin: "0 5px" }} />
        <h1>Your Logo</h1>
        </NavLink>
      </li>

      <li className={`${classes.item} ${classes.Categories}`}>
        
      </li>

      <li className={classes.item}>
        <Search />
      </li>

      <li className={`${classes.item}`}>
        <NavLink to="#" className={classes.InstituteLink}>
          <p></p>
        </NavLink>
      </li>

      <li className={classes.item}>
        <NavLink
          to="#"
          className={classes.playstoreLink}
        >
          <img
            src={playstore}
            alt="playstoreIcon"
            className={classes.playstore}
          />
        </NavLink>
      </li>

      <li className={classes.item}>

      </li>

      {token && (
        <li className={classes.item}>
          <NavLink to="/mobileverify" className={classes.homeLink}>
            <img src={mobile} alt="HomeIcon" className={classes.home} />
          </NavLink>
        </li>
      )}

      {!token && (
        <li className={classes.item}>
          <NavLink
            to="/auth?mode=login"
            className={`${classes.authButton} ${({ isActive }) =>
              isActive ? classes.active : undefined}`}
            end
          >
            Login
          </NavLink>
        </li>
      )}

      {!token && (
        <li className={classes.item}>
          <NavLink
            to="/auth?mode=signup"
            className={`${classes.authButton} ${({ isActive }) =>
              isActive ? classes.active : undefined}  `}
            end
          >
            Signup
          </NavLink>
        </li>
      )}

      {token && (
        <li className={classes.item}>
          <Form action="/logout" method="post">
            <button className={classes.authButton}>Logout</button>
          </Form>
        </li>
      )}



      {/**/}

      {/* <li className={classes.item}>
        <NavLink to="/login" className={classes.login}>
          Log in
        </NavLink>
      </li> */}

      {/* <li className={classes.item}>
      {
        isAuthenticated && (
          <div >
            <img src={user.picture} alt={user.name} /> */}
      {/*  <h2>{user.name}</h2>  */}
      {/* <p>{user.email}</p>
          </div>
        )
      }
      </li> */}

      {/* {isAuthenticated ? (
        <li className={classes.item}>
          <button className={classes.login}
            onClick={() => logout({ logoutParams: { returnTo: window.location.origin }})} >
            Log Out
          </button>
        </li>
      ) : (
        <li className={classes.item}>
          <button className={classes.signup} onClick={() => loginWithRedirect()}>Log In</button>
        </li>
      )} */}

      {/* <li className={classes.item}>
        <NavLink to="/signup" className={classes.signup}>
          Sign up
        </NavLink>
      </li> */}
    </ul>
  );
}

export default Navbar;

// {isAuthenticated ? (
//   <>
//     <li className={classes.boidata}>
//       <img
//         alt="logo"
//         className={classes.logo}
//         src="https://tse1.mm.bing.net/th?id=OIP.qocnTczJTRMg-ZrYcwS4zAHaHa&pid=Api&P=0&h=180"
//       />
//     {/*  {JSON.parse(isAuthenticated)}  */}
//     </li>
//     <li className={classes.logoutitem}>
//       <NavLink onClick={logout} to="/" className={classes.logout}>
//         Log Out
//       </NavLink>
//     </li>
//   </>
// ) : (
//   <>
//     <li className={classes.item}>
//       <NavLink to="/login" className={classes.login}>
//         Log in
//       </NavLink>
//     </li>
//     <li className={classes.item}>
//       <NavLink to="/signup" className={classes.signup}>
//         Sign up
//       </NavLink>
//     </li>
//   </>
// )}
