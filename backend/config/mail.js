import nodemailer from "nodemailer"
import dotenv from "dotenv"

dotenv.config()

export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.APP_PASS
  }
})

export const sendOtpMail = async (to, otp) => {
  try {
    await transporter.sendMail({
      from: `"Surbhi Sweet Mart" <${process.env.EMAIL}>`,
      to,
      subject: "Password Reset OTP",
      html: `
        <div style="font-family:sans-serif">
          <h2>Password Reset</h2>
          <p>Your OTP is:</p>
          <h1>${otp}</h1>
          <p>This OTP is valid for 5 minutes.</p>
        </div>
      `
    })
  } catch (error) {
    console.error("MAIL ERROR:", error)
    throw new Error("Mail not sent")
  }
}


export const sendWelcomeMail = async (to, name) => {
  try {
    await transporter.sendMail({
      from: `"Surbhi Sweet Mart" <${process.env.EMAIL}>`,
      to,
      subject: "Welcome to Surbhi Sweet Mart 🎉",
      html: `
        <div style="font-family:Arial, sans-serif; padding:20px">
          <h2>Welcome ${name || "✨"}!</h2>
          <p>Thank you for signing up at <b>Surbhi Sweet Mart</b>.</p>
          <p>We’re happy to have you with us!</p>
          <p>If you have any questions, just reply to this email.</p>
          <br/>
          <p>Regards,<br/><b>Surbhi Sweet Mart Team</b></p>
        </div>
      `
    })
  } catch (error) {
    console.error("WELCOME MAIL ERROR:", error)
  }
}

export const sendOrderPlacedMail = async (to, name, orderDetails) => {
  try {
    const itemsHtml = orderDetails.items.map(item => 
      `<li>${item.name} (x${item.quantity}) - ₹${item.price * item.quantity}</li>`
    ).join('');

    await transporter.sendMail({
      from: `"Surbhi Sweet Mart" <${process.env.EMAIL}>`,
      to,
      subject: `Order Confirmation - Surbhi Sweet Mart`,
      html: `
        <div style="font-family:Arial, sans-serif; padding:20px">
          <h2>Hi ${name},</h2>
          <p>Thank you for your order!</p>
          <p>We have received your order and are getting it ready for you.</p>
          <h3>Order Details (Total: ₹${orderDetails.total})</h3>
          <ul>
            ${itemsHtml}
          </ul>
          <p><strong>Shipping Address:</strong><br/>
            ${orderDetails.shippingAddress.address}, ${orderDetails.shippingAddress.city}<br/>
            ${orderDetails.shippingAddress.state} - ${orderDetails.shippingAddress.pincode}
          </p>
          <br/>
          <p>Regards,<br/><b>Surbhi Sweet Mart Team</b></p>
        </div>
      `
    })
  } catch (error) {
    console.error("ORDER PLACED MAIL ERROR:", error)
  }
}

export const sendOrderStatusMail = async (to, name, status) => {
  try {
    await transporter.sendMail({
      from: `"Surbhi Sweet Mart" <${process.env.EMAIL}>`,
      to,
      subject: `Order Status Update: ${status.toUpperCase()} - Surbhi Sweet Mart`,
      html: `
        <div style="font-family:Arial, sans-serif; padding:20px">
          <h2>Hi ${name},</h2>
          <p>There is an update regarding your recent order at Surbhi Sweet Mart.</p>
          <p>Your order status is now: <strong>${status.toUpperCase()}</strong></p>
          <p>If you have any questions, feel free to reply to this email.</p>
          <br/>
          <p>Regards,<br/><b>Surbhi Sweet Mart Team</b></p>
        </div>
      `
    })
  } catch (error) {
    console.error("ORDER STATUS MAIL ERROR:", error)
  }
}

