import jwt from 'jsonwebtoken'

const adminAuth = async (req, res, next) => {
    try {
        // 1. Try cookie first (set by backend directly)
        let token = req.cookies?.token

        // 2. Fallback to Authorization header (sent via Next.js proxy)
        if (!token && req.headers.authorization) {
            token = req.headers.authorization.replace(/^Bearer\s+/i, "").trim()
        }

        if (!token) {
            return res.status(401).json({ message: "Not authorized. Please login as admin." })
        }

        const verifyToken = jwt.verify(token, process.env.JWT_SECRET)

        if (!verifyToken) {
            return res.status(401).json({ message: "Invalid token. Please login again." })
        }

        req.adminEmail = process.env.ADMIN_EMAIL
        next()

    } catch (error) {
        console.log("adminAuth error", error.message)
        return res.status(401).json({ message: `Admin authentication failed: ${error.message}` })
    }
}

export default adminAuth