const mongoose = require("mongoose");

const MountainRouteSchema = new mongoose.Schema(
  {
    // Usuarios que siguen la oferta
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Tipo de la oferta
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      required: true,
    },
    routeName: {  //Anteriormente offerTitle
      type: String,
      required: true,
    },
    // Salario anual
    routeDistance: {
      type: Number,
      required: false,
    },
    routeDuration: {
      type: Number,
      required: false,
    },
    descriptionGeneral: {
      type: String,
      required: true,
    },


    // Ciudad del trabajo
    routeLocation: {
      type: String,
      required: true,
    },


    //Cosas que se recomiendan llevar en la ruta
    itemsToCarry: {
      type: [String],
      required: true,
      default: [],
    },



    // imagen de la ruta
    image: {
      type: String,
      required: false,
      
    },

    comments: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Comment",
      required: false,
      default: [],
    },

    ratings: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Ratings",
      required: false,
      default: [],
    },

    interestedUsers: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      required: false,
      default: [],
    },

    // Estado de la ruta
    routeState: {
      type: String,
      enum: ["Close", "Abandoned", "Open"],
      required: true,
    },
  },

  {
    timestamps: true,
  }
);

// we create the data schema model for mongoose
const MountainRoute = mongoose.model("MountainRoute", MountainRouteSchema);
module.exports = MountainRoute;