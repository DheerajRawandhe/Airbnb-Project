const Review = require("../models/review.js");
const Listing = require("../models/listing.js");

//Post review route
module.exports.createReview = async (req, res) =>{
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    req.flash("success" , "New Review Created!");
    res.redirect(`/listings/${listing._id}`);
  }

  
/*  Reviews(Delete Route)  */
module.exports.reviewDelete = async(req, res) =>{
    let { id , reviewId} = req.params;
    await Listing.findByIdAndUpdate(id, {$pull : {reviews : reviewId}})
    await Review.findByIdAndDelete(reviewId);
    req.flash("success" , "review Deleted!");
    res.redirect(`/listings/${id}`);
  }