import mongoose from "mongoose";

const credentialSchema = new mongoose.Schema(
  {
    credentialID: String,
    credentialPublicKey: String,
    counter: Number,
    transports: [String],
    authenticatorAttachment: String,
    credentialDeviceType: String,
    credentialBackedUp: Boolean,
    registeredOrigin: String
  },
  {
    timestamps: true
  }
);

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true
    },

    email: {
      type: String,
      required: true,
      unique: true
    },

    password: {
      type: String,
      required: true
    },

    fidoCredentials: [credentialSchema],

    currentChallenge: String
  },
  {
    timestamps: true
  }
);

const User = mongoose.model("User", userSchema);

export default User;
