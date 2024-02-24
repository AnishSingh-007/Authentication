import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import classes from "./Login.module.css";


const Login = () => {
   const [email, setEmail] = useState('')
   const [pass, setPass] = useState('')
   const  navigate = useNavigate();

  const handleInputsEmail = (e) => {
    setEmail(e.target.value);
  };

  const handleInputsPass = (e) => {
    setPass(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(email);
    console.log(pass);
    const user = {"email": email, "password": pass};
    console.log(user);
      axios.post(
        "http://localhost:8080/api/user/login",
        user
      ).then(function(response){
   
        console.log(response.status);
        console.log(response.data);
        
          console.log('ok');
          console.log(response.data.email);
          if (response.data.email) {
          localStorage.setItem("user", JSON.stringify(response.data.email));
          navigate("/");
          }

      }).catch(function(error){
        console.error("An error occurred during login:", error);
      })
  };

  return (
    <div className={classes.form}>
      <form method="POST">
        <h1>Log in to InstituteHub</h1>
        <div className={classes.line}></div>
        <div className={classes.inputemail}>
        <input
            type="text"
            name="email"
            id="email"
            placeholder="Email Address"
            required
            value={email}
            onChange={handleInputsEmail}
          />
        </div>
        <div className={classes.inputpassword}>
        <input
            type="password"
            name="password"
            id="password"
            placeholder="Password"
            required
            value={pass}
            onChange={handleInputsPass}
          />
        </div>
        <div className={classes.btn}>
          <button type="submit" onClick={handleSubmit}>Log in</button>
        </div>
        <div className={classes.botumline}>
          <div className={classes.forgotten}>
            <Link to="/forgotaccount">
              <p>Forgotten Account?</p>
            </Link>
          </div>
          <div className={classes.signup}>
            <Link to="/signup">
              <p>Sign up for InstituteHub</p>
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Login;
