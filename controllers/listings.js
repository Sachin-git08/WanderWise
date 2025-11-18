module.exports.createListing = async (req, res, next) => {
  try {
    const newListing = new Listing(req.body.listing);

    // Geocode using OpenStreetMap
    console.log("📍 Searching coordinates for:", req.body.listing.location);
    const geometry = await forwardGeocode(req.body.listing.location);

    newListing.geometry = geometry;

    // Image upload
    if (req.file) {
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

    // Owner
    newListing.owner = req.user._id;

    // Save listing
    await newListing.save();
    console.log("Listing saved successfully:", newListing);

    req.flash("success", "New Listing Created!");
    res.redirect(`/listings/${newListing._id}`);

  } catch (err) {
    console.error("Error creating listing:", err);
    req.flash("error", `Failed to create listing. Reason: ${err.message}`);
    res.redirect("/listings");
  }
};
