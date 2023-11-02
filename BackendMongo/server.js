
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
// const json = app.json();

app.use(express.json());
app.use(cors({
    origin: ['http://localhost:5173'],
    methods: ["POST", "GET"],
    credentials: true,
}));
app.use(bodyParser.json());
const PORT = 4000;
const hostName = 'localhost'
const router = require("./controller/router");


app.use(bodyParser.urlencoded({ extended: false }));
// app.use(json());
app.use('/', router);

mongoose.connect('mongodb://localhost:27017/adminusers').then(() => console.log("connected")).catch(() => console.log("Not Connected"));




app.listen(PORT, hostName, () => { console.log(`Server is running this ${PORT} and this ${hostName}`) });
