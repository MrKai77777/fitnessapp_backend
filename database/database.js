const mongodb = require('mongoose');

mongodb.connect('mongodb://127.0.0.1:27017/myapp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('db connected');
})
    .catch((err) => {
        console.log('Error');
    });