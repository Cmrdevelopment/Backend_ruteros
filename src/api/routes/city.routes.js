const { isAuth } = require("../../middleware/auth.middleware");
const { upload } = require("../../middleware/files.middleware");
const {
  createCity,
  addInterestedCityToUser,
  toggleInterestedCityToUser,

  
  getCityFollowingStatus,
  getAll,
  getById,
  getByCityName,
  updateCity,
  deleteCity,

} = require("../controllers/city.controller");

const express = require("express");
const CityRoutes = express.Router();

CityRoutes.get("/", getAll);
CityRoutes.get("/:id", getById);
CityRoutes.patch(  "/updateCity/:id",  [isAuth],  upload.single("image"),  updateCity);
CityRoutes.post("/createCity", [isAuth], upload.single("image"), createCity);
CityRoutes.post(  "/addInterestedCityToUser",  [isAuth],  upload.single("image"),  addInterestedCityToUser);
CityRoutes.post(  "/toggleInterestedCityToUser/:id",  [isAuth],  toggleInterestedCityToUser);
CityRoutes.delete("/deleteCity/:id", deleteCity);
CityRoutes.get("/cityFollowingStatus/:id", [isAuth], getCityFollowingStatus);



module.exports = CityRoutes;
