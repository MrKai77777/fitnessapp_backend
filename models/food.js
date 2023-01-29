const mongodb = require('mongoose');

const food = new mongodb.Schema({
    id:{
        type: String,
        //requied : true
    },
    sauceName:{
        type: String,
        requied : true
    },
    calories:{
        type: Number,
        requied : true
    },
    resturantNames:{
        type: String,
        requied : true
    }
});

module.exports = mongodb.model('myapps',food);