import express from "express";
import dotenv from "dotenv";
dotenv.config();

// import database
import "./utils/dbConnect.js"

// import  pulbic  router
import userRouter from "./controllers/public/user.js"
import riderRouter from "./controllers/public/rider.js"

// import middleware from auth
import middleware from "./auth/auth.js"

// import Private userRouter
import privateUserRouter from "./controllers/private/user.js"
import privateRiderRouter from "./controllers/private/rider.js"

const app  = express();
app.use(express.json())
const port  = process.env.PORT

app.get("/",(req,res)=>{
    try {
        res.status(200).json({msg : "server is running"})
    } catch (error) {
        console.log(error);
        res.status(500).json({msg : error})
    }
})
app.use("/public",userRouter)
app.use("/public",riderRouter)
app.use(middleware)
app.use("/private",privateUserRouter)
app.use("/private",privateRiderRouter)
app.listen(port,()=>{
    console.log(`server is running at http://localhost:${port}`);
})