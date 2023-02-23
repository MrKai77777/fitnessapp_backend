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
        const date = new Date();
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

router.post('/recordData/:rid',auth.userGuard,async(req,res)=>{
    const record = req.params.rid;
    const user = req.user._id;
    let tomorrow = new Date().getHours(24,0,0,0);
    const today = new Date();
    const calories = req.user.calorieIngested;
    const steps = req.user.stepsWalked;
    const streak = req.user.streaks;
    var a;
    var validate = 0;
    // today.setDate(today.getDate()+ 1 );
    // const todays = today.getHours(0,0,0,0);
    // const validDate = new Date(today).toISOString().substring(0,10);
    // validDate.setDate(validDate.getDate() + 1);
    // const tomorrow = new Date();
    // res.json({msg: " asdasd"});
    try{
        a = await Record.findOne({_id : record});
    }   
    catch{
        res.json({success:false, msg:"No record found"});
    }

    // for(let i = 0 ;i<a.account.length;i++){
    //     if(a.account[i].account_id == user.toString()){
    //         if(a.account[i].date == today){
    //             validate = 1;
    //         }
    //     }
    // }
    if(a.account_id == user.toString()){
        for(let i = 0 ;i<a.account.length;i++){
            if(a.account[i].date == today){
                validate = 1;
            }
        }
    }

//     if(validate == 1){
//         Record.findOne({_id : record}),{
//             $set{

//             }
//         }
//     }
 })

 router.get("/record/show", (req, res) => {
    Record.find()
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