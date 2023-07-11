const { isAuth } = require("../../middleware/auth.middleware");
const { upload } = require("../../middleware/files.middleware");
const {
  createOffer,
  addInterestedOfferToUser,
  toggleInterestedOfferToUser,
  getOfferFollowingStatus,
  updateOffer,
  getAll,
  getById,
  deleteOffer,
} = require("../controllers/offer.controller");

const express = require("express");
const OfferRoutes = express.Router();

OfferRoutes.get("/", getAll);
OfferRoutes.get("/:id", getById);
//OfferRoutes.post('/createOffer', upload.single('image'), createOffer);
//OfferRoutes.put("/:id", updateOffer);
OfferRoutes.patch(
  "/updateOffer/:id",
  [isAuth],
  upload.single("image"),
  updateOffer
);
OfferRoutes.post("/createOffer", [isAuth], upload.single("image"), createOffer);
OfferRoutes.post(
  "/addInterestedOfferToUser",
  [isAuth],
  upload.single("image"),
  addInterestedOfferToUser
);
OfferRoutes.post(
  "/toggleInterestedOfferToUser/:id",
  [isAuth],
  toggleInterestedOfferToUser
);
OfferRoutes.get("/offerFollowingStatus/:id", [isAuth], getOfferFollowingStatus);
OfferRoutes.delete("/deleteOffer/:id", deleteOffer);

// OfferRoutes.delete('/:id', deleteOffer);

module.exports = OfferRoutes;
