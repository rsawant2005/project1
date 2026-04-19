import user from "../model/userModel.js";
import validator from "validator";
import bcrypt from "bcryptjs";
import { genToken, genToken1 } from "../config/token.js";
import { sendOtpMail } from "../config/mail.js";
import { sendWelcomeMail } from "../config/mail.js";





// Registration
export const registration = async (req, res) => {
  try {
    const { name, email, password, mobile, role } = req.body;
    const normalizedEmail = email.toLowerCase().trim();

    if (!validator.isEmail(normalizedEmail)) {
      return res.status(400).json({ message: "Enter valid email" });
    }
    if (!mobile) {
      return res.status(400).json({ message: "Enter Mobile No" })
    }

    if (password.length < 8) {
      return res.status(400).json({ message: "Enter strong password" });
    }

    const existUser = await user.findOne({ email: normalizedEmail });
    if (existUser) return res.status(400).json({ message: "User already exists" });

    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = await user.create({ name, email: normalizedEmail, password: hashPassword, mobile, role });

    sendWelcomeMail(newUser.email, newUser.name);

    const token = await genToken(newUser._id);
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "Lax",
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

    const token = await genToken(existingUser._id);
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "Lax",
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
    const { name, email, mobile } = req.body;
    const normalizedEmail = email.toLowerCase().trim();

    let existingUser = await user.findOne({ email: normalizedEmail });
    if (!existingUser) {
      existingUser = await user.create({ name, email: normalizedEmail, mobile: mobile || "" });
    }

    sendWelcomeMail(existingUser.email, existingUser.name);

    const token = await genToken(existingUser._id);
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "Lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ user: existingUser, token, message: "Google login successful" });
  } catch (error) {
    console.error("Google login error:", error.message);
    res.status(500).json({ message: `Google login error: ${error.message}` });
  }
};




// Admin Login:

export const adminlogin = async (req, res) => {
  try {
    let { email, password } = req.body
    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      let token = await genToken1(email)
      res.cookie("token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "Lax",
        maxAge: 1 * 24 * 60 * 60 * 1000
      })
      return res.status(200).json(token)
    }
    return res.status(400).json({ message: "Invalid Creadintials" })
  } catch (error) {
    console.log("Admin-Login error")
    return res.status(500).json({ message: `Admin-Login error ${error}` })
  }
}

export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body

    const User = await user.findOne({ email })
    if (!User) {
      return res.status(400).json({ message: "User not found" })
    }

    const otp = Math.floor(1000 + Math.random() * 9000).toString()

    User.resetOtp = otp
    User.otpExpires = Date.now() + 5 * 60 * 1000 // 5 min
    User.isOtpVerified = false

    await User.save()
    console.log("OTP SAVED:", user.resetOtp)
    await sendOtpMail(email, otp)


    return res.status(200).json({ message: "OTP sent successfully" })
  } catch (error) {
    console.error("SEND OTP ERROR:", error)
    return res.status(500).json({ message: error.message })
  }
}



export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body

    const User = await user.findOne({ email })
    if (!User) {
      return res.status(400).json({ message: "User not found" })
    }

    if (!User.resetOtp || !User.otpExpires) {
      return res.status(400).json({ message: "OTP not requested" })
    }

    if (User.resetOtp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" })
    }

    if (User.otpExpires < Date.now()) {
      return res.status(400).json({ message: "OTP expired" })
    }

    User.isOtpVerified = true
    User.resetOtp = undefined
    User.otpExpires = undefined

    await User.save()
    return res.status(200).json({ message: "OTP verified successfully" })
  } catch (error) {
    return res.status(500).json({ message: `verifyOtp error ${error.message}` })
  }
}


export const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body

    const User = await user.findOne({ email })
    if (!User || !User.isOtpVerified) {
      return res.status(400).json({ message: "OTP verification required" })
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10)

    User.password = hashedPassword
    User.isOtpVerified = false

    await User.save()

    return res.status(200).json({ message: "Password reset successfully" })
  } catch (error) {
    return res.status(500).json({ message: `resetPassword error ${error.message}` })
  }
}

