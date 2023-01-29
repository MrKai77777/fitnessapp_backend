const express = require("express");
const app = express();
const cors = require("cors");
app.use(express.json());
app.use(cors());
//app.use(express.static(__dirname+"/fotoz"));
require("./database/database");
const customerRouter = require("./router/customerRouter");
app.use(customerRouter);
const calorieRecommender = require("./router/recom");
app.use(calorieRecommender);
const calorieCounter = require("./router/calorie_counterRouter");
app.use(calorieCounter);
const task = require("./router/communityRouter");
app.use(task);
 app.listen(3000, () => {
        console.log('server running');
    });