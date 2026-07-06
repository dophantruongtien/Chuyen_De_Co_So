import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/User.js";

export const register = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    // Kiểm tra email tồn tại
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "Email already exists"
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo user
    const user = await User.create({
      fullName,
      email,
      password: hashedPassword
    });

    res.status(201).json({
      message: "Register success",
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

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Tìm user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "User not found"
      });
    }

    // So sánh password
    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Wrong password"
      });
    }

    // Tạo JWT token
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
      message: "Login success",
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

export const dashboard = async (req, res) => {
  try { 
    const user = await User.findById(req.user.id).select(
      "-password -currentChallenge -fidoCredentials.credentialPublicKey"
    );

    res.json(user);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};
