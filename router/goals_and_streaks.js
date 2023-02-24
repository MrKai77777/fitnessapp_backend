const express  = require('express');
const app = express();
const auth = require("../auth/auth");
const User = require("../models/customer.js");
const router = new express.Router();

app.use(express.json);

router.post("/addGoals",auth.userGuard,async(req,res)=>{
    const user = req.user._id;
    const calorieGoal = req.body.calorieGoal;
    const stepsGoal = req.body.stepsGoal;
    const today = new Date;
    User.findOneAndUpdate({_id : user},{
        $set:{
            calorieGoal : calorieGoal,
            stepsGoal : stepsGoal,
            goalDate : today
        }
    })
    .then(()=>{
        res.json({success : true, msg : "Goals Added"});
    })
    .catch((e)=>{
        res.json({success : false, msg : e});
    })
})

router.post("/updateStreaks",auth.userGuard,async(req,res)=>{
    const user = req.user._id;
    const calorieGoal = req.user.calorieGoal;
    const stepsGoal = req.user.stepsGoal;
    const today = new Date();
    const calorieIngested = req.user.calorieIngested;
    const stepsWalked = req.user.stepsWalked;
    const goalCompleteDate = req.user.goalCompleteDate;
    const streaks = req.user.streaks;
    var a;
    var validate = 0;
    try{
        a = await User.findOne({_id : user});
    }
    catch{
        res.json({success : false ,msg:"No user found"})
        return;
    }
    var differenceDate = Math.abs(a.goalDate - today);
    if(differenceDate == 86400000){
        if(calorieIngested >= calorieGoal && stepsWalked >= stepsGoal){
            User.findOneAndUpdate({_id : user},{
                $inc:{
                    streaks : 1
                }
            })
            .then(()=>{
                User.findOneAndUpdate({_id : user},{
                    $set:{
                        goalDate : today
                    }
                })
                .then(()=>{
                    res.json({msg : "Streaks Added"})
                })
        })
    }
}
    else if(differenceDate > 86400000){
        User.findOneAndUpdate({_id : user},{
            $set:{
                streaks : 0
            }
        })
        .then(()=>{
            User.findOneAndUpdate({_id : user},{
                $set:{
                    goalDate : today
                }
            })
            .then(()=>{
                res.json({msg : "Streaks Reseted"})
            })
            
        })
    }
    else{
        res.json({msg : "Nothing to be done"});
    }
})
module.exports = router;






