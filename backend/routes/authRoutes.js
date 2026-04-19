import express from "express"
import { adminlogin, googleLogin, login, logOut, registration, resetPassword, sendOtp, verifyOtp } from "../controller/authController.js"

const authRoutes = express.Router()
authRoutes.post("/register",registration)
authRoutes.post("/login",login)
authRoutes.get("/logout",logOut)
authRoutes.post("/googlelogin",googleLogin)
authRoutes.post("/send-otp",sendOtp)
authRoutes.post("/verify-otp",verifyOtp)
authRoutes.post("/reset-password",resetPassword)
authRoutes.post("/adminlogin",adminlogin) // for admin login

export default authRoutes