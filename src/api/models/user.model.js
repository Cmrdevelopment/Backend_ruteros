const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, unique: false },
    surname: { type: String, required: true, trim: true, unique: false },
    description: { type: String, required: true, trim: true, unique: false },
    city: { type: String, required: true, trim: true, unique: false },
    password: {
      type: String,
      required: true,
      trim: true,
      validate: [validator.isStrongPassword],
      minlength: [8, "Min 8 characters"],
    },
    image: {
      type: String,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      validate: [validator.isEmail, "Email not valid"],
    },
    confirmationCode: {
      type: Number,
      required: true,
    },
    check: {
      type: Boolean,
      default: false,
    },

    //Pendiente de revisar New Email
    emailChange: {
      type: String,
      required: false,
      trim: true,
      validate: [validator.isEmail, "Email not valid"],
    },

    //Importante: En el front solo se puede elegir entre freelance o company
    rol: {
      type: String,
      enum: ["admin", "freelance", "company"],
      required: true,
    },

    technologies: [
      {
        type: String,
      },
    ],

    offersCreated: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Offer",
      required: false,
      default: [],
    },

    offersInterested: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Offer",
      required: false,
      default: [],
    },

    // Comentarios hechos por me
    commentsByMe: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Comment",
      required: false,
      default: [],
    },

    // Comentarios hechos por otros (a mi)
    commentsByOthers: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Comment",
      required: false,
      default: [],
    },

    // Valoraciones hechas por me
    ratingsByMe: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Ratings",
      required: false,
      default: [],
    },

    // Valoraciones hechas por otros (a mi)
    ratingsByOthers: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Ratings",
      required: false,
      default: [],
    },

    experience: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Experience",
      required: false,
      default: [],
    },

    banned: {
      type: Boolean,
      default: false,
    },

    // users a los que yo sigo
    following: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      required: false,
      default: [],
    },

    // user que me siguen
    followers: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      required: false,
      default: [],
    },

    comentsThatILike: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Comment",
      required: true,
      default: [],
    },
    chats: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Chat",
      default: [],
    },
  },
  {
    timestamps: true, // timestamp
  }
);

UserSchema.pre("save", async function (next) {
  try {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (error) {
    next("Error hashing password", error);
  }
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
