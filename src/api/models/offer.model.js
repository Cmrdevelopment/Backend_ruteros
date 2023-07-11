const mongoose = require("mongoose");

const OfferSchema = new mongoose.Schema(
  {
    // Usuarios que siguen la oferta
    owner: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      required: true,
    },

    // Tipo de la oferta
    offerType: {
      type: String,
      enum: ["CompanyOffer", "FreelandOffer"],
      required: true,
    },
    offerTitle: {
      type: String,
      required: true,
    },
    // Salario anual
    annualSalary: {
      type: Number,
      required: false,
    },

    descriptionGeneral: {
      type: String,
      required: true,
    },

    descriptionResponsabilities: {
      type: String,
      required: true,
    },

    descriptionRequires: {
      type: String,
      required: true,
    },

    descriptionSalary: {
      type: String,
      required: true,
    },

    // Ciudad del trabajo
    city: {
      type: String,
      required: true,
    },

    // Tipo de trabajo
    jobType: {
      type: String,
      enum: ["Remote", "Office", "Hybrid"],
      required: true,
    },

    // Tecnologías que piden en la oferta
    //technologies: { type: String, required: true },

    // technologies: [
    //   {
    //     type: String,
    //   },
    // ],

    technologies: {
      type: [String],
      required: true,
      default: [],
    },

    // Años de experiencia
    experienceYears: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },

    // Logo de la compañia
    image: {
      type: String,
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

    // Estado de la Oferta
    offerState: {
      type: String,
      enum: ["Close", "Suspended", "Open"],
      required: true,
    },
  },

  {
    timestamps: true,
  }
);

// we create the data schema model for mongoose
const Offer = mongoose.model("Offer", OfferSchema);
module.exports = Offer;
