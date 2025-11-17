const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderwise";

main()
  .then(() => console.log(" Connected to DB"))
  .catch((err) => console.log("Connection Error:", err));

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  await Listing.deleteMany({});
  console.log("Old data deleted");

  const defaultImage = {
    url: "https://images.unsplash.com/photo-1625505826533-5c80aca7d157?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
    filename: "listingImage",
  };

  const fixedData = initData.data.map((listing) => ({
    ...listing,
    image: listing.image && listing.image.url ? listing.image : defaultImage,
    owner: "690b784ad9ac000fcd6cede1",
  }));

  await Listing.insertMany(fixedData);
  console.log("Data was initialized successfully!");
};


initDB();
