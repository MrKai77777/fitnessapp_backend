
const { number } = require('joi');
const mongoose = require('mongoose');
const { mainModule } = require("process");
const { StringDecoder } = require("string_decoder");

const customer = new mongoose.Schema({
    firstname :{
        type: String,
        required: true 
    },
    lastname : {
        type : String,
        required: true
    },
    username:{
        type :String,
        required: true
    },
    age:{
        type : Number,
        required : true
    },
    password : {
        type : String,
        required: true
    },
    email :{
        type : String,
        required: true
    },
    weight :{
        type : Number,
        required : true
    },
    height : {
        type : Number,
        required : true
    },
    gender : {
        type : String,
        required : true
    },
    calorieIngested:{
        type : Number,
        default : 0
    },
    stepsWalked:{
        type : Number,
        default : 0
    },
    streaks:{
        type : Number,
        default : 0
    },
    calorieGoal :{
        type : Number,
        default : 0
    },
    stepsGoal :{
        type : Number,
        default : 0
    },
    goalDate:{
        type : Date,
        default : new Date().toISOString().substring(0,10)
    },
    recommendedCalories:{
        type : Number,
        default : 0
    }
});

module.exports = mongoose.model('customer_database',customer);