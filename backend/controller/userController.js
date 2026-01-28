import user from "../model/userModel.js"

export const getCurrentUser = async (req,res) => {
    try {
        let User = await user.findById(req.userId).select("-password")
        if (!User) {
            return res.status(404).json({ message: "User is not found" })

        }

        return res.status(201).json(User)

    } catch (error) {
        console.log(error)
        return res.status(500).json({message:`getCurrentUser error ${error}`})
    }
}


// Get Admin: 
export const getAdmin = async (req, res) => {
    try {
        let adminEmail = req.adminEmail;
        if (!adminEmail) {
            return res.status(404).json({ message: "Admin is not found" })

        }
        return res.status(201).json({
            email: adminEmail,
            role: "admin"
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: `getAdmin error ${error}` })
    }
}