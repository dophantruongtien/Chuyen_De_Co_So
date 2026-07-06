import jwt from "jsonwebtoken";

import {
  generateRegistrationOptions,
  verifyRegistrationResponse,
  generateAuthenticationOptions,
  verifyAuthenticationResponse
} from "@simplewebauthn/server";

import { isoUint8Array } from "@simplewebauthn/server/helpers";

import User from "../models/User.js";

export const generateRegisterOptions = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    const options = await generateRegistrationOptions({
      rpName: process.env.RP_NAME,
      rpID: process.env.RP_ID,
      userID: isoUint8Array.fromUTF8String(user._id.toString()),
      userName: user.email,
      userDisplayName: user.fullName,
      attestationType: "none",

      authenticatorSelection: {
        residentKey: "preferred",
        userVerification: "required"
      },

      excludeCredentials: user.fidoCredentials.map((cred) => ({
        id: cred.credentialID,
        type: "public-key",
        transports: cred.transports || []
      }))
    });

    user.currentChallenge = options.challenge;
    await user.save();

    res.json(options);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

export const verifyRegister = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    const verification = await verifyRegistrationResponse({
      response: req.body,
      expectedChallenge: user.currentChallenge,
      expectedOrigin: process.env.ORIGIN,
      expectedRPID: process.env.RP_ID,
      requireUserVerification: true
    });

    const { verified, registrationInfo } = verification;

    if (verified && registrationInfo) {
      const { credential, credentialDeviceType, credentialBackedUp } =
        registrationInfo;

      user.fidoCredentials.push({
        credentialID: credential.id,
        credentialPublicKey: Buffer.from(credential.publicKey).toString("base64"),
        counter: credential.counter,
        transports: credential.transports || [],
        authenticatorAttachment: req.body.authenticatorAttachment || "",
        credentialDeviceType: credentialDeviceType || "",
        credentialBackedUp: Boolean(credentialBackedUp),
        registeredOrigin: process.env.ORIGIN || ""
      });

      user.currentChallenge = null;
      await user.save();
    }

    res.json({ verified });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

export const deleteCredential = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const { credentialId } = req.params;

    const credential = user.fidoCredentials.id(credentialId);

    if (!credential) {
      return res.status(404).json({
        message: "Passkey not found"
      });
    }

    credential.deleteOne();
    await user.save();

    res.json({
      message: "Passkey deleted",
      credentialId
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

export const generateLoginOptions = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    if (!user.fidoCredentials || user.fidoCredentials.length === 0) {
      return res.status(400).json({
        message: "User has no passkey"
      });
    }

    const options = await generateAuthenticationOptions({
      rpID: process.env.RP_ID,
      userVerification: "required",

      allowCredentials: user.fidoCredentials.map((cred) => ({
        id: cred.credentialID,
        type: "public-key",
        transports: cred.transports || []
      }))
    });

    user.currentChallenge = options.challenge;
    await user.save();

    res.json(options);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

export const verifyLogin = async (req, res) => {
  try {
    const credentialID = req.body.id;

    const user = await User.findOne({
      "fidoCredentials.credentialID": credentialID
    });

    if (!user) {
      return res.status(404).json({
        message: "Passkey not found"
      });
    }

    const credential = user.fidoCredentials.find(
      (cred) => cred.credentialID === credentialID
    );

    const verification = await verifyAuthenticationResponse({
      response: req.body,
      expectedChallenge: user.currentChallenge,
      expectedOrigin: process.env.ORIGIN,
      expectedRPID: process.env.RP_ID,
      requireUserVerification: true,

      credential: {
        id: credential.credentialID,
        publicKey: Buffer.from(credential.credentialPublicKey, "base64"),
        counter: credential.counter,
        transports: credential.transports || []
      }
    });

    const { verified, authenticationInfo } = verification;

    if (!verified) {
      return res.status(400).json({
        message: "Passkey login failed"
      });
    }

    credential.counter = authenticationInfo.newCounter;
    user.currentChallenge = null;
    await user.save();

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d"
      }
    );

    res.json({
      message: "Passkey login success",
      verified: true,
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};
