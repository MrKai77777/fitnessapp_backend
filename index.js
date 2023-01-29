const bcryptjs = require("bcryptjs");
const express = require('express');
const session = require('express-session');
const Joi = require('joi');
const router = new express.Router();
const mongodb = require('mongoose');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());

const customer = require('./customer.js');
const { Router } = require('express');
const { default: mongoose } = require('mongoose');

mongodb.connect('mongodb://127.0.0.1:27017/myapp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('db connected');
})
    .catch((err) => {
        console.log('Error');
    });

app.get('/send', (req, res) => {
    res.send(courses);
});

app.post("/signUp", async (req, res) => {
    console.log('inside post');
    const email = req.body.email;
    customer.findOne({ email: email })

        .then((cust_data) => {
            if (cust_data != null) {
                res.json({ msg: "Email already exists" });
                return;
            }

            const firstname = req.body.firstname;
            const password = req.body.password;

            const lastname = req.body.lastname;
            const username = req.body.username;

            const age = req.body.age;
            const email = req.body.email;
            const weight = req.body.weight;
            const height = req.body.height;
            const gender = req.body.gender;

            bcryptjs.hash(password, 10, (e, hashed_pw) => {
                const data = new customer({
                    firstname: firstname,
                    lastname: lastname,
                    username: username,
                    password: hashed_pw,
                    age: age,
                    email: email,
                    weight : weight,
                    height : height,
                    gender : gender
                })

                data.save()
                    .then(() => {
                        res.json({ success: true, msg: "Added" })
                    })
                    .catch((e) => { res.json({ e }) })
            })

        })
        .catch()
})

app.get("/getData", async (req, res) => {
    const data = await customer.find();
    res.json(data);
});

app.post("/login", (req, res,next) => {
    const email = req.body.email;
    const password = req.body.password;
    customer.findOne({ $or: [{ email: email }]})
        .then(user => {
            if (user) {
                bcryptjs.compare(password, user.password,(err, result)=>{
                    if(result == false){
                        res
                        .status(401)
                        .json({success:false,error:"Invalid Credentials"})
                        return;
                    }
                    else{

                        res.json({success:true,msg:'Connected'});    
                    }
                    })
            }
        else {
                    res.json({ msg: 'no user found' })
                }
            
        } )
    });


    app.listen(3000, () => {
        console.log('server running');
    });

    module.exports = router;