import React, { useRef, useState } from "react";
import { useSubmit, Form } from "react-router-dom";

import classes from "./OtpSend.module.css";
import styles from "../../components/AuthForm/SendOtp.module.css";

// const correctOTP = "123456" // fetched from your server

function OtpVerification({ numberOfDigits = 6 }) {
  const submit = useSubmit();

  const [otp, setOtp] = useState(new Array(numberOfDigits).fill(""));
  // const [otpError, setOtpError] = useState(null);
  const otpBoxReference = useRef([]);

  function handleChange(value, index) {
    let newArr = [...otp];
    newArr[index] = value;
    setOtp(newArr);
    console.log(value);
    console.log(newArr);

    if (value && index < numberOfDigits - 1) {
      otpBoxReference.current[index + 1].focus();
    }
  }

  function handleBackspaceAndEnter(e, index) {
    if (e.key === "Backspace" && !e.target.value && index > 0) {
      otpBoxReference.current[index - 1].focus();
    }

    if (
      (e.target.value && index < numberOfDigits - 1) ||
      (e.key === "Enter" && index < numberOfDigits - 1)
    ) {
      otpBoxReference.current[index + 1].focus();
    }
  }

  function handleOnSubmit() {
    const mobileOtp = parseInt(otp.join(""), 10);
    console.log(mobileOtp);
    if (mobileOtp.toString().length === 6) {
      console.log("SENDING OTP VALUE IS ", mobileOtp);
      submit({ mobileOtp }, { action: "/MobileVerify", method: "post" });
    }
  }

  // useEffect(() => {
  //   if(otp.join("") !== "" && otp.join("") !== correctOTP){
  //     setOtpError("❌ Wrong OTP Please Check Again")
  //   }else{
  //     setOtpError(null)
  //   }
  //  }, [otp]);

  return (
    <>
      <div className={` ${classes.otpInputDiv}`}>
        {otp.map((digit, index) => (
          <input
            key={index}
            value={digit}
            name="mobileOtp"
            maxLength={1}
            onChange={(e) => handleChange(e.target.value, index)}
            onKeyUp={(e) => handleBackspaceAndEnter(e, index)}
            ref={(reference) => (otpBoxReference.current[index] = reference)}
            // className={classes.otpInputBox}
            className={styles.input}
          />
        ))}
      </div>
      
      <div className= { ` ${styles.resendOtp} ` }>
      <button className= { ` ${styles.actionButton} ` } onClick={handleOnSubmit}>
        Verify OTP
      </button>
      </div>
      {/*
      <p className="text-base text-white mt-6 mb-4">One Time Password (OTP)</p>
      <p className="text-2xl font-medium text-white mt-12">OTP Input With Validation</p>
        <p className="text-base text-white mt-4 bg-[#323232] p-4 rounded-md">A special type of input box where as user types, it checks if the otp is correct else it shows an error message below with a shake animation.</p>
     <p className={`text-lg text-white mt-4 ${otpError ? 'error-show' : ''}`}>{otpError}</p>
     <Form method="post" >
  </Form>
    */}
    </>
  );
}

export default OtpVerification;
