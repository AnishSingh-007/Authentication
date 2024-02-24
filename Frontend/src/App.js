// import   Axios from "axios";

import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom"; 

import ErrorPage from "./routes/ErrorPage/Error.js";

// // import Login from "./pages/Login";
// import ForgotAccount from "./pages/ForgotAccount";
// import Signup from "./pages/AshanRegistration/Signup";
// import Login from "./pages/authInMernRegistration/Login.jsx";
// import EmailVerify from "./pages/authInMernRegistration/EmailVerify.jsx";
// import ForgotPassword from "./pages/authInMernRegistration/ForgotPassword.jsx";
// import Signup from './pages/authInMernRegistration/Signup.jsx';

import AuthenticationPage, {action as authAction} from "./pages/authentication/Authentication.js"; //, {action as authAction}
import ForgotPasswordPage, {action as forgotPasswordAction} from "./pages/authentication/ForgotPassword";
import PasswordReset, {action as passwordResetAction} from './pages/authentication/PasswordReset.js';
import {action as logoutAction } from "./pages/authentication/Logout"; //, 
import { checkAuthLoader, tokenLoader } from "./util/auth";
import EmailVerify,{ loader as accountVerificationLoader } from "./pages/authentication/EmailVerify.js";
import MobileVerify, {action as sendOtpAction} from "./pages/authentication/MobileVerify.js";
// import OtpVerification from "./pages/authentication/OtpVerification.js";
import HomePage, {loader as instituteHomeLoader} from "./pages/HomePage";
import ComponentChecker from "./pages/ComponentChecker";

// importing Layout
import AppLayout from "./components/Layout/AppLayout/AppLayout";

// import MockTest from "./routes/Tests/MockTest";

//implementing css
import "./index.css";

import { GoogleOAuthProvider } from '@react-oauth/google';

function App() {       

  const router = createBrowserRouter([
    {
      path: "/",
      element: <AppLayout />,
      // errorElement: <ErrorPage />,
      id: 'root',
      loader: tokenLoader,
      children: [
        {
          index: true,
          element: <HomePage />
        },
        {
          path: 'auth',
          element: <AuthenticationPage />,
          action: authAction
        },
        {
          path: 'users/account-activation/:id/:token/',
          element: <EmailVerify />,
          loader: accountVerificationLoader
        },
        {
          path: 'MobileVerify',
          element: <MobileVerify />,
          action: sendOtpAction
        },
        {
          path: 'forgot-password',
          element: <ForgotPasswordPage />,
          action: forgotPasswordAction
        },
        {
          // path: "password-reset/:resetToken",
          path: "resetPassword/:token",
          element: <PasswordReset />,
          action: passwordResetAction
        },
        {
          path: 'logout',
          action: logoutAction
        },
        {
          path:"componentchecker",
          element: <ComponentChecker />,
        },
      ],
    },

  ]);

  return ( 
    <GoogleOAuthProvider clientId="503062323805-hltkq848u9d8m3kp8led9oeaetribetr.apps.googleusercontent.com">
    <RouterProvider router={router} />
    </GoogleOAuthProvider>
    );
}

export default App;


