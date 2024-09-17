const express = require("express");
const jwt = require("jsonwebtoken");
const app = express();
const bodyParser = require('body-parser');
const path = require("path");
const { errorMonitor } = require("events");
app.use(bodyParser.json());  

//serve the static files (css,js)
app.use(express.static(__dirname));

const users_data = [];
//jwt secret variable create
const JWT_SECRET =  "mysecrettoken";

//creating the authMiddleware
function authMiddleware(req, res, next) {
    // const authHeader = req.headers.authorization;

    // if (!authHeader) {
    //     return res.status(401).send({ message: "No token provided" });
    // }

    // const token = authHeader.split(" ")[1];
    // try{
    //     const decodetokendata =jwt.verify(token,JWT_SECRET);
    //     const user = users_data.find(user => user.username===decodetokendata.username);

    //     if(!user){
    //         res.send({
    //             message: "Unauthorized user"
    //         });
    //         req.user = user;
    //         next();
    //     }
    // }
    // catch(error){
    //     res.status(401).send({message:"unauthorized user",
    //         error: error.message
    //     });
    // }

    const token = req.headers.token;
    const decodetokendata = jwt.verify(token, JWT_SECRET);
    if(decodetokendata.username){
        req.username = decodetokendata.username;
        next();
    }else{
        res.json({
            message: "you are not logged in "
        });
    }
}

app.get("/",(req,res)=>{
    res.sendFile(path.join(__dirname, "index.html"));
});

app.post("/signup", (req,res)=>{
    const username = req.body.username;
    const password = req.body.password;

    //PUSING THE USER DATA IN ARRAY
    users_data.push({
        username:username,
        password:password
    })
    res.send({message:"user created successfully"});
})

app.post("/signin", (req,res)=>{
    const username = req.body.username;
    const password = req.body.password;
    //multiple time login so find the user
    const user = users_data.find(user => user.username===username && user.password ===password);
    //using the jwt sign creating the token
    if(user){
        const token = jwt.sign({username:username},JWT_SECRET)
        res.send({
            token : token
        })
    }else{
        res.status(401).send({message:"invalid username or password"})
    }

})
//using the middleware

app.get("/me", authMiddleware,(req,res)=>{
    let foundUser = null;
    for(let i = 0; i<users_data.length;i++){
        if(users_data[i].username === req.username){
            foundUser = users_data[i];
        }
    }
    res.json({
        username:foundUser.username
    })
})
app.listen(3000);