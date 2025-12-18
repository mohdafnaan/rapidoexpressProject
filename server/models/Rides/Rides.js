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
                require : true
            },
            to : {
                type  : String,
                require : true
            },
            distance : {
                type : Number,
                require : true
            },
            vehicleType : {
                type : String,
                require : true,
                enum : ["scooty","cab","bike","auto"]
            },
            PaymentMethod : {
                type : String,
                require :true,
                enum : ["cod","upi"]
            },
            fare : {
                type : Number,
            }


        }
    },
    {
        timestamps : true
    }
)

const rideModel = mongoose.model("rides",rideSchema)

export default rideModel;

