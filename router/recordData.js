const express = require('express');
const app = express();
const router = new express.Router();
const auth = require("../auth/auth");
const User = require("../models/customer.js");
const Record = require("../models/record.js");

app.use(express.json);

router.post('/record/enter',auth.userGuard,async(req,res)=>{
    const user = req.user._id;
    Record.findOne({account_id : user})
    .then((data)=>{
        if(data){
            res.json({ msg: "Record already exists" });
            return;
        }
        const firstname = req.user.firstname;
        const steps = req.user.stepsWalked;
        const calorie = req.user.calorieIngested;
        const date = new Date().toISOString().substring(0,10);
        const record_data = new Record({
        account_id : user,
        firstname : firstname,
        progress:[{
            steps: steps,
            calorie : calorie,
            date : date
        }]
    })
    record_data.save()
    .then(()=>{
        res.json({success :true , msg:"record saved"});
    })
    .catch((e)=>{
        res.json({success :true , msg: e});
    })
    })
    
})

router.post('/recordData',auth.userGuard,async(req,res)=>{
    //const record = req.params.rid;
    const user = req.user._id;
    const today = new Date().toISOString().substring(0,10);
    const calories = req.user.calorieIngested;
    const steps = req.user.stepsWalked;
    const streak = req.user.streaks;
    var totalCalories = 0;
    var totalSteps = 0;
    var averageCalories = 0;
    var averageSteps = 0;
    var a;
    var validate = 0;
    var inside;

    try{
        a = await Record.findOne({account_id : user});
    }   
    catch{
        res.json({success:false, msg:"No record found"});
    }
    var total_days = a.progress.length;

    if(a.account_id == user.toString()){
        for(let i = 0 ;i<a.progress.length;i++){
            if(a.progress[i].date == today){
                validate = 1;
                inside = a.progress[i]._id;
                // console.log(a.progress[i].calorie/2);
                // console.log(total_days);
            }
                 totalCalories = Math.abs((totalCalories + a.progress[i].calorie));
                 totalSteps = Math.abs((totalSteps + a.progress[i].steps));
        }
    }
    averageCalories = totalCalories/total_days;
    averageSteps = totalSteps/total_days;

    if(validate == 1){
        Record.findOneAndUpdate({account_id : user},{
            $set:{
                "progress.$[inside].steps" : steps,
                "progress.$[inside].calorie" : calories
            }
        },
        {
            arrayFilters: [
              { "inside._id": inside }, 
            ]
          }
        )
        .then(()=>{
            Record.findOneAndUpdate({account_id : user},{
                $set:{
                     "averageCalories" : parseInt(averageCalories),
                     "averageSteps" : parseInt(averageSteps)
                }
            })
            .then(()=>{
                res.json({success : true,msg:"Record Updated"});
        })
        .catch((e)=>{
            res.json({success : false,msg: e });
        })
            })
            
        .catch((e)=>{
            res.json({success : false,msg: "e" });
        })
    }
    else{
        Record.findOneAndUpdate({account_id : user},{
            $addToSet:{
                progress:[{
                    steps : steps,
                    calorie : calories,
                    date : today
                }]
            }
        })
        .then(()=>{
            res.json({success : true,msg:"New Record Created"});
        })
        .catch((e)=>{
            res.json({success : false,msg: "Record Already Updated" });
        })
    }
 })

 router.get("/record/show", (req, res) => {
    Record.find()
        .then((data) => {
            res.json({ data: data })
        })
})

router.get("/record/showUser", auth.userGuard,async(req, res) => {
    const user = req.user._id;
    Record.find({account_id : user})
        .then((data) => {
            res.json({ data: data })
        })
})

router.delete("/record/deleteall", async (req, res) => {
    Record.remove({}, function (err) {
        if (err) {
            res.json(err);
        }
        else {
            res.json({ success: true, msg: "Data deleted" });
        }
    })
})

module.exports = router;