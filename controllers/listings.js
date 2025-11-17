const Listing = require("../models/listing"); 
const { forwardGeocode } = require("../utils/geocode");


module.exports.index = async (req, res) => {
   const allListings = await Listing.find({});
        res.render("listings/index.ejs", {allListings});
    };

module.exports.renderNewForm = (req, res) =>{
      res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
  const {id} = req.params;
  const listing = await Listing.findById(id)
  .populate({
    path:"reviews",
  populate: {
    path: "author"
  }
  
  })
  .populate("owner");
  
  if(!listing) {
    req.flash("error", "Listing you requested for does not exist");
    return res.redirect("/listings");
  }
  console.log(listing);
  res.render("listings/show.ejs", { listing });
};

module.exports.createListing = async (req, res, next) => {
  try {
    // Step 1: Create new listing from form data
    const newListing = new Listing(req.body.listing);

    // Step 2: Get coordinates using OpenStreetMap (Nominatim)
    console.log("📍 Searching coordinates for:", req.body.listing.location);
    const response = await forwardGeocode(req.body.listing.location);

    // Step 3: Handle geocoding result
    if (response.body.features && response.body.features.length > 0) {
      const geometry = response.body.features[0].geometry;
      console.log("Coordinates found:", geometry);
      newListing.geometry = geometry;
    } else {
      console.warn("No coordinates found for:", req.body.listing.location);
      newListing.geometry = { type: "Point", coordinates: [0, 0] };
    }

    // Step 4: Handle image upload or fallback image
    if (req.file && req.file.path && req.file.filename) {
      newListing.image = {
        url: req.file.path,
        filename: req.file.filename
      };
    } else {
      newListing.image = {
        url: "https://res.cloudinary.com/demo/image/upload/v1699549950/default_image.jpg",
        filename: "default_image"
      };
    }

    // Step 5: Assign owner
    newListing.owner = req.user._id;

    // Step 6: Save to database
    await newListing.save();
    console.log("Listing saved successfully:", newListing);

    // Step 7: Redirect with success message
    req.flash("success", "New Listing Created!");
    res.redirect(`/listings/${newListing._id}`);

  } catch (err) {
    // Step 8: Error handling with full stack trace
    console.error("Error creating listing:", err.message);
    console.error("Full error stack:");
    console.error(err);
    req.flash("error", `Failed to create listing. Reason: ${err.message}`);
    res.redirect("/listings");
  }
};


module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "Listing you requested for does not exist!");
    return res.redirect("/listings");
  }

  let originalImageUrl = listing.image?.url || "";
  
  // Only resize if Cloudinary image
  if (originalImageUrl.includes("cloudinary.com")) {
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
  }

  res.render("listings/edit.ejs", { listing, originalImageUrl });
};


module.exports.updateListing = async (req, res) => {
 let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing});

  if(typeof req.file !== "undefined"){
  let url = req.file.path;
  let filename = req.file.filename;
  listing.image = {url, filename};
  await listing.save();
  }
         
  req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${id}`);  
}


module.exports.destroyListing = async (req, res) => {
     let {id} = req.params;
     let deletedListing = await Listing.findByIdAndDelete(id);
     console.log(deletedListing);
     req.flash("success", "Listing Deleted");
     res.redirect("/listings");
}
