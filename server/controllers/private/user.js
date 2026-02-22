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

    res.status(200).json(details);
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
    userInput = await bcrypt.hash(userInput, 10);
    await userModel.updateOne(
      { email: user.email },
      { $set: { password: userInput } }
    );
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

router.post("/placeorder", async (req, res) => {
  try {
    const { from, to, distance, vehicleType, paymentMethod } = req.body;
    console.log("Booking request received:", { from, to, distance, vehicleType, paymentMethod });
    
    const user = await userModel.findOne({ email: req.user.email });
    if (!user) {
      console.error("User not found:", req.user.email);
      return res.status(404).json({ msg: "User account not found" });
    }

    // Direct match for vehicleType and online status
    const rider = await riderModel.findOne({ vehicleType, isOnline: true });
    
    if (!rider) {
      console.warn("No available riders found for:", vehicleType);
      return res.status(404).json({ msg: `No available captains for ${vehicleType}` });
    }

    const fare = Math.max(1, distance) * 10;
    const ridepayload = {
      userId: user._id,
      riderId: rider._id,
      rideDetails: {
        from,
        to,
        distance: Math.max(1, distance),
        vehicleType,
        PaymentMethod: paymentMethod || "cash",
        fare
      },
    };

    console.log("Creating ride with payload:", ridepayload);
    const newRide = await rideModel.create(ridepayload);
    
    res.status(200).json({ 
      msg: "Rider assigned successfully", 
      fare,
      rideId: newRide._id,
      otp: newRide.otp,
      rider: {
        fullName: rider.fullName,
        phone: rider.phone,
        vehicleRc: rider.vehicleRc,
        vehicleType: rider.vehicleType
      }
    });
  } catch (error) {
    console.error("Placeorder Error:", error);
    res.status(500).json({ msg: "Internal server error during booking", error: error.message });
  }
});

router.get("/active-ride", async (req, res) => {
  try {
    const user = await userModel.findOne({ email: req.user.email });
    const ride = await rideModel.findOne({ 
      userId: user._id, 
      status: { $in: ["pending", "accepted", "ongoing"] } 
    }).sort({ createdAt: -1 });

    if (!ride) return res.status(200).json(null);

    const rider = await riderModel.findById(ride.riderId, { 
      fullName: 1, phone: 1, vehicleRc: 1, vehicleType: 1 
    });

    res.status(200).json({ ...ride.toObject(), rider });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

router.put("/cancel-ride", async (req, res) => {
    try {
        const { rideId } = req.body;
        await rideModel.findByIdAndUpdate(rideId, { status: "cancelled" });
        res.status(200).json({ msg: "Ride cancelled" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
});

router.get("/user-history", async (req, res) => {
  try {
    let user = await userModel.findOne({ email: req.user.email });
    let history = await rideModel.find(
      { userId: user._id },
      { "rideDetails.from": 1, "rideDetails.to": 1, "rideDetails.fare": 1 }
    );
    res.status(200).json(history);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: error });
  }
});
export default router;
