import express from "express";
import bcrypt from "bcrypt";
const router = express.Router();

// import rider model
import riderModel from "../../models/Riders/Riders.js";
import rideModel from "../../models/Rides/Rides.js";

router.get("/rider-details", async (req, res) => {
  try {
    let rider = req.user;
    let details = await riderModel.findOne(
      { email: rider.email },
      { _id: 0, fullName: 1, email: 1, phone: 1, vehicleType: 1, vehicleRc: 1 }
    );
    res.status(200).json(details);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: error });
  }
});
router.put("/rider-update", async (req, res) => {
  try {
    let rider = req.user;
    let userInput = req.body;
    await riderModel.updateOne({ email: rider.email }, { $set: userInput });
    res.status(200).json({ msg: "rider updated sucessfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});
router.delete("/rider-delete", async (req, res) => {
  try {
    let rider = req.user;
    await riderModel.updateOne(
      { email: rider.email },
      { $set: { isActive: false } }
    );
    res.status(200).json({ msg: "user deleted sucessfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: error });
  }
});
router.get("/rider-onduty",async(req,res)=>{
    try {
        let rider = req.user;
        await riderModel.updateOne({email : rider.email},{$set:{isOnline:true}})
        res.status(200).json({msg : "you are now on-duty"})
    } catch (error) {
        console.log(error);
        res.status(500).json({msg : error})
    }
})

router.get("/rider-history",async (req,res)=>{
    try {
        let rider =  await riderModel.findOne({email : req.user.email})
        let history = await rideModel.find({riderId : rider._id},{"rideDetails.from" : 1, "rideDetails.to" : 1 , "rideDetails.fare" : 1 })
        res.status(200).json(history)
    } catch (error) {
        console.log(error);
        res.status(500).json({msg : error})
    }
})
export default router;
