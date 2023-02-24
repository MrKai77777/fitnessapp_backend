const express = require("express");
const app = express();
const router = new express.Router();
const auth = require("../auth/auth");
const Friends = require("../models/friends.js");
const User = require("../models/customer.js");
app.use(express.json);

router.post('/friend/enter',auth.userGuard,async(req,res)=>{
    const user = req.user._id;
    Friends.findOne({account_id : user})
    .then((data)=>{
        if(data){
            res.json({ msg: "Record already exists" });
            return;
        }
        const firstname = req.user.firstname;

        const record_data = new Friends({
        account_id : user,
        name : firstname,
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

router.post("/addFriends",auth.userGuard,async(req,res)=>{
    const user = req.user._id
    // const DataBase = req.param.did;
    const friend = req.body.friend;
    var a,b;
    let exists;
    try{
        a = await User.findOne({_id : friend});
        b = await Friends.findOne({account_id : user});
    }
    catch{
        console.log("error");
    }
    const user_name = req.user.firstname;
    const friend_name = a.firstname;

    for(let i = 0; i < b.friend_list.length;i++){
        if(b.friend_list[i].friend_id == friend.toString()){
            exists = "yes"
        }
        else{
            exist = "no"
        }
    }
    //console.log(user);
    if (exists == "no" || exists == null) {
        Friends.findOneAndUpdate({ account_id: user},
            {
                $addToSet: {
                    friend_list:[{
                        friend_id : friend,
                        friend_name : friend_name
                    }]
                }
            })
        .then(()=>
        {
            Friends.findOneAndUpdate({account_id : friend},{
            $addToSet: {
                friend_list:[{
                    friend_id : user,
                    friend_name : user_name
                }]
            }
        })
            .then(() => {
                res.json({ success: true, msg: "Friend added" })
            })
            .catch((e) => {
                res.json({ success: false, error: e })
            })
        })
        .catch((e) => {
            res.json({ success: false, error: e })
        })
    }
    else {
        res.json({ success: true, msg: "already added" })
    }

})

router.get("/friend/show", (req, res) => {
    Friends.find()
        .then((data) => {
            res.json({ data: data })
        })
})

router.delete("/friend/deleteall", async (req, res) => {
    Friends.remove({}, function (err) {
        if (err) {
            res.json(err);
        }
        else {
            res.json({ success: true, msg: "Data deleted" });
        }
    })
})

module.exports = router;



