import React from "react";
import {  useSubmit } from "react-router-dom"; // Form, json, redirect, useNavigate,
import { GoogleLogin } from "@react-oauth/google"; //  useGoogleLogin

const GoogleAuth = () => {
  const submit = useSubmit();
  return (
    <>
      <GoogleLogin
        // type="icon"
        theme="filled_black"
        size="medium"
        text="continue_with"
        onSuccess={(credentialResponse) => {
          submit(credentialResponse, { method: "post" });


        }}
        onError={() => {
          console.log("Login Failed");
        }}
      />
    </>
  );
};
export default GoogleAuth;











{/* 

//   import React from "react";
// import { Form, json, redirect, useNavigate, useSubmit } from "react-router-dom"; //
// import { GoogleLogin, useGoogleLogin } from "@react-oauth/google";
// import jwtDecode from "jwt-decode";

// import axios from "axios";

// import classes from "../../components/AuthForm/AuthForm.module.css";

// const GoogleAuth = () => {
//   const navigate = useNavigate();
//   const submit = useSubmit();

//   const login = useGoogleLogin({
//     onSuccess: async (response) => {
//       submit(response , {method: 'post'} )
//       try {
//         const res = await axios.get(
//           "https://www.googleapis.com/oauth2/v3/userinfo",
//           {
//             headers: {
//               Authorization: `Bearer ${response.access_token}`
//             },
//           }
//         );
//         console.log( "RES", res);
//         console.log( "RESPONSE.ACCESS_TOKEN", response.access_token);
//         console.log("response", response);
//       } catch (err) {
//         console.log(err);
//       }
//     },
//   });

//   return (
//     <>

//      <Form action="/auth?mode=login" method="post">
//       </Form> 

//     <button className={classes.green_btn} onClick={() => login()}>
//     Sign in with Google 🚀
//   </button>

//       <GoogleLogin
//         // type="icon"
//         theme="filled_black"
//         size="medium"
//         text="continue_with"
//         onSuccess={(credentialResponse) => {
//           const credentialResponseDecoded = jwtDecode(
//             credentialResponse.credential
//           );

//           submit(credentialResponse, { method: "post" });

//           console.log("credentialResponseDecoded", credentialResponseDecoded);
//           console.log("credentialResponse", credentialResponse);
//           // console.log("credentialResponse.credential", credentialResponse.credential);
//           // console.log("access_token", credentialResponse.access_token);
//         }}
//         onError={() => {
//           console.log("Login Failed");
//         }}
//       />
//     </>
//   );
// };

 
  */}









// import React from 'react'
// import styles from "../../components/AuthForm/AuthForm.module.css";
// import Google from "../../components/images/google.svg";

// import { Link, useNavigate } from "react-router-dom";
// import axios from "axios";

// import { useGoogleLogin } from '@react-oauth/google';

// const GoogleAuth = () => {

//     const navigate = useNavigate();

//     const loginGmail = useGoogleLogin({
//         onSuccess: async tokenResponse => {
//             console.log(tokenResponse);
//             //const userInfo = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
//             await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
//                 headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
//             })
//             .then(res => {
//               fetchGmailApi(res.data.email, res.data.name)
//               // console.log("res.data")
//               // console.log(res.data)
//               // console.log("res.data.name " + res.data.name)
//               // console.log("res.data.email " + res.data.email)
//             });
//             // console.log("userInfo",userInfo)
//             //console.log(userInfo);
//         },
//         //flow: 'auth-code'
//     });

//     const fetchGmailApi = async (email, name) => {
//       try {
//           let data = {"email": email, 'name': name};
//           let url = 'http://localhost:8080/api/v1/users/signup';
//           console.log(url);
//           console.log(data);
//           const response = await fetch(url, {
//               method: 'POST',
//               headers: {
//                   'Content-Type': 'application/json',
//               },
//               body: JSON.stringify(data),
//           });
//           if (response.ok) {
//               const jsonData = await response.json();
//               console.log('JSON Data:', jsonData);
//               if (jsonData.status === 'success') {
//                   navigate("/", {state: {modelType: "", mobile: "", email: ""}})
//               } else {
//                   alert('somthing went wrong. try again later')
//               }
//               //sent user to home page
//           } else {
//               console.log('Response Error:', response.statusText);
//           }
//       } catch (err) {
//           console.log('Error fetching data:');
//           console.error(err);
//       }
//     }

//   return (
//     <>
//     <div className={styles.crossline}>or Log in with</div>
//     <button
//       type="button"
//       className={styles.btn2}
//       onClick={() => loginGmail()}
//     >
//       <img src={Google} className={styles.google} alt="Google immage" />
//       Google
//     </button>
//   </>
//   )
// }

// export default GoogleAuth
