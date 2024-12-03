const User = require("../models/user.js");
 

// Sign-Up Route (page)
module.exports.renderSignupForm = (req, res)=>{
    res.render("users/signup.ejs");
};

module.exports.Signup = async(req, res)=>{
    try{
        let {username , email , password} = req.body;
        const newUser = new User({email , username});
        const registerUser = await User.register(newUser , password);
        console.log(registerUser);
        req.login(registerUser, (err) => {
            if(err) {
                return next(err);
            }
            req.flash("success" , "Welcome to Wanderlust!"); 
            res.redirect("/listings");
        })
    }
    catch(err){
       req.flash("error" , err.message);
       res.redirect("/signup");
    }   
}


// Log-in Route (page)

module.exports.renderLoginForm =  (req, res) =>{
    res.render("users/login.ejs")
}

module.exports.Login =  async(req, res) =>{
    req.flash("success","Welcome back Wanderlust!"); 
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
}


// Logout Route (page)
module.exports.Logout = (req, res , next) =>{
    req.logout((err) =>{
        if(err) {
           return next(err);
        }
        req.flash("success" , "You are logged out now!");
        res.redirect("/listings");
    })
}