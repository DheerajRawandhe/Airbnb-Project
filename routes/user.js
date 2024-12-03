const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { route } = require("./listing.js");
const { saveRedirectUrl } = require("../middleware.js");
const userControllere = require("../controllers/users.js");


// Sign-Up Route(page)
router
    .route("/signup")
    .get(userControllere.renderSignupForm)
    .post(wrapAsync(userControllere.Signup));
    

// Login Route(page) 
router
    .route("/login")
    .get(userControllere.renderLoginForm)
    .post(saveRedirectUrl,
        passport.authenticate("local", {
        failureRedirect: '/login',
        failureFlash : true }) ,
        userControllere.Login
);
    
// LogOut Route (page)
router.get("/logout",userControllere.Logout);


module.exports = router;
  

