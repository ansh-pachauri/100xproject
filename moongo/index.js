const express = require("express");
const bcrypt =  require("bcrypt");
const app = express();
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const JWT_SECRET ="secretkeyMongo";
const {z} = require("zod");
//connect the mongooes database
mongoose.connect("");
//import the models
const {UserModel, TodoModel }= require("./db");
//const { hash } = require("bcrypt");
//middleware
app.use(express.json());

app.post("/signup",async (req,res)=>{

    //using the zod 
    const requiredBody = z.object({
        name: z.string().min(3).max(20).optional(),
        email: z.string().email(),
        password: z.string().min(8).max(20).optional(),
    });

    //parseing the data
    const parsedDataWithSuccess = requiredBody.safeParse(req.body);
    if(!parsedDataWithSuccess.success){
        res.json({
            message : "Incorrect formate"
        })
        return 
    }
    const email = req.body.email;
    const password = req.body.password;
    const name = req.body.name;
//should use try and catch block for their user is already exist
    const hashedPassword = await bcrypt.hash(password,5);
    console.log(hashedPassword);

    await UserModel.create({
        email:email,
        password:hashedPassword,
        //salt : salt,
        name:name
    })

    res.json({
        message:"you are logged in"
    });
});

app.post("/signin",async(req,res)=>{
    const email = req.body.email;
    const password = req.body.password;

    //find the unique one (it may takes time so we await it)
    const response = await UserModel.findOne({
        email:email,
        
    });
    if(!response){
        res.status(403).json({
            message: "User does not match"
        })
        return 
    }

    const passwordMatch =await  bcrypt.compare(password, response.password)
    if(passwordMatch){
        //create the token for them
        const token =jwt.sign({
            id:response._id.toString()
        },JWT_SECRET);
        res.json({
            token: token
        });

    }else{
        res.status(430).send({
            message:"invalid email or password"
        });
    }
})

//creating the auth middleware
function authmiddleware(req, res, next){
    const token = req.headers.token;
    const decodedata =  jwt.verify(token,JWT_SECRET);
    if(decodedata){
        req.userId = decodedata.id;
        next();
    }else{
        res.status(401).json({
            message:"Incorrect credentials"
        });
    }
}

app.post("/todo",authmiddleware,(req,res)=>{
    const userId = req.userId;
    const title = req.body.title;
    TodoModel.create({
        title,
        userId
    });
    res.json({
        userId: userId
    });
})

app.get("/todos",authmiddleware,async (req,res)=>{
    const userId = req.userId;
    const todo = await TodoModel.find({
        userId:userId
    });
    res.json({
        todo:todo,
        // title : TodoModel.title
    });
})

app.listen(3000);