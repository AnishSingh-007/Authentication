const axios = require("axios");

const sendOtp = async (mobile_number, full_name, otp) => { 
  const dltid = "1307164724922866629";
  const authkey = "335005AJQpl1sUiBM5f5770e8P1";

  //   let otpMessage = `Dear ${full_name}, \nEnter your 6-digit OTP to verify your Mobile No. : ${otp}.
  //   \nIf you didn't requested for this OTP, please ignore this Message!`;


  let otpMessage = `Pinnacle coaching: Dear ${full_name}, This ${otp} for Pinnacle OTP verification.`;

  var otpUrl = `https://control.msg91.com/api/sendotp.php?authkey=${authkey}&mobile=${mobile_number}&message=${otpMessage}&sender=pinncs&otp=${otp}&DLT_TE_ID=${dltid}`;

  // console.log(otpUrl);

    const response = await axios.post(otpUrl)
    // .then((response) => {
    //     console.log(" OTP RESPONSE DATA", response.data);
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
  
      // console.log("OTP RESPONSE DATA", response.data);
      return response.data;

 


// const axios = require('axios');

// const options = {
//   method: 'POST',
//   url: `https://control.msg91.com/api/v5/otp?template_id=Pinnacle%20coaching%3A%20Dear%20%24%7B${full_name}%7D%2C%20This%20%24%7Botp%7D%20for%20Pinnacle%20OTP%20verification&mobile=${mobile_number}&invisible=0&otp=${otp}&otp_length=4`,
//   headers: {
//     accept: 'application/json',
//     'content-type': 'application/json',
//     authkey: '335005AJQpl1sUiBM5f5770e8P1'
//   },
//   data: {Name: 'anish singh', Param2: 'value2', Param3: 'value3'}
// };

// axios
//   .request(options)
//   .then(function (response) {
//     console.log(response.data);
//   })
//   .catch(function (error) {
//     console.error(error);
//   });
  



};

module.exports = sendOtp;




