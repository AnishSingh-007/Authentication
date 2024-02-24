import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Google from "../components/images/google.svg";
import Facebook from "../components/images/facebook.svg";
import classes from "./Signup.module.css";
import axios from "axios";

import { useGoogleLogin } from '@react-oauth/google';


const Signup = () => {
  const [user, setUser] = useState({
    email: "",
    password: "",
    confirmpassword: "",
  });
  
  
  const navigate = useNavigate()
  const loginGmail = useGoogleLogin({
    onSuccess: async tokenResponse => {
        console.log(tokenResponse)
        //const userInfo = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
        await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
            headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        })
        .then(res => {
          fetchGmailApi(res.data.email, res.data.name)
          // console.log("res.data")
          // console.log(res.data)
          // console.log("res.data.name " + res.data.name)
          // console.log("res.data.email " + res.data.email)
        });
        // console.log("userInfo",userInfo)
        //console.log(userInfo);
    },
    //flow: 'auth-code'
});

const fetchGmailApi = async (email, name) => {
  try {
      let data = {"email": email, 'name': name};
      let url = 'http://192.168.1.29:8080/login-gmail';
      console.log(url);
      console.log(data);
      const response = await fetch(url, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
      });
      if (response.ok) { 
          const jsonData = await response.json();
          console.log('JSON Data:', jsonData);
          if (jsonData.status === 'success') {
              navigate("/", {state: {modelType: "", mobile: "", email: ""}})
          } else {
              alert('somthing went wrong. try again later')
          }
          //sent user to home page
      } else {
          console.log('Response Error:', response.statusText);
      }
  } catch (err) {
      console.log('Error fetching data:');
      console.error(err);
  }
}

  const handleInputs = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const getData = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8080/api/user/register",
        user,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
       
      console.log(response.data);
if (response.status === 200) {
        alert("Registration Successful");
      } else {
        alert("Invalid Registration");
        console.log("Invalid Registration");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred during registration.");
    }
  };


  return (
    <div className={classes.form}>
      <form method="POST">
        <h1>Create a new account</h1>
        <p>Open to the new world of education</p>
        <div className={classes.line}></div>

        <div className={classes.email}>
          <input
            type="text"
            name="email"
            id="email"
            placeholder="Email Address"
            required
            value={user.email}
            onChange={handleInputs}
          />
        </div>
        <div className={classes.password}>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Password"
            required
            value={user.password}
            onChange={handleInputs}
          />
        </div>
        <div className={classes.confirmpass}>
          <input
            type="password"
            name="confirmpassword"
            id="confirmpassword"
            placeholder="Confirm Password"
            required
            value={user.confirmpassword}
            onChange={handleInputs}
          />
        </div>
        <p className={classes.termscondition}>
          By clicking Sign Up, you agree to our Terms, Privacy Policy and
          Cookies Policy. You may receive SMS notifications from us and can opt
          out at any time.
        </p>
        <button type="submit" className={classes.btn1} onClick={getData}>
          <b>Sign up</b>
        </button>
        <div className={classes.login}>
          <Link to="/login">
            <p>Already have an account?</p>
          </Link>
        </div>
        <div className={classes.crossline}>or Log in with</div>
        <div className={classes.btns}>
          <button
            type="button"
            className={classes.btn2}
            onClick={() => loginGmail()}
          >
            <img src={Google} className={classes.google} alt="Google immage" />
            Google
          </button>


          <button
            type="submit"
            className={classes.btn3}
            // onClick={handleFacebookSignup}
          >
            <img
              src={Facebook}
              className={classes.facebook}
              alt="facebook immage"
            />
            Facebook
          </button>
        </div>
      </form>
    </div>
  );
};

export default Signup;