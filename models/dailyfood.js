const mongodb = require('mongoose');

const dailyfood = new mongodb.Schema({
    account_id:{
        type : mongodb.Schema.Types.ObjectId,
        ref : "customer_database"
    },
    foodIngested :[{
        sauceName:{
            type: String,
        },
        calories:{
            type: Number,
        } 
    }]
});

module.exports = mongodb.model('dailyfood',dailyfood);