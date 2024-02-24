import { Fragment } from "react"; //
import { Link, useLoaderData, json } from "react-router-dom"; // useParams,
import success from "../../components/images/success.png";
import styles from "./EmailVerify.module.css";

// import axios from "axios";
// import { Fragment } from "react/cjs/react.production.min";

const EmailVerify = () => {
  // const [validUrl, setValidUrl] = useState(false);
  // const param = useParams();

  const validUrl = useLoaderData();

  // useEffect(() => {
  // 	const verifyEmailUrl = async () => {
  // 		try {
  // 			const url = `http://localhost:8080/api/users/${param.id}/verify/${param.token}`;
  // 			const { data } = await axios.get(url);
  // 			console.log(data);
  // 			setValidUrl(true);
  // 		} catch (error) {
  // 			console.log(error);
  // 			setValidUrl(false);
  // 		}
  // 	};
  // 	verifyEmailUrl();
  // }, [param]);

  return (
    <Fragment>
    { validUrl.status === "success" ? (
    
    <div className={styles.container}>
    <img src={success} alt="success_img" className={styles.success_img} />
    <h1>{validUrl.message}</h1>
    <Link to="/auth?mode=login">
    <button className={styles.green_btn}>Login</button>
    </Link>
    </div>

        ) : (
            <h1>404 Not Found</h1>
            )}
            {/*
        */}
      </Fragment>
  );
};

export default EmailVerify;

export async function loader({ params }) {
  const id = params.id;
  const token = params.token;

  console.log(id);
  console.log(token);
  const url = `http://localhost:8080/api/v1/users/account-activation/${id}/${token}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    // return response;
      throw json(
        { message: "Could not Verify the user" },
        { status: 500 }
      );
  } else {
    return response;
  }
}
