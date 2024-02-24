import React, {useEffect} from "react";
import { Outlet, useLoaderData, useSubmit } from "react-router-dom";
import Navbar from "../../Navbar/Navbar";

import { getTokenDuration } from "../../../util/auth";

// import classes from "./AppLayout.module.css";

const AppLayout = () => {
  const token = useLoaderData();
  const submit = useSubmit();

  useEffect(() => {
    if (!token) {
      return;
    } 

    if (token === 'EXPIRED') {
      submit(null, {action: '/logout', method: 'post'});
      return;
    }

    const tokenDuration = getTokenDuration();
    console.log(tokenDuration);

    setTimeout(() => {
      submit(null, { action: "/logout", method: "post" });
    }, tokenDuration);
  }, [token, submit]);

  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};

export default AppLayout;
