import { json, redirect } from "react-router-dom";
// import { useParams } from "react-router-dom";
import AuthForm from "../../components/AuthForm/AuthForm";
// import { getAuthToken } from '../util/auth';

function AuthenticationPage() {
  return <AuthForm />;
}

export default AuthenticationPage;

export async function action({ request }) {
  const searchParams = new URL(request.url).searchParams;
  const mode = searchParams.get("mode") || "login";


  if (mode !== "login" && mode !== "signup") {
    throw json({ message: "Unsupported mode.", status: 422 });
    // throw new Error('Unsupported mode.');
    // throw new Response(JSON.stringify({message: 'could not fetch events'}), {status: 500});
  }

  const data = await request.formData();

  let authData;
  let response;
  console.log(data);

  if (data.get("credential")) {   
    authData = {
      idToken: data.get("credential"),
    };

    console.log(authData);

    response = await fetch("http://localhost:8080/api/v1/users/google-login", {
      method: "POST",
      headers: {
        // 'Authorization': 'Bearer ' + token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(authData),
    });

    if (response.status >= 400 && response.status < 500) {
      // response.status >= 400 && response.status <= 500  // response.status === 422 || response.status === 401
      return response;
    }
  
    if (!response.ok) {
      // throw json({message: "Could not authenticate user"}, {status: 500});
      throw new Response(JSON.stringify({ message: "could not fetch events" }), {
        status: 500,
      });
    }
  
  
  
    const resData = await response.json();
    const token = resData.token;
  
    localStorage.setItem("token", token);
    const expiration = new Date();
    expiration.setHours(expiration.getHours() + 24);
    localStorage.setItem("expiration", expiration.toISOString());
  
    return redirect("/");

  } else {

    if (mode !== "login") {
      authData = {
        name: data.get("name"),
        email: data.get("email"),
        password: data.get("password"),
        passwordConfirm: data.get("passwordConfirm"),
      };

      // Perform further actions with authData based on the logic in your application
    response = await fetch("http://localhost:8080/api/v1/users/" + mode, {
      method: "POST",
      headers: {
        // 'Authorization': 'Bearer '+ token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(authData),
    });

    if (response.status >= 400 && response.status < 500) {
      // response.status >= 400 && response.status <= 500  // response.status === 422 || response.status === 401
      return response;
    }
  
    if (!response.ok) {
      // throw json({message: "Could not authenticate user"}, {status: 500});
      throw new Response(JSON.stringify({ message: "could not fetch events" }), {
        status: 500,
      });
    }

    const resData = await response.json();
    return resData;

    } else {
      authData = {
        email: data.get("email"),
        password: data.get("password"),
      };
      
          // Perform further actions with authData based on the logic in your application
          response = await fetch("http://localhost:8080/api/v1/users/" + mode, {
            method: "POST",
            headers: {
              // 'Authorization': 'Bearer '+ token,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(authData),
          });
          
            if (response.status >= 400 && response.status < 500) {
              // response.status >= 400 && response.status <= 500  // response.status === 422 || response.status === 401
              return response;
            }
          
            if (!response.ok) {
              // throw json({message: "Could not authenticate user"}, {status: 500});
              throw new Response(JSON.stringify({ message: "could not fetch events" }), {
                status: 500,
              });
            }
        
            const resData = await response.json();
            console.log(resData);
            const token = resData.token;
          
            localStorage.setItem("token", token);
            const expiration = new Date();
            expiration.setHours(expiration.getHours() + 24);
            localStorage.setItem("expiration", expiration.toISOString());
          
            return redirect("/");
    }
  }
  // if (mode !== "login") {
  // } else {
  //   return json({
  //     message: " Verification Link Send to Your Email Address", status: 200
  //   });
  // }
}