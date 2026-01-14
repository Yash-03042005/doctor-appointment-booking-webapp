import jwt from "jsonwebtoken"

// Admin authentication middleware
const authAdmin = async (req, res, next) => {
  try {
    // ✅ Read token from cookie named 'atoken'
    const atoken = req.cookies.atoken
   
    
    if (!atoken) {
      return res.status(401).json({ success: false, message: "Not authorized, login again" })
    }

    // Verify token
    const decoded = jwt.verify(atoken, process.env.JWT_SECRET)


    // Check if decoded value matches admin credentials
    if (decoded.email !== process.env.ADMIN_EMAIL) {
      return res.status(401).json({ success: false, message: "Not authorized, login again" })
    }

    // If verified, continue
    next()
  } catch (error) {
    console.error("Admin auth error:", error)
    res.status(500).json({ success: false, message: "Server error" })
  }
}

export default authAdmin
