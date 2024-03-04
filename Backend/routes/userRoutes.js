const express = require("express");
const userController = require("./../controllers/userController");
const authController = require("./../controllers/authController");

const router = express.Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);

router.post('/logout', (req, res) => {
  // Clear the authentication cookie
  res.clearCookie('token');
  // Optionally, perform any other cleanup or logging
  res.status(200).json({ message: 'Logged out successfully' });
});


router.get("/account-activation/:id/:token", authController.emailVerification);

router.post("/forgotPassword", authController.forgotPassword);
router.patch("/resetPassword/:token", authController.resetPassword);

// google and facebook
router.post('/google-login', authController.googleLogin);

router.post("/sendOtp", authController.protect, authController.sendOtp);
router.post("/VerifyOtp", authController.protect, authController.VerifyOtp);

router.patch(
  "/updateMyPassword",
  authController.protect,
  authController.updatePassword
);


router.patch("/updateMe", authController.protect, userController.updateMe);
router.delete("/deleteMe", authController.protect, userController.deleteMe);

router
  .route("/")
  .get(authController.protect, userController.getAllUsers)
  .post(userController.createUser);

router
  .route("/:id")
  .get(userController.getUser)
  .patch(
    authController.protect,
    userController.updateUser
    )
  .delete(
    authController.protect,
    // authController.restrictTo("admin", "institute-admin"),
    userController.deleteUser
  );

module.exports = router;
