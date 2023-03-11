const mongodb = require('mongoose');

const hosted = 'mongodb://uioivuamqumdxjrr546d:EybLxFdusRfUXVx0SV5f@n1-c2-mongodb-clevercloud-customers.services.clever-cloud.com:27017,n2-c2-mongodb-clevercloud-customers.services.clever-cloud.com:27017/bmfxqbckcpzxpgu?replicaSet=rs0'; 

const local = 'mongodb://127.0.0.1:27017/myapp';

mongodb.connect(local, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Mongo DB connected');
})
    .catch((err) => {
        console.log('Mongo DB Error', err);
    });