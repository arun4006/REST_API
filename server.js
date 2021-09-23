const express = require('express')
const bodyParser = require('body-parser')
const app = express()
var cors = require('cors')
const morgan=require('morgan')

app.use(morgan('dev'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors())


const dbConfig = require('./config/database.config.js');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;


mongoose.connect(dbConfig.url,{ useNewUrlParser: true ,  useUnifiedTopology: true , useFindAndModify: false })
    .then(() => {
        console.log("Successfully connected to the database");
    })
    .catch(err => {
        console.log('Could not connect to the database. Exiting now...', err);
        process.exit();
    });

app.get('/', (req, res) => {
    res.json({ "message": "Welcome to Crud application..." });
});

require('./app/routes/note.routes.js')(app);

app.listen(5465, () => {
    console.log("Server is listening on port 5465");
});
