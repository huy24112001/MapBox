const mongoose = require('mongoose')

// coordinate Schema
const coordinateSchema = new mongoose.Schema({
    fullname:{
        type: String,
        require : true,
        trim : true
    },
    username :{
        type : String,
        required:true,
        trim : true
    },
    password :{
        type : String,
        required:true,
        trim : true
    },
    coordinate:{
        type: [],
        required: false,
        trim : true,
        default: [],
    },
    keyPublic: {
        type:String,
        required: false,
        trim : true,
        default: ""
    },
    isPublicKey :{
        type:Boolean,
        required : false,
        trim :true,
        default: false,
    
    }

   
});

const CoordinateModel  = mongoose.model("Coordinates", coordinateSchema);
module.exports = CoordinateModel;