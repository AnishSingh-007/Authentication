const mongoose = require('mongoose');
const Schema = mongoose.Schema; 

const tokenSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "user",
        unique: true,
    },
    token: { type: String, required: true},
    createdAt: { type: Date, default: Date.now(), expires: 10 * 60 * 60 },
})

// module.exports = mongoose.model("VerifyToken", tokenSchema);

const VerifyToken = mongoose.model("VerifyToken", tokenSchema);
module.exports = VerifyToken;


