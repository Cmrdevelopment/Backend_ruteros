const { isAuth } = require("../../middleware/auth.middleware");
const { upload } = require("../../middleware/files.middleware");
const {
  createCity,
  addInterestedCityToUser,
  toggleInterestedCityToUser,

  
  getOfferFollowingStatus,
  updateOffer,
  getAll,
  getById,
  deleteOffer,
} = require("../controllers/city.controller");

const express = require("express");
const CityRoutes = express.Router();

// OfferRoutes.get("/", getAll);
// OfferRoutes.get("/:id", getById);

// OfferRoutes.patch(
//   "/updateOffer/:id",
//   [isAuth],
//   upload.single("image"),
//   updateOffer
// );


CityRoutes.post("/createCity", [isAuth], upload.single("image"), createCity);


CityRoutes.post(
  "/addInterestedCityToUser",
  [isAuth],
  upload.single("image"),
  addInterestedCityToUser
);

CityRoutes.post(
  "/toggleInterestedCityToUser/:id",
  [isAuth],
  toggleInterestedCityToUser
);


// OfferRoutes.get("/offerFollowingStatus/:id", [isAuth], getOfferFollowingStatus);
// OfferRoutes.delete("/deleteOffer/:id", deleteOffer);


module.exports = CityRoutes;
