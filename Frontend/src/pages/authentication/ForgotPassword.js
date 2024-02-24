import React from "react";
import {
  Form,
  Link,
  // useSearchParams,
  useActionData,
  useNavigation,
} from "react-router-dom";

import styles from "../../components/AuthForm/AuthForm.module.css";

const ForgotPassword = () => {
  const data = useActionData();
  const navigation = useNavigation();

  // const [searchParams] = useSearchParams();
  const isSubmitting = navigation.state === "submitting";
  return (
    <div className={styles.login_container}>
      <div className={styles.login_form_container}>
        <div className={styles.second}>
          <Form method="post" className={styles.second}>

            <h1>Forgot Password</h1>
          
            <input
              className={styles.input}
              type="email"
              placeholder="Email"
              name="email"
              required
            />  

             {/* 
            <Link to="" className={styles.forgotPassword} > 
            <p style={{ padding: "10px", fontSize: "14px" }}>Resend Email ?</p>
            </Link> 
          */}
          {/* style={{ alignSelf: "flex-start" }} */}

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

export default ForgotPassword;

export async function action({ request }) {
  const data = await request.formData();

  let verifyEmail = { email: data.get("email") };

  const response = await fetch(
    "http://localhost:8080/api/v1/users/forgotPassword",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(verifyEmail),
    }
  );

  if (response.status >= 400 && response.status < 500) {
    // response.status >= 400 && response.status <= 500  // response.status === 422 || response.status === 401
    return response;
  }

  if (!response.ok) {
    throw new Response(JSON.stringify({ message: "email not valid" }), {
      status: 500,
    });
  }

  return response;
}
