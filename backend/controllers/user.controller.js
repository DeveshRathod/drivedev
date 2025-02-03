import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { where } from "sequelize";

export const signin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(404).json({
      message: "Insufficient Information",
    });
  }

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const isMatch = bcrypt.compare(password, process.env.JWT_SECRET);

    if (!isMatch) {
      return res.status(401).json({
        message: "Wrong message",
      });
    }

    const token =
      "Bearer " +
      jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: "30d",
      });

    const userWithoutSensitive = {
      id: user.id,
      email: user.email,
    };

    res.status(200).json({
      message: "User logged in successfully",
      user: userWithoutSensitive,
      token,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server Error",
    });
  }
};

export const signup = async (req, res) => {
  const { email, password, confirmPassword } = req.body;

  if (!email || !password || !confirmPassword) {
    return res.status(400).json({
      message: "Insufficient Information",
    });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({
      message: "Password does not match",
    });
  }

  if (password.length < 8) {
    return res.status(400).json({
      message: "Password must be 8 characters long",
    });
  }

  try {
    const isPresent = await User.findOne({ where: { email } });
    if (isPresent) {
      return res.status(400).json({
        message: "User already present",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 8);
    const user = await User.create({
      email,
      password: hashedPassword,
    });

    const token =
      "Bearer " +
      jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: "30d",
      });

    const userWithoutSensitive = {
      id: user.id,
      email: user.email,
    };

    res.status(201).json({
      message: "User registered successfully",
      user: userWithoutSensitive,
      token,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
    });
  }
};

export const checkMe = async (req, res) => {
  const userID = req.userid;

  try {
    const user = await User.findOne({ where: { id: userID } });

    const userWithoutSensitive = {
      id: user.id,
      email: user.email,
    };

    return res.status(200).json({
      message: "User found",
      user: userWithoutSensitive,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server Error",
    });
  }
};
