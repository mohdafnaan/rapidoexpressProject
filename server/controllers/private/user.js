import express from "express";
import bcrypt from "bcrypt";
const router = express.Router();

import userModel from "../../models/User/User.js";
import riderModel from "../../models/Riders/Riders.js";
import rideModel from "../../models/Rides/Rides.js";

router.get("/user-details", async (req, res) => {
  try {
    let user = req.user;
    let details = await userModel.findOne(
      { email: user.email },
      { fullName: 1, age: 1, _id: 0 }
    );

    res.status(200).json( details );
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: error });
  }
});
router.put("/user-update", async (req, res) => {
  try {
    let user = req.user;
    console.log(user);
    let userInput = req.body;
    await userModel.updateOne(
      { email: user.email },
      { $set: userInput },
      { new: true }
    );

    res.status(200).json({ msg: "user updated sucessfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: error });
  }
});

router.put("/user-updatepass", async (req, res) => {
  try {
    let user = req.user;
    console.log(user);
    let userInput = req.body.password;
    console.log(userInput);
    userInput = await bcrypt.hash(userInput,10)
    await userModel.updateOne({email : user.email},{$set:{password : userInput}})
    res.status(200).json({ msg: "user updated sucessfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: error });
  }
});

router.delete("/user-delete", async (req, res) => {
  try {
    let user = req.user;
    await userModel.updateOne(
      { email: user.email },
      { $set: { isActive: false } },
      { new: true }
    );
    res.status(200).json({ msg: "user deleted sucessfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: error });
  }
});

router.post("/placeorder",async (req,res)=>{
    try {
        let {from,to,distance,vehicleType,paymentMethod,} = req.body;
        let user = await userModel.findOne({email : req.user.email})
        let rider = await riderModel.findOne({vehicleType,isOnline : true})
        let fare = distance * 10
        let ridepayload = {
            userId :user._id,
            riderId : rider._id,
            rideDetails : {
                from,
                to,
                distance,
                vehicleType,
                paymentMethod,
                fare
            }
        }
        await rideModel.insertOne(ridepayload);
        res.status(200).json({msg : "rider assigned"})
    } catch (error) {
        console.log(error);
        res.status(500).json({msg : error})
    }
})
router.get("/user-history",async (req,res)=>{
    try {
        let user =  await userModel.findOne({email : req.user.email})
        let history = await rideModel.find({userId : user._id},{"rideDetails.from" : 1, "rideDetails.to" : 1 , "rideDetails.fare" : 1 })
        res.status(200).json(history)
    } catch (error) {
        console.log(error);
        res.status(500).json({msg : error})
    }
})
export default router