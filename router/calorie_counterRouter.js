const express = require('express');
const mongodb = require('mongoose');
const jwt = require('jsonwebtoken');
const auth = require("../auth/auth");
const app = express();
const router = new express.Router();
const User = require("../models/customer.js");
const food = require('../models/food.js');
app.use(express.json());

var sum;

router.post('/counter', auth.userGuard, async (req, res) => {
    const user = req.user._id;
    console.log(req.user._id);
    let a;
    try {
        a = await User.findOne({ _id: user });
    }
    catch {
        console.log("invalid");
    }
    const sauceName = req.body.sauceName;
    food.findOne({ sauceName: sauceName })
        .then(sauce_data => {
            console.log(sauce_data.calories);
            sum = a.calorieIngested + sauce_data.calories;
            console.log(sum);
            User.findOneAndUpdate({ _id: user },
                {
                    $set: {
                        "calorieIngested": sum
                    }
                }
            )
                .then((data) => {
                    // console.log(data);
                    res.json({ success: true, msg: "Success" })
                })
                .catch((e) => {
                    res.json({ success: false, msg: e })
                })
        })
        .catch((e) => {
            res.json({ success: false, msg: e });
        }
        )
});

router.post('/calorieReset', auth.userGuard, async (req, res) => {
    const user = req.user._id;
    const user_calorieIngested = req.user.calorieIngested;
    const user_stepWalked = req.user.stepsWalked;
    const currentDate = new Date().toISOString().substring(0,10);
    var a;
    try{
        a = await User.findOne({_id : user}) ;
    }
    catch{
        console.log("Error In Finding the User");
    }
    
    const previousDate = a.goalDate;
    console.log(a.calorieGoal);
    console.log(a.stepsGoal);

    // Check if it is now 12AM in the next day
    if (previousDate.toISOString().substring(0,10) != currentDate) {
        User.findOneAndUpdate({ _id: user },
            {
                $set: {
                    "calorieIngested": 0,
                    "stepsWalked" : 0,
                    "goalDate" : currentDate
                },
            }
        )
            .then((data) => {
                if(a.calorieGoal <= user_calorieIngested && a.stepsGoal <= user_stepWalked){
                    User.findOneAndUpdate({ _id: user },
                        {
                            $inc :{
                                "streaks" : 1
                            }
                        }
                    )
                    .then(()=>{
                        res.json({ success: true, msg: "Success" })
                    })
                    .catch(()=>{
                        res.json({ success: false, msg: "Not Success"})
                    })
                }
                else{
                    User.findOneAndUpdate({ _id: user },
                        {
                            $set :{
                                "streaks" : 0
                            }
                        }
                    )
                    .then(()=>{
                        res.json({ success: true, msg: "Success" })
                    })
                    .catch(()=>{
                        res.json({ success: false, msg: "Not Success"})
                    })
                }
                
            })
            .catch((e) => {
                res.json({ success: false, msg: e })
            })
    } 
    else {
        console.log('It is not yet 12AM in the next day');
        res.json({success : false, msg : "Its not 12 AM next Day"});
    }
})

module.exports = router;