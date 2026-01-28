import user from "../model/userModel.js";
import validator from "validator";
import bcrypt from "bcryptjs";
import { genToken } from "../config/token.js";

// Registration
export const registration = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const normalizedEmail = email.toLowerCase().trim();

    if (!validator.isEmail(normalizedEmail)) {
      return res.status(400).json({ message: "Enter valid email" });
    }

    if (password.length < 8) {
      return res.status(400).json({ message: "Enter strong password" });
    }

    const existUser = await user.findOne({ email: normalizedEmail });
    if (existUser) return res.status(400).json({ message: "User already exists" });

    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = await user.create({ name, email: normalizedEmail, password: hashPassword });

    const token = genToken(newUser._id);
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({ user: newUser, token });
  } catch (error) {
    console.error("Registration error:", error.message);
    res.status(500).json({ message: `Registration error: ${error.message}` });
  }
};

// Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email.toLowerCase().trim();

    const existingUser = await user.findOne({ email: normalizedEmail });
    if (!existingUser) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch) return res.status(400).json({ message: "Incorrect password" });

    const token = genToken(existingUser._id);
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ user: existingUser, token, message: "Login successful" });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ message: `Login error: ${error.message}` });
  }
};

// Logout
export const logOut = (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error("Logout error:", error.message);
    res.status(500).json({ message: `Logout error: ${error.message}` });
  }
};

// Google Login
export const googleLogin = async (req, res) => {
  try {
    const { name, email } = req.body;
    const normalizedEmail = email.toLowerCase().trim();

    let existingUser = await user.findOne({ email: normalizedEmail });
    if (!existingUser) {
      existingUser = await user.create({ name, email: normalizedEmail });
    }

    const token = genToken(existingUser._id);
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ user: existingUser, token, message: "Google login successful" });
  } catch (error) {
    console.error("Google login error:", error.message);
    res.status(500).json({ message: `Google login error: ${error.message}` });
  }
};




// Admin Login:

export const adminlogin = async (req,res) => {
    try {
        let {email , password} = req.body
        if(email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD){
           let token = await genToken1(email)
           res.cookie("token",token,{
            httpOnly:true,
            secure:false,
            sameSite: "Strict",
            maxAge: 1 * 24 * 60 * 60 * 1000
           }) 
           return res.status(200).json(token)
        }
        return res.status(400).json({message:"Invalid Creadintials"})
    } catch (error) {
        console.log("Admin-Login error")
        return res.status(500).json({message:`Admin-Login error ${error}`})
    }
}