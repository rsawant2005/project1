import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String
    },
    mobile:{
        type:String,
    },
    role:{
        type:String,
        enum:['customer','delivery'],
        default:'customer'
    },

    cartData:{
        type:Object,
        default:{}
    },
    resetOtp: {
    type: String,
    default: null
  },
  otpExpires: {
    type: Date,
    default: null
  },
  isOtpVerified: {
    type: Boolean,
    default: false
  }
},{timestamps:true , minimize:false})

const user = mongoose.model("user",userSchema)
export default user