import jwt from "jsonwebtoken"

//user authentication middleware

const authUser = async (req,res,next)=>{
    try{

        const token = req.cookies.token;

        if(!token){
            return res.json({success:false,message:"NotAuthorized login again"})
        }

        const token_decode = jwt.verify(token,process.env.JWT_SECRET)

        req.userId = token_decode.id

        next();

    }catch(error){

        console.error(error)
        res.json({success:false,message:error.message})

    }
}

export default authUser