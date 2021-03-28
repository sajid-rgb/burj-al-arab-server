const express = require('express')
const admin = require('firebase-admin');
var serviceAccount = require("./configs/ema-jhon-simple-9eadb-firebase-adminsdk-neg2i-f7f317fef8 (1).json");
require('dotenv').config()
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://<DATABASE_NAME>.firebaseio.com'
});
const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.weqbi.mongodb.net/burjAlArab?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express()
app.use(cors())
app.use(bodyParser.json())
app.get('/', (req, res) => {

})
client.connect(err => {
    const productCollection = client.db("burjAlArab").collection("booking");
    app.post('/bookTicket', (req, res) => {
        const newBooking = req.body;
        productCollection.insertOne(newBooking)
            .then(result => {
                res.send(result)
            })
        console.log(newBooking)
    })
    app.get('/bookings', (req, res) => {
        const bearer = req.headers.authorization
        if (bearer && bearer.startsWith('Bearer ')) {
            const idToken = bearer.split(' ')[1];
            console.log({ idToken });
            admin.auth().verifyIdToken(idToken)
                .then((decodedToken) => {
                    const tokenEmail = decodedToken.email;
                    if (tokenEmail === req.query.email) {
                        productCollection.find({ email: req.query.email })
                            .toArray((err, documents) => {
                                res.status(200).send(documents)
                            })

                    }
                    else{
                        res.status(401).send('Un-authorised access')
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
               
        }
        else{
            res.status(401).send('Un-authorised access')
        }
   })
    console.log('connected');
})
app.listen(5000, console.log("Welcome"))