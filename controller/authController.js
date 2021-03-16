const jwt = require("jsonwebtoken");

const User = require("../model/user");

exports.signup = async (req, res, next) => {
  try {
    const { name, email, photo, password, passwordConfirm } = req.body;
    console.log(req.body);
    const newUser = await User.create({
      name,
      email,
      photo,
      password,
      passwordConfirm,
    });

    console.log(newUser);
    console.log(process.env.JWT_SECRETE);
    const token = jwt.sign({ _id: newUser._id }, process.env.JWT_SECRETE, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    res.status(201).json({
      status: "success",
      token,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      error: err.message,
    });
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      throw new Error("Please enter the email and password");

    const user = await User.findOne({ email }).select("+password");
    if (!user) throw new Error("Email or Password is incorrect");

    const isPasswordCorrect = await user.checkPassword(password, user.password);
    if (!isPasswordCorrect) throw new Error("Email or Password is incorrect");

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRETE, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    res.status(200).json({
      status: "success",
      token,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      error: err.message,
    });
  }
};

exports.protect = async (req, res, next) => {
  try {
    const authorization = req.headers.authorization;

    console.log(authorization);
    if (!authorization || !authorization.startsWith("Bearer"))
      throw new Error("No headers are included");

    const token = authorization.split(' ')[1];
    const payload = jwt.verify(token,process.env.JWT_SECRETE);
    
    if(!payload) throw new Error('Time expire please login again');

    console.log(payload);
    const currentUser = await User.findById(payload._id);

    console.log(currentUser);
    res.user = currentUser;
    next();
    

  } catch (err) {
    res.status(403).json({
      status: "fail",
      error: err.message,
    });
  }
};
