//jshint esversion:6
require('dotenv').config();
const express=require('express');
const bodyParser=require('body-parser');
const ejs =require('ejs');
const mongoose=require('mongoose')
const encrypt=require('mongoose-encryption')

const app=express();
app.use(express.static("public"));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({
    extended:true
}))
mongoose.connect("mongodb://127.0.0.1:27017/userDB");
const userSchema=new mongoose.Schema({
    email:String,
    password:String
});
userSchema.plugin(encrypt,{secret:process.env.SECRET,encryptedFields:['password']});
const User=mongoose.model("User",userSchema);
app.get("/",(req,res)=>{
    res.render("home");
});
app.get("/login",(req,res)=>{
  res.render("login");
});
app.get("/register",(req,res)=>{
    res.render("register");
});
app.post("/register",(req,res)=>{
 const newUser=new User({
    email:req.body.username,
    password:req.body.password
 });
 newUser.save().then(()=>{
    console.log("thành công 1");
    res.render("secrets");
 }).catch(()=>console.log("lỗi 1"));
});
app.post("/login",(req,res)=>{
    const userName=req.body.username;
    const password=req.body.password;
    User.findOne({email:userName}).then((user)=>{
        if(user){
            if(user.password===password){
                res.render("secrets");
            }
        }
    }).catch(()=>console.log("thất bại 2"));
})
app.listen(3000,()=>{
    console.log("Đang nghe ở cổng 3000");
})