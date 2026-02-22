   
   import mongoose  from "mongoose";

const riderSchema = new mongoose.Schema(
    {
        fullName : {
            type : String,
            required : true,
            trim : true
        },
        phone : {
            type : String,
            require : true
        },
        email : {
            type : String,
            required : true,
            trim : true
        },
        password :{
            type : String,
            required : true,
        },
        age : {
            type : Number,
            required : true,
            minlength : [18,"minimum age required is 18"],
            maxlength : [80,"maximum age is 80"]
        },
        gender : {
            type : String,
            required : true,
            enum : ["male","female","others"]
        },
        isActive : {
            type : Boolean,
            default : true
        },
        isVerified : {
            email : {
                type : Boolean,
                default : false
            },
            phone : {
                type : Boolean,
                default : false
            }
        },
        isVerifiedToken : {
            emailToken: {
                type : String,
                default : null
            },
            phoneToken : {
                type : String,
                default : null
            }
        },
        vehicleType : {
            type : String,
            enum :["bike","scooty","auto","cab"],
            required : true
        },
        vehicleRc : {
            type : String,
            required : true
        },
        isOnline : {
            type : Boolean,
            default : false
        },
        isRiding : {
            type : Boolean,
            default : false
        }
        
    },
    {
        timestamps : true,
        strict : false
    },
)

const riderModel = mongoose.model("riders",riderSchema);

export default riderModel;