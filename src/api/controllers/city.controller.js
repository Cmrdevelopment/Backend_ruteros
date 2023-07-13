const User = require("../models/user.model");

//const Ratings = require("../models/ratings.model");

const Comment = require("../models/comment.model");

const { OfferErrors } = require("../../helpers/jsonResponseMsgs");

const { deleteImgCloudinary } = require("../../middleware/files.middleware");


const CityRoute = require("../models/cityRoutes.model");

const Offer = require("../models/offer.model"); // este se debe borrar ya que los sustituye CityRoute




//! -----------------------------------------------------------------------
//? -------------------------------CREATE CITY ---------------------------------
//! -----------------------------------------------------------------------
const createCity = async (req, res, next) => {
  try {

    const cityBody = {

      owner: req.user._id,
      city: req.body.city,
      difficulty: req.body.difficulty,
      routeName: req.body.routeName,    
      routeDistance: req.body.routeDistance,
      routeDuration: req.body.routeDuration,
      descriptionGeneral: req.body.descriptionGeneral,
      routeLocation: req.body.routeLocation,      
      itemsToCarry: req.body.itemsToCarry,
      routeState: req.body.routeState,
    };

    const newCity = new CityRoute(cityBody);
    try {
      if (req.file) {
        newCity.image = req.file.path;
      } else {
        newCity.image = "https://res.cloudinary.com/dxpdntpqm/image/upload/v1689155185/Imagen_general_base_city_tvs85z.png";


      }
    } catch (error) {
      return res.status(404).json("Error creating city");
    }
   
    try {
      // aqui guardamos en la base de datos
      const savedCity = await newCity.save();
      if (savedCity) {
        // ahora lo que tenemos que guardar el id en el array de city de quien lo creo
        try {
          await User.findByIdAndUpdate(req.user._id, {
            $push: { citysCreated: newCity._id },
          });
          return res.status(200).json(savedCity);
        } catch (error) {
          return res.status(404).json("error updating user city");
        }
      } else {
        return res.status(404).json("Error creating city");
      }
    } catch (error) {

      return res.status(404).json("error saving city");
    }
  } catch (error) {
    next(error);
    return res.status(500).json(error.message);
  }
};

// Añadir oferta al usiario logueado, si está interesado en la oferta
// Agregar ciudad al usuario, si está interesado en esta ciudad
// Cuando el usuario hace clic en el botón "Me gusta oferta/seguir city" (o algo así)
const addInterestedCityToUser = async (req, res, next) => {
  try {
    const cityBody = {
      owner: req.user._id,
      city: req.body.city,
      difficulty: req.body.difficulty,
      routeName: req.body.routeName,
      routeDistance: req.body.routeDistance,
      routeDuration: req.body.routeDuration,
      descriptionGeneral: req.body.descriptionGeneral,
      routeLocation: req.body.routeLocation,      
      itemsToCarry: req.body.itemsToCarry,
      routeState: req.body.routeState,
    };

    const newCity = new City(cityBody);

    try {
      // aqui guardamos en la base de datos
      const savedCity = await newCity.save();
      if (savedCity) {
        // ahora lo que tenemos que guardar el id en el array de city de quien lo creo
        try {
          await User.findByIdAndUpdate(req.user._id, {
            $push: { citysInterested: newCity._id },
          });
          return res.status(200).json(savedCity);
        } catch (error) {
          return res.status(404).json("error updating user city");
        }
      } else {
        return res.status(404).json("Error creating city");
      }
    } catch (error) {
      return res.status(404).json("error saving city");
    }
  } catch (error) {
    next(error);
    return res.status(500).json(error.message);
  }
};

//! ---------------------------------------------------------------------
//? ------------ Toggle Interested City To User ------------------------
//! ---------------------------------------------------------------------
const toggleInterestedCityToUser = async (req, res, next) => {
  try {
    const cityId = req.params.id;
    const userId = req.user._id;

    const city = await CityRoute.findById(cityId);
    const user = await User.findById(userId);

    if (!city || !user) {
      return res.status(404).json("User or city not found");
    }

    const cityInUserCitysInterestedArray = await User.findOne({
      _id: userId,
      citysInterested: cityId,
    });

    if (!cityInUserCitysInterestedArray) {
      await User.findByIdAndUpdate(userId, {
        $push: { citysInterested: cityId },
      });
      await CityRoute.findByIdAndUpdate(cityId, {
        $push: { interestedUsers: userId },
      });
      return res
        .status(200)
        .json("City added to user's citysInterested array");
    } else {
      await User.findByIdAndUpdate(userId, {
        $pull: { citysInterested: cityId },
      });
      await CityRoute.findByIdAndUpdate(cityId, {
        $pull: { interestedUsers: userId },
      });
      return res
        .status(200)
        .json("City removed from user's citysInterested array");
    }
  } catch (error) {
    next(error);
    return res.status(500).json(error.message);
  }
};

//! -----------------------------------------------------------------------------
//? --------------- GET CITY FOLLOWING STATUS -------------------------
//! -----------------------------------------------------------------------------
const getCityFollowingStatus = async (req, res, next) => {
  try {
    // ID de la oferta a seguir por parte del usuario logueado.
    const { id } = req.params;

    // ID del usuario logueado.
    const { _id } = req.user._id;

    const cityId = id;
    const logerUserId = _id;

    const logedUser = await User.findById(logerUserId);

    if (!logedUser) {
      return res.status(404).json({ error: "Loged user not found" });
    }

    const cityToFollow = await Offer.findById(cityId);

    if (!cityToFollow) {
      return res
        .status(404)
        .json({ error: "City to follow by loged user not found" });
    }

    const isCityInCitysInterestedArr = logedUser.citysInterested.find(
      (user) => user._id.toString() === cityId
    );

    if (isCityInCitysInterestedArr === undefined) {
      // La oferta a seguir no está en el array 'offersInterested',
      // reportamos que la oferta no está en el array.
      return res.status(200).json({
        status: "City is Not in user's citysInterested arr",
      });
    } else {
      // La oferta a seguir está en el array 'offersInterested',
      // por lo tanto reportamos al front que la
      // oferta en la que está ineresado el user está
      // en el array offersInterested.
      return res.status(200).json({
        status: "City is in user's citysInterested arr",
      });
    }
  } catch (error) {
    return next(error);
  }
};

//! ---------------------------------------------------------------------
//? ------------------------------GET ALL CITYS --------------------------
//! ---------------------------------------------------------------------

const getAll = async (req, res, next) => {
  try {
    const Citys = await Offer.find()
      .populate("owner")
      .populate("comments")
      .populate("ratings")
      .populate("interestedUsers");

    if (Offers) {
      return res.status(200).json(Offers);
    } else {
      return res.status(404).json(OfferErrors.FAIL_SEARCHING_OFFER);
    }
  } catch (error) {
    return next(error);
  }
};

//! ---------------------------------------------------------------------
//? ------------------------------GETBYID -------------------------------
//! ---------------------------------------------------------------------
const getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const offerById = await Offer.findById(id)
      .populate("owner")
      .populate("comments")
      .populate("ratings")
      .populate("interestedUsers");
    if (offerById) {
      return res.status(200).json(offerById);
    } else {
      return res.status(404).json(OfferErrors.FAIL_SEARCHING_OFFER_BY_ID);
    }
  } catch (error) {
    return next(error);
  }
};

//! ---------------------------------------------------------------------
//? ----------------------------- GET BY OFFERNAME ------------------------
//! ---------------------------------------------------------------------
//Pregunta para quien lo revise: ¿Tiene que haber aquí también un .populate?
const getByOfferName = async (req, res, next) => {
  try {
    const { offerName } = req.params;

    const OfferNameByName = await Offer.find({ offerName });

    if (OfferNameByName) {
      return res.status(200).json(OfferNameByName);
    } else {
      return res.status(404).json(OfferErrors.FAIL_SEARCHING_OFFER_BY_NAME);
    }
  } catch (error) {
    return next(error);
  }
};

//! -------------------------------------------------------------------
//? ----------------------------- UPDATE --------------------------------
//! ---------------------------------------------------------------------
//Revisar filterbody. Pregunta a quien revise esto: ¿Se puede meter por filterbody un valor cuyo required sea 'true'? ¿O dará problemas? En caso de problemas, revisar esto.
const updateOffer = async (req, res, next) => {
  try {
    let newImage;

    if (req.file) {
      newImage = req.file.path;
    } else {
      newImage = "https://pic.onlinewebfonts.com/svg/img_181369.png";
    }

    const filterBody = {
      offerType: req.body.offerType,
      annualSalary: req.body.annualSalary,
      description: req.body.description,
      city: req.body.city,
      jobType: req.body.jobType,
      technologies: req.body.technologies,
      experienceYears: req.body.experienceYears,
      image: newImage,
      offerState: req.body.offerState,
    };

    const { id } = req.params;

    const offerById = await Offer.findById(id);
    if (offerById) {
      const patchOffer = new Offer(filterBody);
      patchOffer._id = id;
      await Offer.findByIdAndUpdate(id, patchOffer); // Guardar los cambios en la base de datos
      return res.status(200).json(await Offer.findById(id)); // Responder con el objeto actualizado
    } else {
      return res.status(404).json(OfferErrors.FAIL_UPDATING_OFFER);
    }
  } catch (error) {
    return next(error);
  }
};

//! -----------------------------------------------------------------------
//? -------------------------------DELETE OFFER ---------------------------------
//! -----------------------------------------------------------------------
const deleteOffer = async (req, res, next) => {
  console.log("deleteOffer: =>", deleteOffer);

  try {
    const { id } = req.params;
    const deletedOffer = await Offer.findByIdAndDelete(id);
    console.log("deletedOffer: =>", deletedOffer);
    if (deletedOffer) {
      if (await Offer.findById(id)) {
        return res.status(404).json("failed deleting");
      } else {
        if (deletedOffer.image) {
          console.log("image Existe");

          deleteImgCloudinary(deletedOffer.image);
        } else {
          console.log("image NO existe");
        }
        // deleteImgCloudinary(deletedOffer.image);

        try {
          await User.updateMany(
            { citysCreated: id },
            {
              $pull: { citysCreated: id },
            }
          );

          try {
            await User.updateMany(
              { citysCreated: id },
              {
                $pull: { offersInterested: id },
              }
            );

            try {
              // lo que queremos es borrar todos los comentarios de esta oferta priva
              await Comment.deleteMany({ offerPrivates: id });

              /// por ultimo lanzamos un test en el runtime para ver si se ha borrado la review correctamente
              return res.status(200).json({
                deletedObject: deletedOffer,
                test: (await Offer.findById(id))
                  ? "fail deleting offer"
                  : "success deleting offer",
              });
            } catch (error) {
              return res
                .status(404)
                .json("failed updating user offersInterested");
            }
          } catch (error) {
            return res
              .status(404)
              .json("failed updating user offersInterested");
          }
        } catch (error) {
          return res.status(404).json("failed updating user citysCreated");
        }
      }
    } else {
      return res.status(404).json({ message: "Fail deleting offer" });
    }
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  createCity,
  addInterestedCityToUser,
  toggleInterestedCityToUser,
  getCityFollowingStatus,


 

  getAll,
  getById,
  getByOfferName,
  updateOffer,
  deleteOffer,
};
