import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config()

function middleware(req,res,next){
    try {
        let token = req.headers.authorization?.split(' ')[1];
        if(!token){
            return res.status(401).json({msg : "No token provided"})
        }

        const decode = jwt.verify(token,process.env.JWT_SECRET);
        req.user = decode
        next()
    } catch (error) {
        console.log(error);
        return res.status(401).json({msg : "Token verification failed"})
    }
}

export default middleware