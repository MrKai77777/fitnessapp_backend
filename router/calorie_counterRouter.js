const express =  require('express');
const mongodb =  require('mongoose');
const app = express();
const router = new express.Router();

app.use(express.json());
const food = require('../models/food.js');
var sum ;

router.post('/counter',(req,res)=>{
    const id = req.params.id;
    const sauceName = req.body.sauceName;
    food.findOne({ $or :[{sauceName:sauceName}]})
    .then(sauce_data=>{
        if(sauce_data){
            console.log('Inside')
            res.json(sauce_data.calories);
            sum = sum + sauce_data.calories;
        }
        else{
            console.log('Invalid Name');
        }
        
    })
    
    
});

module.exports = router;