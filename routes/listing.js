const express = require("express");
const router = express.Router({ mergeParams : true });
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const {isLoggedIn, isOwner , validateListing} = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer  = require('multer');
const { storage }  = require('../cloudConfig.js');
const upload = multer({ storage });



// Index Route & Create Route
router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(
    isLoggedIn ,
    upload.single('listing[image]'),
    validateListing,
    wrapAsync(listingController.createListing)
  );

//New Route
  router.get("/new",
    isLoggedIn , listingController.renderNewForm);

// Show & Update and Delete Route 
router
  .route("/:id")
  .get(wrapAsync(listingController.showListing))
  .put(isLoggedIn ,
    isOwner,
    upload.single('listing[image]'),
    validateListing ,
    wrapAsync(listingController.Updatelisting)
  )
  .delete(isLoggedIn , isOwner,
    wrapAsync(listingController.DeleteListing));
    

//Edit Route
  router.get("/:id/edit",isLoggedIn, isOwner,
     wrapAsync(listingController.renderEditForm));
  
   
module.exports = router;