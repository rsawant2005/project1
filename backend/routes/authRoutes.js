import express from "express"
import { adminlogin, googleLogin, login, logOut, registration } from "../controller/authController.js"

const authRoutes = express.Router()
authRoutes.post("/register",registration)
authRoutes.post("/login",login)
authRoutes.get("/logout",logOut)
authRoutes.post("/googlelogin",googleLogin)
authRoutes.post("/adminlogin",adminlogin) // for admin login

export default authRoutes