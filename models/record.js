const mongoose = require('mongoose');

const record = new mongoose.Schema({
    account_id:{
        type : mongoose.Schema.Types.ObjectId,
        ref : "customer_database"
    },
    firstname:{
        type : String
    },
    progress:[{
        steps:{
            type : Number,
            default : 0
        },
        calorie:{
            type : Number,
            default : 0
        },
        date:{
            type : String
        }
    }],
    max_streaks:{
        type : Number,
        default : 0
    }
})
module.exports = mongoose.model("Record_Data", record);