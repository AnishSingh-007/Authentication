import React, { useState } from "react";
import {
  Form,
  Link,
  useSearchParams,
  useActionData,
  useNavigation,
} from "react-router-dom";

import { FaEye, FaEyeSlash } from "react-icons/fa";

import styles from "./AuthForm.module.css";
import GoogleAuth from "../../pages/authentication/GoogleAuth";

const AuthForm = () => {
  const [visible, setVisible] = useState(false);

  const data = useActionData();
  const navigation = useNavigation();

  const [searchParams] = useSearchParams();
  const isLogin = searchParams.get("mode") === "login";

  const isSubmitting = navigation.state === "submitting";

  // const [data, setData] = useState({ email: "", password: "" });
  // const [error, setError] = useState("");

  // const handleChange = ({ currentTarget: input }) => {
  // 	setData({ ...data, [input.name]: input.value });
  // };

  // const handleSubmit = async (e) => {
  // 	e.preventDefault();
  // 	try {

  // 		const url = "http://localhost:8080/api/auth";
  // 		const { data: res } = await axios.post(url, data);
  // 		localStorage.setItem("token", res.data);
  // 		window.location = "/";
  // 	} catch (error) {
  // 		if (
  // 			error.response &&
  // 			error.response.status >= 400 &&
  // 			error.response.status <= 500
  // 		) {
  // 			setError(error.response.data.message);
  // 		}
  // 	}
  // };

  // That email can't be used. Try a different one or sign up with mobile number instead.

  return (
    <div className={styles.login_container}>
      <div className={styles.login_form_container}>
        {!isLogin && (
          <div className={styles.first}>
            <h1>Already have an account ? </h1>

            <Link to={`?mode=login`} className={styles.white_btn}>
              Login
            </Link>
          </div>
        )}

        <div className={`!isLogin ? ${styles.second} : ${styles.first}`}>
          <Form method="post" className={styles.form_container}>
            {/* onSubmit={handleSubmit}*/}
            <h1>
              {isLogin ? "Login to your account" : "Create a new account"}
            </h1>
            <p>
              {isLogin
                ? "Login to your account"
                : "Open to the new world of education"}
            </p>
            {!isLogin && (
              <input
                id="name"
                className={styles.input}
                type="text"
                placeholder="Username"
                name="name"
                required
                // onChange={handleChange}
                // value={data.email}
              />
            )}
            {/*
            <input
            className={styles.input}
            type="text"
            placeholder="Mobile No. or Email"
            name="mobileNoEmail"
            required
            // id="email"
            // onChange={handleChange}
            // value={data.email}
          />
        */}
            <input
              id="email"
              className={styles.input}
              type="email"
              placeholder="Email"
              name="email"
              required
              // onChange={handleChange}
              // value={data.email}
            />
            <div className={`${styles.input} `}>
              <input
                id="password"
                className={styles.passInput}
                // type="password"
                type={visible ? "text" : "password"}
                placeholder="Password"
                name="password"
                required
                // onChange={handleChange}
                // value={data.password}
              />
              <span onClick={() => setVisible(!visible)}>
                {visible ? <FaEye /> : <FaEyeSlash />}
              </span>
            </div>
            {!isLogin && (
              <div className={`${styles.input} `}>
                <input
                  id="passwordConfirm"
                  className={styles.passInput}
                  type={visible ? "text" : "password"}
                  placeholder="Confirm password"
                  name="passwordConfirm"
                  required
                  // onChange={handleChange}
                  // value={data.password}
                />
                <span onClick={() => setVisible(!visible)}>
                  {visible ? <FaEye /> : <FaEyeSlash />}
                </span>
              </div>
            )}
            {isLogin && (
              <Link to="/forgot-password" className={styles.forgotPassword}>
                {" "}
                {/* style={{ alignSelf: "flex-start" }} */}
                <p style={{ padding: "0 15px" }}>Forgot Password ?</p>
              </Link>
            )}
            {/*
          {error && <div className={styles.error_msg}>{error}</div>}
        */}
            {/* 
        {data && data.error && (
          <ul>
            {Object.values(data.error).map((err) => (
              <li key={err}>{err}</li>
            ))}
          </ul>
        )}
        {data && data.error && <p>{data.error.statusCode}</p>}  
      */}
            {data &&
              data.message &&
              (data.status === "fail" ? (
                <div className={styles.error_msg}>{data.message}</div>
              ) : (
                <div className={styles.success_msg}>{data.message}</div>
              ))}

            <button disabled={isSubmitting} className={styles.green_btn}>
              {isSubmitting ? "Submitting..." : "Save"}
            </button>

            {/*
        {data && data.message && (
          <div className={styles.error_msg}>{data.message}</div>
        )}

        <Link to={`?mode=${isLogin ? "signup" : "login"}`} className={styles.green_btn}>
            {isLogin ? "Create new user" : "Already have account" }
            </Link>
          */}
          </Form>

          <div className={styles.crossline}>or Log in with</div>
          <GoogleAuth />
        </div>

        {/*  */}

        {isLogin && (
          <div className={styles.first}>
            <h1>New Here ?</h1>
            <Link to={`?mode=signup`} className={styles.white_btn}>
              Sign up
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthForm;
