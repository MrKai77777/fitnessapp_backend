const jwt = require("jsonwebtoken");
const User = require("../models/customer.js");

module.exports.userGuard=(req,res,next)=>{
    try {
        const token = req.headers.authorization.split(" ")[1];
        const data = jwt.verify(token, "Kai");
       // console.log(data.customerId);
        User.findOne({_id:data.customerId})
        .then((user_data)=>{
            //console.log(user_data)
            req.user = user_data;
            next();
        })
        .catch((e)=>{
            res.json({success:false,msg:"Invalid token"})
        })
    } catch (e) {
        res.json({success:false,msg:e})
    }
}