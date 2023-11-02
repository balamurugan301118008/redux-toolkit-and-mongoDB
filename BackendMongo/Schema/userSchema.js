const mongoose = require("mongoose");

const userColumn = new mongoose.Schema({
    name:String,
    email:String,
    password:String,
},{
    timestamps:true
});

module.exports = mongoose.model('users',userColumn);