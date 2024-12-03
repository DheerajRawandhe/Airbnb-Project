const { model } = require("mongoose");
const Listing = require("../models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/styles');   // Mapbox (Geocoding) 
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });


// Index Route
module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
}

// New Route
module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
}

// Show Route
module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
      .populate({
        path : "reviews" ,
        populate : {
          path : "author",
       },
      })
      .populate("owner"); 
    if(!listing) {
      req.flash("error" , "Listing you requested for does not exist!");
      res.redirect("/listings");
    }
    // console.log(listing);
    res.render("listings/show.ejs", { listing });
  }


// Create Route
module.exports.createListing =  async(req, res, next) => {
  //  let response = await geocodingClient.forwardGeocode({      // Mapbox (Geocoding)
  //     query: req.body.listing.location,
  //     limit: 1,
  //   })
  //   .send();

 
    let url = req.file.path;
    let filename = req.file.filename;
   
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url , filename };
 
    // newListing.geometry = response.body.features[0].geometry;    // Mapbox (Geocoding)

    await newListing.save();
    req.flash("success" , "New Listing Created");
    res.redirect("/listings");
}


// Edit Route
module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing) {
      req.flash("error" , "Listing you requested for does not exist!");
      res.redirect("/listings");
    }

    let originalImgUrl = listing.image.url;
    originalImgUrl = originalImgUrl.replace("/upload","/upload/w_250");
    res.render("listings/edit.ejs", { listing , originalImgUrl });
}

// Update Route  
module.exports.Updatelisting = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    if(typeof req.file !== "undefined") {
      let url = req.file.path;
      let filename = req.file.filename;
      listing.image = { url, filename };
      await listing.save();
    }

    req.flash("success" , "Listing Upadated!");
    res.redirect(`/listings/${id}`);
}


//Delete Route
module.exports.DeleteListing = async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success" , "Listing Deleted!");
    res.redirect("/listings");
  }
