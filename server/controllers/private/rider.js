import express from "express";
import bcrypt from "bcrypt";
const router = express.Router();

// import models
import riderModel from "../../models/Riders/Riders.js";
import rideModel from "../../models/Rides/Rides.js";
import userModel from "../../models/User/User.js";

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

router.get("/rider-onduty", async (req, res) => {
    try {
        let rider = req.user;
        await riderModel.updateOne({ email: rider.email }, { $set: { isOnline: true } })
        res.status(200).json({ msg: "you are now on-duty" })
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: error })
    }
})

router.get("/rider-history", async (req, res) => {
    try {
        let rider = await riderModel.findOne({ email: req.user.email })
        let history = await rideModel.find({ riderId: rider._id }, { "rideDetails.from": 1, "rideDetails.to": 1, "rideDetails.fare": 1 })
        res.status(200).json(history)
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: error })
    }
})

router.get("/rider-offduty", async (req, res) => {
    try {
        let rider = req.user
        await riderModel.updateOne({ email: rider.email }, { $set: { isOnline: false } })
        res.status(200).json({ msg: "you are now off-duty" })
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: error })
    }
})

router.get("/rider-active-duty", async (req, res) => {
    try {
        const rider = await riderModel.findOne({ email: req.user.email });
        if (!rider) return res.status(404).json({ msg: "Rider not found" });

        const ride = await rideModel.findOne({
            riderId: rider._id,
            status: { $in: ["pending", "accepted", "ongoing"] }
        }).sort({ createdAt: -1 });

        if (!ride) return res.status(200).json(null);

        const customer = await userModel.findById(ride.userId, { fullName: 1, phone: 1 });
        res.status(200).json({ ...ride.toObject(), customer });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
});

router.put("/update-ride-status", async (req, res) => {
    try {
        const { rideId, status } = req.body;
        const validStatuses = ["accepted", "ongoing", "completed", "cancelled"];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ msg: "Invalid status update" });
        }

        const updatedRide = await rideModel.findByIdAndUpdate(
            rideId,
            { status },
            { new: true }
        );

        res.status(200).json({ msg: `Ride status updated to ${status}`, ride: updatedRide });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
});

export default router;
