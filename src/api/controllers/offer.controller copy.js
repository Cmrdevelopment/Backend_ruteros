const User = require("../models/user.model");
//const Ratings = require("../models/ratings.model");
const Comment = require("../models/comment.model");
const Offer = require("../models/offer.model");
const { OfferErrors } = require("../../helpers/jsonResponseMsgs");
const { deleteImgCloudinary } = require("../../middleware/files.middleware");

//! -----------------------------------------------------------------------
//? -------------------------------CREATE OFFER ---------------------------------
//! -----------------------------------------------------------------------
const createOffer = async (req, res, next) => {
  try {
    // const arrayTechnology = req.body.technologies.split(",");

    const offerBody = {
      offerTitle: req.body.offerTitle,
      offerType: req.body.offerType,
      experienceYears: req.body.experienceYears,
      annualSalary: req.body.annualSalary,
      descriptionGeneral: req.body.descriptionGeneral,
      descriptionResponsabilities: req.body.descriptionResponsabilities,
      descriptionRequires: req.body.descriptionRequires,
      descriptionSalary: req.body.descriptionSalary,
      city: req.body.city,
      jobType: req.body.jobType,
      technologies: req.body.technologies,
      offerState: req.body.offerState,
      owner: req.user._id,
    };

    const newOffer = new Offer(offerBody);
    console.log(offerBody);
    console.log(req.body);
    try {
      if (req.file) {
        newOffer.image = req.file.path;
      } else {
        newOffer.image = "https://pic.onlinewebfonts.com/svg/img_181369.png";
      }
    } catch (error) {
      return res.status(404).json("Error creating offer");
    }

    try {
      // aqui guardamos en la base de datos
      const savedOffer = await newOffer.save();
      if (savedOffer) {
        // ahora lo que tenemos que guardar el id en el array de offer de quien lo creo
        try {
          await User.findByIdAndUpdate(req.user._id, {
            $push: { offersCreated: newOffer._id },
          });
          return res.status(200).json(savedOffer);
        } catch (error) {
          return res.status(404).json("error updating user offer");
        }
      } else {
        return res.status(404).json("Error creating offer");
      }
    } catch (error) {
      return res.status(404).json("error saving offer");
    }
  } catch (error) {
    next(error);
    return res.status(500).json(error.message);
  }
};

// Añadir oferta al usiario logueado, si está interesado en la oferta
// Add offer to user, if he/she is interested in this offer
// When the user clickes the button "Like offer/follow offer" (or something like this)
const addInterestedOfferToUser = async (req, res, next) => {
  try {
    const offerBody = {
      offerTitle: req.body.offerTitle,
      offerType: req.body.offerType,
      experienceYears: req.body.experienceYears,
      annualSalary: req.body.annualSalary,
      description: req.body.description,
      city: req.body.city,
      jobType: req.body.jobType,
      technologies: req.body.technologies,
      offerState: req.body.offerState,
    };

    const newOffer = new Offer(offerBody);

    try {
      // aqui guardamos en la base de datos
      const savedOffer = await newOffer.save();
      if (savedOffer) {
        // ahora lo que tenemos que guardar el id en el array de offer de quien lo creo
        try {
          await User.findByIdAndUpdate(req.user._id, {
            $push: { offersInterested: newOffer._id },
          });
          return res.status(200).json(savedOffer);
        } catch (error) {
          return res.status(404).json("error updating user offer");
        }
      } else {
        return res.status(404).json("Error creating offer");
      }
    } catch (error) {
      return res.status(404).json("error saving offer");
    }
  } catch (error) {
    next(error);
    return res.status(500).json(error.message);
  }
};

//! ---------------------------------------------------------------------
//? ------------ Toggle Interested Offer To User ------------------------
//! ---------------------------------------------------------------------
const toggleInterestedOfferToUser = async (req, res, next) => {
  try {
    const offerId = req.params.id;
    const userId = req.user._id;

    const offer = await Offer.findById(offerId);
    const user = await User.findById(userId);

    if (!offer || !user) {
      return res.status(404).json("User or offer not found");
    }

    const offerInUserOffersInterestedArray = await User.findOne({
      _id: userId,
      offersInterested: offerId,
    });

    if (!offerInUserOffersInterestedArray) {
      await User.findByIdAndUpdate(userId, {
        $push: { offersInterested: offerId },
      });
      await Offer.findByIdAndUpdate(offerId, {
        $push: { interestedUsers: userId },
      });
      return res
        .status(200)
        .json("Offer added to user's offersInterested array");
    } else {
      await User.findByIdAndUpdate(userId, {
        $pull: { offersInterested: offerId },
      });
      await Offer.findByIdAndUpdate(offerId, {
        $pull: { interestedUsers: userId },
      });
      return res
        .status(200)
        .json("Offer removed from user's offersInterested array");
    }
  } catch (error) {
    next(error);
    return res.status(500).json(error.message);
  }
};

//! -----------------------------------------------------------------------------
//? --------------- GET OFFER FOLLOWING STATUS -------------------------
//! -----------------------------------------------------------------------------
const getOfferFollowingStatus = async (req, res, next) => {
  try {
    // ID de la oferta a seguir por parte del usuario logueado.
    const { id } = req.params;

    // ID del usuario logueado.
    const { _id } = req.user._id;

    const offerId = id;
    const logerUserId = _id;

    const logedUser = await User.findById(logerUserId);

    if (!logedUser) {
      return res.status(404).json({ error: "Loged user not found" });
    }

    const offerToFollow = await Offer.findById(offerId);

    if (!offerToFollow) {
      return res
        .status(404)
        .json({ error: "Offer to follow by loged user not found" });
    }

    const isOfferInOffersInterestedArr = logedUser.offersInterested.find(
      (user) => user._id.toString() === offerId
    );

    if (isOfferInOffersInterestedArr === undefined) {
      // La oferta a seguir no está en el array 'offersInterested',
      // reportamos que la oferta no está en el array.
      return res.status(200).json({
        status: "Offer is Not in user's offersInterested arr",
      });
    } else {
      // La oferta a seguir está en el array 'offersInterested',
      // por lo tanto reportamos al front que la
      // oferta en la que está ineresado el user está
      // en el array offersInterested.
      return res.status(200).json({
        status: "Offer is in user's offersInterested arr",
      });
    }
  } catch (error) {
    return next(error);
  }
};

//! ---------------------------------------------------------------------
//? ------------------------------GET ALL OFFERS --------------------------
//! ---------------------------------------------------------------------

const getAll = async (req, res, next) => {
  try {
    const Offers = await Offer.find()
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
            { offersCreated: id },
            {
              $pull: { offersCreated: id },
            }
          );

          try {
            await User.updateMany(
              { offersCreated: id },
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
          return res.status(404).json("failed updating user offersCreated");
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
  createOffer,
  addInterestedOfferToUser,
  toggleInterestedOfferToUser,
  getOfferFollowingStatus,
  getAll,
  getById,
  getByOfferName,
  updateOffer,
  deleteOffer,
};
