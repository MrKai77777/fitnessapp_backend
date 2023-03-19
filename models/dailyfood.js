const mongodb = require('mongoose');

const dailyfood = new mongodb.Schema({
    account_id:{
        type : mongodb.Schema.Types.ObjectId,
        ref : "customer_database"
    },
    firstname :{
        type: String
    },
    foodIngested :[{
        sauceName:{
            type: String,
            default : "N/A"
        },
        calories:{
            type: Number,
            default : 0
        } 
    }]
});

module.exports = mongodb.model('dailyfood',dailyfood);