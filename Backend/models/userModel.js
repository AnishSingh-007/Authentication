const mongoose = require('mongoose');
const crypto = require('crypto');
const validator = require('validator');
const bcrypt = require('bcrypt')

// SETTING SCHEMA FOR name, email, photo, password, passwordConfirm
const userSchema = new mongoose.Schema({
    name: {
        type: String, 
        required: [true, 'please provide us Your name!']
    },
    email: {
        type: String, 
        required: [true, 'please provide your email address'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email address']
    },
    verifiedEmail: {
        type: Boolean,
        default: false,
        select: false 
    },
    photo: String, 
    role: {
        type: String,
        enum: ['student', 'institute-teacher', 'institute-admin', 'admin'],
        default: 'student'
    },
    password: {
        type: String,
        required: [true, 'please provide a password'],
        minlength: 4,
        select: false
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Please confirm your passwordConfirm'],
        validate: {
            // "this"only works on CREATE & SAVE
            validator: function(el) {
                return el === this.password;
            },
            message: 'Passwords are not same'
        }
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
        type: Boolean,
        default: true,
        select: false
    },
    mobile_number: {
        type: String,
        // unique: true,
        validate: [validator.isMobilePhone, 'Please provide a valid mobile number']
    },
    verifiedMobileNumber: {
        type: Boolean,
        default: false,
        select: true, 
    },
})

// PASSWORD ENCRYPTION MIDDLEWARE
userSchema.pre('save', async function(next) {
    // Run this function Only if password is actually modified
    // Imagine the user updating the email so at that time we dont need to envrypt the password again 
    if (!this.isModified('password')) return next();

    //Hash the password with the cost of 12// encrypted the password // Here 12 is SALT the password before hashing
    this.password = await bcrypt.hash(this.password, 12);

    // Delete passwordConfirm field 
    this.passwordConfirm = undefined;
    next();
});

// ADD PASSWORD CHANGED AT FEILD IN THE COLLECTION
userSchema.pre('save', function(next){
    if(!this.isModified('password')|| this.isNew) return next();

    this.passwordChangedAt= Date.now()- 1000;
    next();
})

// SHOW ONLY USERS WHO ARE ACTIVE --> ELEMINATE ALL THE USERS WHO ARE DEACTIVATED
userSchema.pre(/^find/, function(next){
    // this points to currect query
    this.find({active: {$ne: false}});
    next();
})

// VERIFICATION OF THE PASSWORD DURING LOGIN
userSchema.methods.correctPassword = async function( candidatePassword, userPassord) {
    return await bcrypt.compare(candidatePassword, userPassord);
}

// CHECK TOKEN EXPIRATION AFTER PASSWORD ARE RESET
userSchema.methods.changedPasswordAfter = function(JWTTimeStamp){
    // Compairing JWTTimeStamp with Password set at time of creation
    if(this.passwordChangedAt){
        // Converting passwordChangedAt into time (form) that matched the JWTTimeStamp
        const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
        // console.log(changedTimestamp, JWTTimestamp);
        return JWTTimeStamp < changedTimestamp;
    }
    // False means NOT changed
    return false;
}

// CREATE PASSWORD RESET TOKEN AND PASSWORD EXPIRATION 
userSchema.methods.createPasswordResetToken = function() {

    // if (this.passwordResetExpires >= Date.now() + 8 * 60 * 1000) {
    //     return false;
    // } 
    
    //Generating a random 32 character string in hex code // RANDOM HEXADECIMAL STRING
    const resetToken = crypto.randomBytes(32).toString('hex');

    //Encrypting the resetToken by hashing and converting it in hex code
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    console.log({resetToken}, this.passwordResetToken);

    //resetToken Expires within 10 min 
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000 ;
    // console.log(this.passwordResetExpires.toLocaleString())

    return resetToken;
}

userSchema.methods.EmailVerificationUpdate = function() {
    this.verifiedEmail= true ;
    // User.updateOne({ _id: user._id, verifiedEmail: true });
}

 userSchema.methods.mobileVerification = function(mobileNumber) {
    this.mobile_number = mobileNumber;
    this.verifiedMobileNumber= true ;
 }

//CREATING MODEL FROM USERSCHEMA
const User = mongoose.model('User', userSchema);

module.exports = User;