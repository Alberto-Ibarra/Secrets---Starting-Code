//jshint esversion:6
//important to put dotenv on top of page
require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require('mongoose-encryption');

const app = express();

console.log(process.env.SECRET);

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));

main().catch(err => console.log(err));

async function main() {
    await mongoose.connect("mongodb://localhost:27017/userDB");
    console.log("connected");
};


const userSchema = new mongoose.Schema({
    email: String,
    password: String
});



//plugin part of mongoose-encrypt
//secret variable is used in js object below
//encrytedFields is use to specify what field in the database you want encrypted otherwise everything in database will be encrypted
//process.env.SECRET comes from the .env file
userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ['password']});

const User = new mongoose.model("User", userSchema);




app.get("/", (req, res)=>{
    res.render("home");
});

app.get("/login", (req, res)=>{
    res.render("login");
});

app.get("/register", (req, res)=>{
    res.render("register");
});

app.post("/register", (req,res)=>{
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    });

    newUser.save((err)=>{
        if(err){
            console.log(err);
        }else{
            res.render("secrets");
        }
    });
});

app.post("/login", (req,res)=>{
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({email: username}, (err, foundUser)=>{
        if(err){
            console.log(err);
        }else{
            if(foundUser){
                if(foundUser.password === password){
                    res.render("secrets")
                }
            }
        }
    });
});









app.listen(3000, ()=>{
    console.log("Server on port 3000");
})