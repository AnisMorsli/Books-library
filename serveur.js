const express = require('express')
const app = express()
const ejs = require('ejs')
const port = 3001
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
// for password to be crypted so it will be secured and then stored in database
const bcrypt = require('bcryptjs');
//session 
const session = require('express-session')
// mongoose schema import 
const Users = require('./models/Users');
// connection to mongodb cloud database 
// user database
mongoose.connect('mongodb+srv://...@cluster0.lcivg.mongodb.net/?retryWrites=true&w=majority' ,()=>{
    console.log('dabatabe conected')
},
e => console.error(e)
);
// books database
// upcoming

//session configuration
app.set('trust proxy', 1)
app.use(session({
    secret : 'zizouman', //need to be crypted and then stored in database ('need to work on that')
    resave : false,
    saveUninitialized : false
}))

//function to check if the session is active and the user has loged in , need to do the call back on every page that need login access
const isAuth = async (req,res,next)=>{
    try{
        if(req.session.isAuth){
            console.log('user checked again')
            
            // next must have () at the end => 3 days to unbuged this PS ,i hate my life x)
            next()
        }else {
            console.log('need to be auth before!')
            res.status(401).redirect('/login')
        }
    }catch(err){
        console.log(err)
    }
} 
const logcheker = async (req,res,next)=>{
    try{
        if(req.session.isAuth){
            console.log('user checked again 2')
            const {clear} = 1 
            next()
        }else next()
    }catch(err){
        console.log(err)
    }
}
// body-parser
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({extended: true}));
// set the engine ejs
app.set('view engine', 'ejs')
// create the public folder that will include the css,js,img 
app.use(express.static(__dirname+'/public'));


// render every page :
app.get('/',async (req,res) =>{
    try{if(req.session.isAuth){
        const {id} = {id : req.session.isAuth}
        const usercheck = await Users.findOne({id})
        const user = {}
        user.id = id
        user.username = usercheck.username
        console.log(user)
        res.status(200).render('home', {user : user})
    } else {
        const user = false
        res.status(200).render('home', {user : user})
    } 
}catch(err){
    console.log(err)
}
})
app.get('/register',(req,res) =>{
    res.status(200).render('register')
})
app.get('/bookslist',async(req,res) =>{
    try{if(req.session.isAuth){
        const {id} = {id : req.session.isAuth}
        const usercheck = await Users.findOne({id})
        const user = {}
        user.id = id
        user.username = usercheck.username
        console.log(user)
        res.status(200).render('bookslist', {user : user })
    } else {
        const user = false
        res.status(200).render('bookslist', {user : user})
    } 
}catch(err){
    console.log(err)
}
})
app.get('/addbook',isAuth,async(req,res) =>{
    try{if(req.session.isAuth){
        const {id} = {id : req.session.isAuth}
        const usercheck = await Users.findOne({id})
        const user = {}
        user.id = id
        user.username = usercheck.username
        console.log(user)
        res.status(200).render('addbook', {user : user})
    } else {
        const user = false
        res.status(200).render('addbook', {user : user})
    } 
}catch(err){
    console.log(err)
}
})
app.get('/login',(req,res) =>{
    res.status(200).render('login')
})





// create a new account 
app.post('/register', async(req,res) =>{
    console.log(req.body)
    try{
        const {username,firstname,lastname,email,pass} = req.body
    const user = await Users.findOne({email})
    if(user){
        return res.status(400).json(0) // need to set the .status if an error happen
    }
    // variable to store the crypted password ('more documentation needed about bcrypt')
    const passcrypt = await bcrypt.hash(pass, 12)
    new_user = new Users({
        username,
        firstname,
        lastname,
        email,
        pass : passcrypt
    })
    new_user.save().then(()=>{
        console.log('users added')
        // this shit need a respose so axios continue doing his work and excute .then and to do is we need .res.json('something')
        res.status(200).json(1)
        
    } )
    }catch(err){
        return err.message 
    }
    
    
})

//login
app.post('/login', async (req,res)  =>{
    try{
        const {email , pass} = req.body
    console.log(req.body)
    // need to call the schema variable set up there in variable section 
    const user = await Users.findOne({email})
    console.log(user)
    // if the user don't exist redirect to login again it need to return also status so u can use it as an error to set it to the user that need to see the error ('need more work')
    if (!user){
        console.log("email don't match")
        return res.status(404).json('0')
    }
    // it compare the pass of the input and the the pass of the user variable jsut above that same user that we found using the .findOne function ^^ 
    const matchPass = await bcrypt.compare(pass, user.pass)
    if(!matchPass){
        console.log("pass don't match")
        return res.status(406).json('0')
    }
    if(user && matchPass){
        req.session.isAuth = user.id;
        console.log("user checked")
        return res.status(200).json({ID : user.id})
    }
    }catch(err){
        console.log(err)
    }
})
//render every userdashbord with every information on it
    app.get('/userdashbord/:id', isAuth ,async (req,res) =>{
        const {id} = {id : req.session.isAuth}
        const user = await Users.findOne({id})
        console.log(user)
        if(user && user.id == req.params.id){
            res.status(200).render('userdashbord', {user : user})
        }else res.status(404).send('user not found')
    })
// render every book page alone, contain every details about the that book  
// not functioning at the moment
app.get('/book/:bookid', function (req, res){
    if(req.params.bookid == 1 ){
        res.send(req.params)
    } else res.send(`book not found !`)
})

//setting up the logout btn session end
app.post('/logout',(req,res)=>{
    req.session.destroy()
    res.status(200).json('Logout')
})
//serveur up function, port 3001, it's a const var ^^
app.listen(port,()=>{
    console.log(`serveur up on port : ${port}` )
})
