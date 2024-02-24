import React from "react";
import {
  Form,
  Link,
  // useSearchParams,
  useActionData,
  useNavigation,
} from "react-router-dom";

import styles from "../../components/AuthForm/AuthForm.module.css";

const PasswordReset = () => {
  const data = useActionData();
  const navigation = useNavigation();

  // const [searchParams] = useSearchParams();
  const isSubmitting = navigation.state === "submitting";
  return (

    <div className={styles.login_container}>
      <div className={styles.login_form_container}>
        <div className={styles.second}>
          <Form method="patch" className={styles.second}>

            <h1>Create New Password</h1>
          
            <input
              id="password"
              className={styles.input}
              type="password"
              placeholder="Password"
              name="password"
              required
              // onChange={handleChange}
              // value={data.password}
            />

            <input
            id="passwordConfirm"
            className={styles.input}
            type="password"
            placeholder="Confirm password"
            name="passwordConfirm"
            required
            // onChange={handleChange}
            // value={data.password}
          />         

            {data &&
              data.message &&
              (data.status === "fail" ? (
                <div className={styles.error_msg}>{data.message}</div>
              ) : (
                <div className={styles.success_msg}>{data.message}</div>
              ))}

            {/* 
          {console.log(data)}
          {data && data.message && ( <div className={styles.success_msg}> {data.message}</div> )}
          {error && <div className={styles.error_msg}>{error}</div>}
          {msg && <div className={styles.success_msg}>{msg}</div>}
        */}

            <button
              disabled={isSubmitting}
              type="submit"
              className={styles.green_btn}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </Form>
        </div>
        <div className={styles.first}>
          <h1>New Here ?</h1>
          <Link to={`/auth?mode=signup`} className={styles.white_btn}>
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PasswordReset;

export async function action({params, request }) {
    // const searchParams = new URL(request.url).searchParams;
    // const token = searchParams.get('token');
    const token = params.token;
    
    // console.log("Action token ", token , request.url);
  
    const data = await request.formData();

  let resetData = { 
    password: data.get("password"),
    passwordConfirm: data.get("passwordConfirm") 
    };

  const response = await fetch(
    "http://localhost:8080/api/v1/users/resetPassword/" + token,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(resetData),
    }
  );

  if (response.status >= 400 && response.status <= 500) {
    // response.status >= 400 && response.status <= 500  // response.status === 422 || response.status === 401
    return response;
  }

  if (!response.ok) {
    throw new Response(JSON.stringify({ message: "password not valid" }), {
      status: 500,
    });
  }

  console.log(response);
  return response;
} 
