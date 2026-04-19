import jwt from 'jsonwebtoken'

const isAuth = async (req, res, next) => {
    try {
        let token = req.cookies.token;

        // Fallback to Authorization header if cookies are not present
        if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(400).json({ message: "user does not have token" })
        }
        
        // Ensure token is a string before calling replace, logging if it isn't
        if (typeof token !== 'string') {
             console.log("Token is not a string:", typeof token, token);
             token = String(token);
        }

        // Sometimes token is stored with quotes from localStorage/cookies, clean it
        token = token.replace(/^"|"$/g, '');
        
        if (token === 'undefined' || token === 'null' || token === '') {
            return res.status(401).json({ message: "user token is missing or malformed string" })
        }

        console.log("Attempting to verify token in isAuth:", token);
        let verifyToken = jwt.verify(token, process.env.JWT_SECRET)

        if (!verifyToken) {
            return res.status(400).json({ message: "user does not have a valid token" })

        }

        req.userId = verifyToken.userId
        next()
    } catch (error) {
        console.log("isAuth error", error)
        return res.status(500).json({message:`isAuth error ${error}`})

    }
}

export default isAuth