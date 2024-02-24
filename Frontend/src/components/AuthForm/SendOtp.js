import React, { useState, useEffect, useRef } from "react";
import { useSubmit, Form, useActionData } from "react-router-dom";
import OtpVerification from "./OtpVerification";
import editIcon from "../images/edit.png";

import classes from "./SendOtp.module.css";

const SendOtp = ({ initialSeconds = 20 }) => {
  const [mobileNumber, setMobileNumber] = useState("");
  const [editMode, setEditMode] = useState(true);
  const [seconds, setSeconds] = useState(initialSeconds);
  const [startTimer, setStartTimer] = useState(false);
  const timerRef = useRef(null);
  const submit = useSubmit();
  const data = useActionData();

  useEffect(() => {
    if (startTimer && seconds > 0) {
      timerRef.current = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds - 1);
      }, 1000);
    }

    return () => clearInterval(timerRef.current);
  }, [startTimer, seconds]);

  const handleMobileNumberChange = (e) => {
    if (editMode) {
      const enteredMobileNumber = e.target.value.replace(/\D/g, "");
      setMobileNumber(enteredMobileNumber);
    }
  };

  const validateMobileNumber = () => {
    return mobileNumber.length === 10;
  };

  const handleSendOtp = () => {
    
    if (validateMobileNumber()) {
      setEditMode(false);
      clearInterval(timerRef.current);
      setStartTimer(true);
      setSeconds(initialSeconds);

      submit(
        { mobile_number: mobileNumber },
        { method: "post" }
      );
    } 
  };

  const handleEditMobileNumber = () => {
    setEditMode(true);
    setStartTimer(false);
    clearInterval(timerRef.current);
  };

  return (
    <div className={classes.otpContainer}>
      <h2>Mobile OTP Verification</h2>

      <label>
        <p>Enter Mobile Number :</p>

        {((data && data.status === "fail" )|| editMode ) && (
          <input
            className={classes.inputField}
            name="mobile_number"
            type="text"
            placeholder="99999-99999"
            value={mobileNumber}
            onChange={handleMobileNumberChange}
            maxLength={10}
            readOnly={!editMode}
          />
        )}
        {data && data.status !== "fail" && !editMode && (
          <div className={classes.mobileNumber}>
            <p>(+91) {mobileNumber}</p>
            <img src={editIcon} onClick={handleEditMobileNumber} alt="Edit Phone No." />
          </div>
        )}
      </label>

      {((data && data.status === "fail" )|| editMode ) && (
        <button
          className={classes.actionButton}
          onClick={handleSendOtp}
          disabled={!validateMobileNumber()}
        >
          Send OTP
        </button>
      )}

      {data && data.status !== "fail" && !editMode && (
        <div>
          {startTimer && seconds > 0 && (
            <p style={{ fontSize: "11px", color: "darkblue" }}>
              Resend OTP in &nbsp;
              {Math.floor(seconds / 60)}:
              {seconds % 60 < 10 ? `0${seconds % 60}` : seconds % 60}
              &nbsp; minutes
            </p>
          )}

          {startTimer && seconds === 0 && (
            <div className={classes.resendOtp}>
              <button className={classes.actionButton} onClick={handleSendOtp}>
                Resend OTP
              </button>
            </div>
          )}

          <div>
            <label>
              <p>Enter OTP:</p>
              <OtpVerification />
            </label>
          </div>
        </div>
      )}

      {data &&
        data.message &&
        (data.status === "fail" ? (
          <div className={classes.error_msg}>{data.message}</div>
        ) : (
          <div className={classes.success_msg}>{data.message}</div>
        ))}
    </div>
  );
};

export default SendOtp;



// import React, { useState, useEffect, useRef } from "react";
// import { useSubmit, Form, useActionData } from "react-router-dom";
// import OtpVerification from "./OtpVerification";
// import edit from "../images/edit.png";

// import classes from "./SendOtp.module.css";

// const SendOtp = ({ initialSeconds = 20 }) => {
//   const [mobileNumber, setMobileNumber] = useState("");
//   const [editMode, setEditMode] = useState(true);
//   const [seconds, setSeconds] = useState(initialSeconds);
//   const [startTimer, setStartTimer] = useState(false);
//   const timerRef = useRef(null);
//   const submit = useSubmit();

//   const data = useActionData();

//   useEffect(() => {
//     if (startTimer && seconds > 0) {
//       timerRef.current = setInterval(() => {
//         setSeconds((prevSeconds) => prevSeconds - 1);
//       }, 1000);
//     }

//     return () => clearInterval(timerRef.current);
//   }, [startTimer, seconds]);

//   const handleMobileNumberChange = (e) => {
//     if (editMode) {
//       const enteredMobileNumber = e.target.value.replace(/\D/g, "");
//       setMobileNumber(enteredMobileNumber);
//     }
//   };

//   const validateMobileNumber = () => {
//     return mobileNumber.length === 10;
//   };

//   const handleSendOtp = () => {
//     if(data && data.status !== "fail") {
//       { console.log("INSIDE IF BLOCK",data.status);}
//       setEditMode(false);
//       clearInterval(timerRef.current); // Reset the timer
//       setStartTimer(true);
//       setSeconds(initialSeconds); // Reset the seconds to initial value
//     }
//     if (validateMobileNumber() ) {
//       submit(
//         // mobileNumber,
//         { mobile_number: mobileNumber },
//         { method: "post"}
//       );
//       // submit(event.currentTarget, { method: "post" });
//        {data && data.status && console.log("OUTSIDE IF BLOCK",data.status);}


//     } else {
//       // Handle validation error
//     }
//   };

//   const handleEditMobileNumber = () => {
//     // if(data.status !== "fail") {
//     // }
//       setEditMode(true);
//       setStartTimer(false);
//       clearInterval(timerRef.current); // Clear the timer when changing the mobile number
//   };

//   return (
//     <div className={classes.otpContainer}>
//       <h2>Mobile OTP Verification</h2>

      
//         <label>
//           <p>Enter Mobile Number :</p>

//           {editMode && (
//             <input
//               className={classes.inputField}
//               name="mobile_number"
//               type="text"
//               placeholder="99999-99999"
//               value={mobileNumber}
//               onChange={handleMobileNumberChange}
//               maxLength={10}
//               readOnly={!editMode}
//             />
//           )}
//           {!editMode && (
//             <div className={classes.mobileNumber}>
//               <p>(+91) {mobileNumber}</p>
//               <img src={edit} onClick={handleEditMobileNumber} alt="Edit Phone No."/>
//             </div>
//           )}
//         </label>

//         {editMode && (
//           <button
//             className={classes.actionButton}
//             onClick={handleSendOtp}
//             disabled={!validateMobileNumber()}
//             // type="submit"
//           >
//             Send OTP
//           </button>
//         )}
      

//       { !editMode && (
//         <div>
//           {startTimer && seconds > 0 && (
//             <p style={{ fontSize: "11px", color: "darkblue" }}>
//               Resend OTP in &nbsp;
//               {Math.floor(seconds / 60)}:
//               {seconds % 60 < 10 ? `0${seconds % 60}` : seconds % 60}
//               &nbsp; minutes
//             </p>
//           )}

//           {startTimer && seconds === 0 && (
//             <div className={classes.resendOtp}>
//               <p>Resend OTP:</p>
//               <button className={classes.actionButton} onClick={handleSendOtp}>
//                 Resend OTP
//               </button>
//             </div>
//           )}

//           <div >
//             <label>
//               <p>Enter OTP:</p>
//               <OtpVerification />
//             </label>

//             </div>
//             </div>
//             )}
//             {data &&
//               data.message &&
//               (data.status === "fail" ? (
//                 <div className={classes.error_msg}>{data.message}</div>
//               ) : (
//                 <div className={classes.success_msg}>{data.message}</div>
//               ))}
//     </div>
//   );
// };

// export default SendOtp;
