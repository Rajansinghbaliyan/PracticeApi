const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: { type: String, required: [true, "Please enter the name."] },
  photo: String,
  password: {
    type: String,
    required: [true, "Please enter the password"],
    minlength: 8,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please enter the confirm password"],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: "Please enter the same confirm password",
    },
  },
  email: {
    type: String,
    unique:true,
    validate: [validator.isEmail, "Please enter the correct email address"],
    required: [true, "Please enter the email"],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  role: {
    type: String,
    enum: ["user", "author", "admin"],
    default: "user",
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.checkPassword = async (password,passwordHash)=>{
    return await bcrypt.compare(password,passwordHash);
}

const User = mongoose.model("user", userSchema);

module.exports = User;

/*
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    minlength: 6,
    validate: [validator.isEmail, "Please enter the correct Email Address"],
  },
  photo: {
    type: String,
  },
  password: {
    type: String,
    required: true,
    select: false,
    minlength: 8
  },
  passwordConfirm: {
    type: String,
    required: true,
    validate: {
      validator: function (el) {
        return this.password === el;
      },
      message: "Please enter the same confirm password",
    },
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  role: {
    type: String,
    enum: ["user", "author", "admin"],
    default: "user",
  },
});

// userSchema.pre("save", async function (req, res, next) {
//   if (!this.modified("password")) return next();
// 
//   this.password = await bcrypt.hash(this.password, 12);
//   this.passwordConfirm = undefined;
//   next();
// });
// 
// userSchema.methods.checkPassword = async (password, passwordHash) => {
//   return await bcrypt.compare(password, passwordHash);
// };

const User = mongoose.model("User", userSchema);

module.exports = User;
*/
