const mongoose = require('mongoose');

const friends = new mongoose.Schema({
    account_id :{
        type : mongoose.Schema.Types.ObjectId,
        ref : "customer_database"
    },
    name : {
        type : String
    },
    friend_list:[{
        friend_id:{
            type : mongoose.Schema.Types.ObjectId,
            ref : "customer_database"
        },
        friend_name :{
            type : String
        }
    }]
})

module.exports = mongoose.model("Friend_Data", friends);