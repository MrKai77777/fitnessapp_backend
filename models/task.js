const mongodb = require('mongoose');

const task = new mongodb.Schema({
    task_name: {
        type: String
    },

    calorie_goals: {
        type: Number
    },

    steps_goals: {
        type: Number
    },

    include_user: [{
        account: [{
            account_id :{
                type : mongodb.Schema.Types.ObjectId,
                ref : "customer_database"
            },
            firstname: {
                type: String
            },
            username: {
                type: String
            },
            date_goal: {
                type: Date,
                default: new Date()
            },
            streak: {
                type: Number,
                default: 0
            }
    }],
    random:{
        type:String,
        default:"asdasd"
    }
    }],
    max_streak:[{
        m_firstname : {
            type : String
        },
        max_streaks : {
            type : Number
        }
    }]
})

module.exports = mongodb.model("Task", task);