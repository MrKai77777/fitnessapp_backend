const express = require('express');
const mongodb = require('mongoose');
const app= express();
const router = new express.Router();
const auth = require("../auth/auth");
const customer = require('../models/customer.js');
app.use(express.json());

/*mongodb.connect('mongodb://127.0.0.1:27017/myapp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('db connected');
})
    .catch((err) => {
        console.log('Error');
    });*/

app.get('/', (req,res)=> {
    res.send ('Recommended Calories');
});

router.post('/calorie',auth.userGuard,(req,res)=>{  
    var age = req.user.age;
    var gender = req.user.gender;
    var weight = req.user.weight;
    var height = req.user.height;
    var activity = "4";
    var totalCalories;  

    if (age === '' || weight === '' || height === '' || 80 < age || age< 15) {
       res.status(400).send('Enter correct input')
      } else if(gender === 'male' && activity === "1") {
        totalCalories = 1.2 * (66.5 + (13.75 * parseFloat(weight)) + (5.003 * parseFloat(height)) - (6.755 * parseFloat(age)));
      } else if(gender === 'male' && activity === "2") {
        totalCalories = 1.375 * (66.5 + (13.75 * parseFloat(weight)) + (5.003 * parseFloat(height)) - (6.755 * parseFloat(age)));
      } else if (gender === 'male' && activity === "3") {
        totalCalories = 1.55 * (66.5 + (13.75 * parseFloat(weight)) + (5.003 * parseFloat(height)) - (6.755 * parseFloat(age)));
      } else if(gender === 'male' && activity === "4") {
        totalCalories = 1.725 * (66.5 + (13.75 * parseFloat(weight)) + (5.003 * parseFloat(height)) - (6.755 * parseFloat(age)));
      } else if(gender === 'male' && activity === "5") {
        totalCalories = 1.9 * (66.5 + (13.75 * parseFloat(weight)) + (5.003 * parseFloat(height)) - (6.755 * parseFloat(age)));
        
      } else if(gender=== 'female' && activity === "1") {
        totalCalories = 1.2 * (655 + (9.563 * parseFloat(weight)) + (1.850 * parseFloat(height)) - (4.676 * parseFloat(age)));
      } else if(gender === 'female' && activity === "2") {
        totalCalories = 1.375 * (655 + (9.563 * parseFloat(weight)) + (1.850 * parseFloat(height)) - (4.676 * parseFloat(age)));
      } else if(gender === 'female' && activity === "3") {
        totalCalories = 1.55 * (655 + (9.563 * parseFloat(weight)) + (1.850 * parseFloat(height)) - (4.676 * parseFloat(age)));
      } else if(gender === 'female' && activity === "4") {
        totalCalories = 1.725* (655 + (9.563 * parseFloat(weight)) + (1.850 * parseFloat(height)) - (4.676 * parseFloat(age)));
      } else {
        totalCalories = 1.9 * (655 + (9.563 * parseFloat(weight)) + (1.850 * parseFloat(height)) - (4.676 * parseFloat(age)));
      } 
      console.log('Calculating...');
      res.json(totalCalories);
    }
  ); 

//app.listen(3000, () => console.log ('listening on port 3000'));

module.exports = router;