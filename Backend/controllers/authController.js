const crypto = require("crypto");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const { OAuth2Client } = require("google-auth-library");

const User = require("./../models/userModel");
const VerifyToken = require("./../models/tokenModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const { error } = require("console");

const sendEmail = require("../utils/email");
const sendOtp = require("../utils/otp");
const VerifyOtp = require("../models/otpModel");

//400 = bad request
//401 = unauthorized
//403 = Forbidden
//404 = not found
//422 = can't process your request(unprocessable entity)

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res, message) => {
  const token = signToken(user._id);

  // res.cookie('jwt', token, {
  //   expires: new Data( Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000 ),
  //   secure: true,
  //   httpOnly: true
  // });

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    //secure; true,
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

  res.cookie("jwt", token, cookieOptions);

  user.password = undefined; // remove the password from the output

  res.status(statusCode).json({
    status: "success",
    message: message,
    token,
    data: {
      user,
    },
  });
};

const otpSender = async (res, mobile_number, otp) => {
  try {
    const response = await sendOtp(mobile_number, "student", otp);

    res.status(200).json({
      status: "success",
      message: "OTP sent successfully to your mobile Number",
      verification_id: response,
    });
  } catch (err) {
    // If sending OTP fails, delete the newly created verification record
    if (newMobileVerificationOtp) {
      await newMobileVerificationOtp.deleteOne();
    }

    return next(
      new AppError("There was an error sending the OTP. Try again later.", err),
      500
    );
  }
};

const client = new OAuth2Client(process.env.NEW_GOOGLE_OAUTH_CLIENT_ID);
exports.googleLogin = catchAsync(async (req, res, next) => {
  const { idToken } = req.body;
  // console.log(idToken);

  const response = await client.verifyIdToken({
    idToken,
    audience: process.env.NEW_GOOGLE_OAUTH_CLIENT_ID,
  });
  // console.log('GOOGLE LOGIN RESPONSE',response)
  let { email_verified, name, email } = response.payload;

  console.log("NAME", name);
  console.log("EMAIL", email);
  console.log(email_verified);

  if (email_verified) {
    const user = await User.findOne({ email });
    if (user) {
      console.log("USERID", user._id);

      createSendToken(user, 200, res);
      // const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
      // const { _id, email, name} = user;
      // return res.json({
      //     token,
      //     user: { _id, email, name}
      // });
    } else {
      const password = email + process.env.NEW_GOOGLE_OAUTH_USER_TEMP_PASSWORD;
      const passwordConfirm =
        email + process.env.NEW_GOOGLE_OAUTH_USER_TEMP_PASSWORD;
      console.log("PASSWORD", password);
      console.log("PASSWORD CONFIRM", passwordConfirm);
      console.log("NAME", name);
      console.log("EMAIL", email);

      // user = new User({ name, email, password, passwordConfirm });
      // user.save((err, data) => {
      //   console.log(name, email );
      //   if (err) {
      //     console.log("ERROR GOOGLE LOGIN ON USER SAVE", err);
      //     return res.status(400).json({
      //       error: "User signup failed with google",
      //     });
      //   }
      // });

      const newUser = await User.create({
        name: name,
        email: email,
        password: password,
        passwordConfirm: passwordConfirm,
        verifiedEmail: true,
      });

      createSendToken(newUser, 201, res, "User created and logged in!");

      // user = new User({ name, email, password });
      // user.save((err, data) => {
      //     if (err) {
      //         console.log('ERROR GOOGLE LOGIN ON USER SAVE', err);
      //         return res.status(400).json({
      //             error: 'User signup failed with google'
      //         });
      //     }
      // const token = jwt.sign({ _id: data._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
      // const { _id, email, name} = data;
      // return res.json({
      // token,
      // user: { _id, email, name}
      // });
      // });
    }
  } else {
    return res.status(400).json({
      message: "Google login failed. Try again",
    });
  }
});

exports.emailVerification = catchAsync(async (req, res, next) => {
  // console.log( "Token-userid",req.params.id);
  // console.log(" token ",req.params.token);

  const user = await User.findOne({ _id: req.params.id });
  if (!user)
    return next(
      new AppError("Invalid link or User not exist, Please signup again", 404)
    );

  const emailVerificationToken = await VerifyToken.findOne({
    userId: user._id,
    token: req.params.token,
  });
  // console.log(emailVerificationToken);

  if (!emailVerificationToken) return next(new AppError("Invalid link", 404));

  // await User.updateOne({ _id: user._id, verifiedEmail: true }); //WILL NOT WORK HERE
  const EmailVerificationUpdate = user.EmailVerificationUpdate();
  await user.save({ validateBeforeSave: false });

  await emailVerificationToken.deleteOne();

  // res.status(200).send({ message: "Email verified successfully" });
  res.status(200).json({
    status: "success",
    message: "Email verified successfully",
    // data: {
    //   user,
    // },
  });
  //   try {
  // } catch (error) {
  // 	res.status(500).send({ message: "Internal Server Error" });
  // }
});

exports.sendOtp = catchAsync(async (req, res, next) => {
  // CHECKING USER IS LOGGED IN OR NOT
  const user = await User.findById(req.user.id).select("+password");

  // FETCHING MOBILE NO. FROM THE FRONTEND
  const { mobile_number } = req.body;
  console.log(
    "FRONTEND DATA IS AVAILABLE IN BACKEND LINE NO. 186",
    mobile_number
  );

  // CHECKING MOBILE NO. FEILD IS NOT EMPTY
  if (!mobile_number) {
    return next(new AppError("Please enter mobile_number", 400));
  }

  let newMobileVerificationOtp;

  // CHECKING THE MOBILE NO. IS ALREADY THERE IN DATABASE
  const mobileNumberIsAlreadyAvailable = await User.findOne({mobile_number:  { $eq: mobile_number }});

  if (mobileNumberIsAlreadyAvailable) {
    return next(new AppError("Mobile number must be unique", 400));
  }

  let otp = Math.floor(100000 + Math.random() * 900000);

  // CREATE A DOCUMENT IN VERIFYOTP
  newMobileVerificationOtp = await VerifyOtp.create({
    userId: user._id,
    mobileNumber: mobile_number,
    mobileOtp: otp,
  });

  otpSender(res, mobile_number, otp);

});

// exports.sendOtp = catchAsync(async (req, res, next) => {
//   // CHECKING USER IS LOGGED IN OR NOT
//   const user = await User.findById(req.user.id).select("+password");

//   // FETCHING MOBILE NO. FROM THE FRONTEND
//   const { mobile_number } = req.body;
//   console.log(
//     "FRONTEND DATA IS AVAILABLE IN BACKEND LINE NO. 186",
//     mobile_number
//   );

//   // CHECKING MOBILE NO. FEILD IS NOT EMPTY
//   if (!mobile_number) {
//     return next(new AppError("Please enter mobile_number", 400));
//   }

//   let newMobileVerificationOtp;

//   // CHECKING THE MOBILE NO. IS ALREADY THERE IN USER DATA THEN VERFY THE MOBILE NO.
//   if (user.mobile_number && user.mobile_number == mobile_number) {
//     console.log(
//       "MOBILE NO. IS ALREADY THERE ",
//       user.mobile_number,
//       mobile_number
//     );

//     let otp = Math.floor(100000 + Math.random() * 900000);

//     // CHECKING USER PREVIOUSLY GENERATED OTP OR NOT
//     // const mobileOtpVerify = await VerifyOtp.findOne({
//     //   userId: user._id,
//     // });

//     // // IF DATA IS ALREADY IN VERIFYOTP COLLECTION THEN DELETE
//     // if (mobileOtpVerify) {
//     //   console.log("DELETING VERIFYOTP")
//     //   await mobileOtpVerify.deleteOne();
//     // }
//     // CREATE A DOCUMENT IN VERIFYOTP
//     newMobileVerificationOtp = await VerifyOtp.create({
//       userId: user._id,
//       mobileOtp: otp,
//     });

//     otpSender(res, mobile_number, otp);
//   } else {
//     // NEW MOBILE NUMBER --- CHECKING THE MOBILE NO. IS NOT ALREADY THERE IN USER DATA THEN UPDATE THE MOBILE NO.

//     if (!user.mobile_number) {
//       console.log("mobile number is adding");
//       user.mobile_number = req.body.mobile_number;
//       await user.save({ validateBeforeSave: false });

//       let otp = Math.floor(100000 + Math.random() * 900000);

//       // CREATE A DOCUMENT IN VERIFYOTP
//       newMobileVerificationOtp = await VerifyOtp.create({
//         userId: user._id,
//         mobileOtp: otp,
//       });

//       console.log(
//         "MOBILE NO. IS DIFFERENT OR NOT THERE 262 ",
//         user.mobile_number,
//         mobile_number
//       );
//     }

//     console.log(
//       "MOBILE NO. IS DIFFERENT OR NOT THERE 268",
//       user.mobile_number,
//       mobile_number
//     );

//     // let otp = Math.floor(100000 + Math.random() * 900000);

//     const newMobileVerificationOtp = await VerifyOtp.findOneAndUpdate(
//       {
//         userId: user._id,
//       },
//       { mobileOtp: otp }
//     );

//     console.log("LINE 267", newMobileVerificationOtp);

//     otpSender(res, user.mobile_number, otp);
//   }
// });

exports.VerifyOtp = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");

  if (!user)
    return next(
      new AppError(
        "User not exist, Please create an account by signup or already have an account the login first."
      )
    );

  console.log("VERIFY OTP CONTROLLER 299", req.body.mobileOtp);
  if (!req.body.mobileOtp) {
    return next(new AppError(" OTP field must not be empty", 400));
  }

  const mobileOtpVerify = await VerifyOtp.findOne({
    userId: user._id,
    mobileOtp: req.body.mobileOtp,
  });

  console.log("mobileOtpVerify", mobileOtpVerify);

  if (!mobileOtpVerify)
    return next(new AppError("Invalid OTP or OTP expired ", 404));

  // const user = await User.findById(req.user.id);

  // if (user.mobileOtp !== req.body.mobileOtp) {
  //   return next(
  //     new AppError(
  //       " Wrong OTP ",
  //       400
  //     )
  //   );
  // }

  // user.mobile_number = req.body.mobile_number;
//       await user.save({ validateBeforeSave: false });

  console.log("mobileOtpVerify.mobileNumber",mobileOtpVerify.mobileNumber);

  const mobileVerification = user.mobileVerification(mobileOtpVerify.mobileNumber);
  await user.save({ validateBeforeSave: false });

  await mobileOtpVerify.deleteOne();

  res.status(200).json({
    status: "success",
    message: "Mobile Number verified successfully",
    // data: {
    //   user,
    // },
  });
});

exports.signup = catchAsync(async (req, res, next) => {
  const { name, email, password, passwordConfirm } = req.body;

  if (!name) {
    return next(new AppError("Please enter name fields", 400));
  }
  if (!email) {
    return next(new AppError("Please enter email fields", 400));
  }
  if (!password) {
    return next(new AppError("Please enter password fields", 400));
  }
  if (!passwordConfirm) {
    return next(new AppError("Please enter passwordConfirm fields", 400));
  }

  const existingUser = await User.findOne({ email: req.body.email });
  // if (email === await User.findOne({ email: email})) {
  if (existingUser) {
    return next(new AppError("User with given email already Exist!", 400));
  }

  // const newUser = await User.create(req.body); // In this code anyone can put the "role" as ADMIN, To avoid this we define only particular feild which we will going to accept
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  const newEmailVerificationToken = await VerifyToken.create({
    userId: newUser._id,
    token: crypto.randomBytes(32).toString("hex"),
  });

  const EmailVerificationURL = `http://localhost:3000/users/account-activation/${newUser._id}/${newEmailVerificationToken.token}`;

  let tokenMessage = `New to INSTITUTEHUB?\n Click the url to verify your Email id : ${EmailVerificationURL}. 
  \nIf you didn't creating your account, please ignore this email!`;

  try {
    sendEmail({
      email: newUser.email,
      subject: " Verify Your Email (valid for 10 min) ",
      message: tokenMessage,
    });

    // createSendToken(newUser, 201, res, message);

    res.status(201).json({
      status: "success",
      message: "An Email sent to your account please verify!",
      data: {
        newUser,
      },
    });
  } catch (err) {
    await newEmailVerificationToken.deleteOne();
    // verifyToken.userId = undefined;
    // verifyToken.token = undefined;
    // await verifyToken.save({ validateBeforeSave: false });

    return next(
      new AppError("There was an error sending the email. Try again later."),
      500
    );
  }
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) Check if email and password exist // Check the email and password fields are not empty.
  if (!email || !password) {
    return next(new AppError("Please provide the email and password", 400));
  }
  // 2) Check if user exists and password is correct
  const user = await User.findOne({ email })
    .select("+password")
    .select("+verifiedEmail");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect Email or Password", 401));
  }

  // Check email is verified or not
  console.log("verifiedEmail", user.verifiedEmail);
  if (!user.verifiedEmail) {
    let token = await VerifyToken.findOne({ userId: user._id });

    if (!token) {
      token = await new VerifyToken({
        userId: user._id,
        token: crypto.randomBytes(32).toString("hex"),
      }).save();
    }

    const EmailVerificationURL = `http://localhost:3000/users/account-activation/${user._id}/${token.token}`;

    let tokenMessage = `New to INSTITUTEHUB? Click the url to verify your Email id : ${EmailVerificationURL}. 
  \nIf you didn't creating your account, please ignore this email!`;

    await sendEmail({
      email: user.email,
      subject: " Verify Your Email (valid for 10 min) ",
      message: tokenMessage,
    });

    return res
      .status(400)
      .send({ message: "An Email sent to your account please verify" });
  }

  // if everything is ok , send Token to the client

  createSendToken(user, 200, res);
  // const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
  //   expiresIn: process.env.JWT_EXPIRES_IN,
  // });

  // res.status(200).json({
  //   status: "success",
  //   token
  // });
});

exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check if it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(
      new AppError("You are not logged in, Please login to get access", 401)
    );
    // NOTE: (PLEASE CORRECT) if there is no tour Data then also it will show the above error
  }
  // 2) varification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) Check if user still exists // what if user is deleted in mean time but token is still exist
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError("The user belonging to this token does no longer exist", 401)
    );
  }

  // 4) Check if user changed password after the token was issued // Consider someone stolen ur jwt in order to protect of this you changed your password, so all the token created before the password changed is no longer valid
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError("User recently changed password! Please Login again.", 401)
    );
  }

  // 5) Grant access to protected route
  req.user = currentUser;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // ['student', 'institute-teacher', 'institute-admin', 'admin']
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to perform this action", 403)
      );
    }
    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  if (!req.body.email) {
    return next(new AppError("Email field must not be empty", 400));
  }
  //1) Get user based on POSTed email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError("There is no user with this email address", 404));
  }

  // let resetToken;

  // if (user.createPasswordResetToken() === false ){
  //   return next(new AppError('wait for 2 min to resend the email again', 400));
  // }

  // 2) Generate the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  //// 3) Send it to user's email

  // const resetURL = `${req.protocol}://${req.get(
  //   'host'
  // )}/api/v1/users/resetPassword/${resetToken} `;

  const resetURL = `http://localhost:3000/resetPassword/${resetToken}`;

  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}. 
  \nIf you didn't forget your password, please ignore this email!`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Your password reset token (valid for 10 min)",
      message,
    });

    res.status(200).json({
      status: "success",
      message: "Token sent to email!",
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError("There was an error sending the email. Try again later."),
      500
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  if (!req.body.password || !req.body.passwordConfirm) {
    return next(
      new AppError(
        " Password and Confirm Password field must not be empty",
        400
      )
    );
  }
  // 1) Get user based on the token
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  // console.log("authController", req.params.token, hashedToken);

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  // 2) if token has not expired, and there is user, set the new password
  if (!user) {
    return next(new AppError("Token is invalid or has Expired", 400));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // 3)     changedPasswordAt property for the user

  // 4) Log the user in, send JWT token
  createSendToken(user, 200, res, "Password Updated");
});

// exports.otpVerify = catchAsync(async (req, res, next) => {
//   if (!req.body.mobileNumber) {
//     return next(new AppError("Mobile number field must not be empty", 400));
//   }
// });

// exports.verifyEmail = catchAsync(async (req, res, next) => {
//   if (!req.body.email) {
//     return next(new AppError("Please entre the Email field to verify", 400));
//   }
//   // 1) Check the email is already registered or not
//   const user = await User.findOne({ email: req.body.email });
//   if (user) {
//     return next(new AppError("This email already exists", 400));
//   }

//   const verifyToken = user.createPasswordResetToken();
//   await user.save({ validateBeforeSave: false });
// });

exports.updatePassword = catchAsync(async (req, res, next) => {
  // 1) Get user from collection
  const user = await User.findById(req.user.id).select("+password");

  // 2) Check if POSTed current password is correct
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError("Your current password is incorrect", 401));
  }

  // 3) if so, update password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();

  // 4) Log user in, send JWT TOKEN
  createSendToken(user, 200, res);
});
