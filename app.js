if(process.env.NODE_ENV != "production"){
  require('dotenv').config()
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const port = 4006;  
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate"); 
const ExpressError  = require("./utils/ExpressError.js");
const Review = require("./models/review.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require('connect-flash'); 
const passport = require("passport");
const LocalStrategy = require("passport-local"); 
const User = require("./models/user.js");



const listingsRouter = require("./routes/listing.js");
const reviewsRouter  = require("./routes/review.js");
const userRouter  = require("./routes/user.js");


const dbUrl = process.env.ATLASDB_URL;

main()
  .then(() => {
    console.log("connected to DataBase");
  })
  .catch((err) => {
    console.log(err);
  });



async function main() {
  // await mongoose.connect(MONGO_URL); 
  await mongoose.connect(dbUrl); 

}


const store = MongoStore.create({
  mongoUrl: dbUrl,
    crypto: {
      secret:process.env.SECRET
    },
    touchAfter: 24 * 3600,
});


store.on("error" , () =>{
  console.log("ERROR in MONGO SESSION STORE" , err);
});


const sessionOptions = {
  store,
  secret:process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie : {
    expires : Date.now() + 7 * 24 * 60 *60 * 1000,
    maxAge :  7 * 24 * 60 *60 * 1000,
    httpOnly : true,
  }
};

// app.get("/", (req, res) => {
//   res.send("Hi, I am root!!");
// });




app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) =>{
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});


/* ======= User SignUp(info) =======

app.get("/demouser", async (req, res) =>{
  let fakeUser = new User({
    email : "Dheeraj@gmail.com",
    username : "Dheeraj",
  });

  let registerUser = await User.register(fakeUser, "helloworld");
  res.send(registerUser);
});
      */


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));
app.engine('ejs', ejsMate); // Ejs-Mate --------


/*====== Router Folder (Required) ========> */
app.use("/listings" , listingsRouter);
app.use("/listings/:id/reviews" , reviewsRouter);
app.use("/" , userRouter);


app.get("/", (req, res) => {
  res.send("Hi, I am root!!");
});


/* ExpressError(404, "Page Not Found") ============> */
app.all("*" ,(req, res, next) =>{
  next(new ExpressError(404, "Page Not Found!"));
});


app.use((err, req, res, next) =>{
  let {statusCode = 500, message = "Somthing went wrong!"} = err;
  res.status(statusCode).render("listings/error.ejs", {message});
  // res.status(statusCode).send(message);
});


app.listen(port, () => {
  console.log(`server is listening to port ${port}`);
});
