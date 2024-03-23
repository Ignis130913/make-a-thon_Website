const express = require('express');
const app = express()
// const cors = require('cors')
const mongoose = require("mongoose");
const { log } = require('console');

mongoose               
  .connect("mongodb://localhost:27017/make-a-thon", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB Connection Successfull");
  })
  .catch((err) => {
    console.log(err.message);
  });

// Define a schema for the data
const dataSchema = new mongoose.Schema({
    email: String,
    password: String
});

// Create a model based on the schema
const Data = mongoose.model('Data', dataSchema);

// Handle form submission
app.post('/login',async(req,res)=>{
    console.log("Received request");
    try{
        const email = req.body.email;
        const password = req.body.password;
        
        const user = await Data.findOne({username:email});
        if(user){
          res.json({status:false,message:"Email Already Exist"});
        }else{
          const user = new Data({
            email:email,
            password:password
          })
          user.save()
          .then(async(result) => {
  
            // Put absent for him in Student collection
            res.json({status:true,message:"User Created",user:user});
          })
          .catch((error) => {
            res.json({status:false,message:"Error"});
          })
          
        }
    }catch(err){
        res.json({status:false,message:"Error"});
    }
  })
  

// Start the server
port=5500
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
