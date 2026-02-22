import mongoose from "mongoose"

const rideSchema = new mongoose.Schema(
    {
        userId : {
            type : String,
        },
        riderId : {
            type : String
        },
        rideDetails : {
            from : {
                type : String,
                required : true
            },
            to : {
                type  : String,
                required : true
            },
            distance : {
                type : Number,
                required : true
            },
            vehicleType : {
                type : String,
                required : true,
                enum : ["scooty","cab","bike","auto"]
            },
            PaymentMethod : {
                type : String,
                required :true,
                enum : ["cod","upi","cash"]
            },
            fare : {
                type : Number,
            }


        },
        status: {
            type: String,
            enum: ["pending", "accepted", "ongoing", "completed", "cancelled"],
            default: "pending"
        },
        otp: {
            type: String,
            default: () => Math.floor(1000 + Math.random() * 9000).toString()
        }
    },
    {
        timestamps : true
    }
)

const rideModel = mongoose.model("rides",rideSchema)

export default rideModel;

