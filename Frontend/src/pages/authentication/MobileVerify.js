import React from "react";

import {
  useRouteLoaderData,
  json,
  redirect,
  defer,
  Await,
} from "react-router-dom";

import SendOtp from "../../components/AuthForm/SendOtp";
import { getAuthToken } from "../../util/auth";
import ComponentChecker from "../ComponentChecker";

const MobileVerify = () => {
  return (
    // <ComponentChecker />
    <SendOtp />
  );
};

export default MobileVerify;

 async function actionMobileNo({ authData, authorizationToken }) { 
  console.log("AUTHDATA",authData);
  console.log("AUTHORIZATIONTOKEN",authorizationToken);

  const response = await fetch("http://localhost:8080/api/v1/users/sendOtp", {
    method: "POST",
    headers: {
      Authorization: "Bearer " + authorizationToken,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(authData),
  });
  
  return response;
}

 async function actionOtp({ authData, authorizationToken }) { 
  console.log("AUTHDATA",authData);
  console.log("AUTHORIZATIONTOKEN",authorizationToken);

  const response = await fetch("http://localhost:8080/api/v1/users/VerifyOtp", {
    method: "POST",
    headers: {
      Authorization: "Bearer " + authorizationToken,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(authData),
  });
  return response;
}

export async function action({ request }) {
  let data = await request.formData();
  
  const authorizationToken = getAuthToken();
  // console.log(token);
  if (!authorizationToken) {
    throw json({ message: "You are not authorized to update or add. Please Login to update your mobile number!." },
    { status: 401});
  }

  let response;
  let authData;

  if (data.get("mobileOtp")) {
    console.log("MOBILE NO. IN ACTION LINE NO. 69", data.get("mobileOtp"));
   authData = { mobileOtp: data.get("mobileOtp")};
   console.log("authData 71", authData);
  // response = actionOtp(authData, authorizationToken);
   response = await fetch("http://localhost:8080/api/v1/users/VerifyOtp", {
    method: "POST",
    headers: {
      Authorization: "Bearer " + authorizationToken,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(authData),
  });

} else {
  authData = { mobile_number: data.get("mobile_number")};
  console.log(" mobileOtp hai ACTION LINE NO. 83", authData);
  // response = actionMobileNo(authData, authorizationToken);
   response = await fetch("http://localhost:8080/api/v1/users/sendOtp", {
    method: "POST",
    headers: {
      Authorization: "Bearer " + authorizationToken,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(authData),
  });
  }
  
  if (response.status >= 400 && response.status < 500) {
    // response.status >= 400 && response.status <= 500  // response.status === 422 || response.status === 401
    return response;
  }

  if (!response.ok) {
    // return { isError: true, message: "Could not send OTP." };
    // return response.message;
    // throw json({ message: "Could not send OTP." },{status: 500});
    throw new Response(JSON.stringify({ message: "mobile no. not valid" }), {
      status: 500,
    });
  }

  // return response;
  const resData = await response.json();
  return resData;
}
