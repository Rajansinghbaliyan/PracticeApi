exports.welcome = async (req, res, next) => {

  
  res.status(200).json({
    status: "success",
    message: "Welcome to the restApi",
  });
};
