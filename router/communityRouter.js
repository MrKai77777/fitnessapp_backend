const express = require('express');
const mongodb = require('mongoose');
const app = express();
const jwt = require('jsonwebtoken');
const router = new express.Router();
const auth = require("../auth/auth");
const Task = require("../models/task.js");
const User = require("../models/customer.js");
const { populate } = require('../models/customer.js');
app.use(express.json);

router.post('/task/add', auth.userGuard, async (req, res) => {
    //console.log(req.user);
    const task_name = req.body.task_name;
    Task.findOne({ task_name: task_name })
        .then((task_data) => {
            if (task_data) {
                res.json({ msg: "Task already exists" });
                return;
            }

            const calorie_goals = req.body.calorie_goals;
            const steps_goals = req.body.steps_goals;
            const include_user = req.user;
            const firstname = req.user.firstname;
            const username = req.user.username;
            const data = new Task({
                task_name: task_name,
                calorie_goals: calorie_goals,
                steps_goals: steps_goals,
                include_user: [{
                    account:[{
                        account_id : include_user,
                        firstname: firstname,
                        username: username,
                    }]
                    
                }]
            })
            data.save()
                .then(() => {
                    res.json({ success: true, msg: "task added" })
                })
                .catch((e) => {
                    res.json({ success: false, msg: e })
                })
        })
})

router.get("/task/show", (req, res) => {
    Task.find()
        .then((data) => {
            res.json({ data: data })
        })
})

router.post("/task/add_friend/:tid", auth.userGuard, async (req, res) => {
    const friend = req.body.friend;
    const task = req.params.tid;
    let a;
    var b;
    let c;
    try {
        a = await Task.findOne({ _id: task });
        //console.log(a.include_user);
        c = await User.findOne({ _id: friend })
    }
    catch {
        console.log("error");
    }
        // To assusre friends are not repeated
        for (let i = 0; i < a.include_user.length; i++) {
            for(let o = 0 ; o<a.include_user[i].account.length;o++){
                if (a.include_user[i].account[o].account_id == friend.toString()) {
                    b = "yes";
                }
                else {
                    b = "no";
                }
            }
            }
            
   
    if (b == "no" || b == null) {
        Task.findOneAndUpdate({ _id: task },
            {
                $addToSet: {
                    include_user: [
                        {
                            account: [{
                                account_id : friend,
                                firstname: c.firstname,
                                username: c.username
                            }] 
                            
                        }
                    ]
                }
            })
            .then(() => {
                res.json({ success: true, msg: "Friend added" })
            })
            .catch((e) => {
                res.json({ succes: false, error: e })
            })
    }
    else {
        res.json({ success: true, msg: "already added" })
    }
})

router.put("/task/reward/:tid", auth.userGuard, async (req, res) => {
    const stepsCount = req.body.stepsCount;
    const calorieCount = req.body.calorieCount;
    const task = req.params.tid;
    const friend = req.user._id;
    const date_goal = new Date();
    var inside;
    var date;
    date = date_goal.toISOString().slice(0, 10);
    console.log(date_goal);
    let a, b;
    var inside_id;
    var validator = 0;
    var inc;
    try {
        a = await Task.findOne({ _id: task });
        b = await User.findOne({ _id: friend });
    }
    catch {
        console.log("error");
    }
    for(let i=0;i<a.include_user.length;i++){
        // console.log(a.include_user[0]._id)
        for(let o=0;o<a.include_user[i].account.length;o++){
            if(friend.toString() == a.include_user[i].account[o].account_id){
                //console.log("aaaaa")
                inside= a.include_user[i].account[o]._id;
                //console.log(inside)
            }
            
        }
        
    }
    
    if (a.calorie_goals <= calorieCount && a.steps_goals <= stepsCount) {
        Task.findOneAndUpdate({_id:task},
            {
                $set: {
                  "include_user.$[].account.$[inside].date_goal": date_goal
                }
              },
              {
                arrayFilters: [
                  { "inside._id": inside }, 
                ]
              }
            )
        .then((data) => {
                // console.log(data);
            res.json({ success: true, msg: "Success" })
        })
        .catch((e) => {
            res.json({ success: false, msg: e })
        })
    }
    else {
        res.json({ success: false, msg: "Saddddddd" });
    }
})

router.put("/task/streaks/:tid",auth.userGuard,async (req,res)=>{
    const today = new Date();
    const task = req.params.tid;
    var a;
    var streaks = 0;
    const friend = req.user._id
    
    try{
        a = await Task.findOne({task : task})
    } 
    catch{
        res.json({success : false, msg : "Wrong Task"})
    }
    //For the increment of streaks if one day has elapsed
    for(let i = 0;i<a.include_user.length;i++){
        for(let j = 0;j<a.include_user[i].account.length;j++){
            if(a.include_user[i].account[j].account_id == friend.toString()){
                streaks = a.include_user[i].account[j].streak;
                //console.log(streaks);
                var differenceDate = Math.abs(a.include_user[i].account[j].date_goal - today);
                console.log(differenceDate);
                if(differenceDate == 86400000){
                    streaks++;
                    //console.log(streaks);
                }
                //If task isnt completed
                else if(differenceDate > 86400000){
                    streaks = 0;
                }
            }
        }
    }
    
    //For User Id
    for(let i=0;i<a.include_user.length;i++){
        // console.log(a.include_user[0]._id)
        for(let o=0;o<a.include_user[i].account.length;o++){
            if(friend.toString() == a.include_user[i].account[o].account_id){
                //console.log("aaaaa")
                inside= a.include_user[i].account[o]._id;
                //console.log(inside)
            }
            
        }
        
    }
    Task.findOneAndUpdate({_id : task},{
        $set: {
            "include_user.$[].account.$[inside].streak": streaks
          }
        },
        {
          arrayFilters: [
            { "inside._id": inside }, 
          ]
    }
)
.then((data)=>{
    res.json({success:true,msg : "Success"})
})
.catch((e)=>{
    res.json({success:false,msg : e})
})
})

router.delete("/task/deleteall", async (req, res) => {
    Task.remove({}, function (err) {
        if (err) {
            res.json(err);
        }
        else {
            res.json({ success: true, msg: "Data deleted" });
        }
    })
})



module.exports = router;