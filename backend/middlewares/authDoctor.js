import jwt from "jsonwebtoken"

//doctor authentication middleware

const authUser = async (req,res,next)=>{
    try{

        const dtoken = req.cookies.dtoken

        if(!dtoken){
            return res.json({success:false,message:"NotAuthorized login again"})
        }

        const token_decode = jwt.verify(dtoken,process.env.JWT_SECRET)

        req.docId = token_decode.id

        next()

    }catch(error){

        console.error(error)
        res.json({success:false,message:error.message})

    }
}

export default authUser