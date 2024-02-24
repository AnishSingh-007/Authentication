const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const otpSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "user",
        // unique: true,
    }, 
    mobileNumber: {type: Number, required: true},
    mobileOtp: {type: Number, required: true},
    createdAt: {type: Date, default: Date.now, expires: 10 * 60 * 60 },
})

const VerifyOtp = mongoose.model("VerifyOtp", otpSchema);
module.exports = VerifyOtp; 