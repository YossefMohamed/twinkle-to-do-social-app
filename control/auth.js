const jwt = require("jsonwebtoken");

const User = require("../model/userModel");

exports.auth = async (req, res, next) => {
  try {
    if(req.cookies.jwt){  
       const check = await jwt.verify(req.cookies.jwt, "ThisIsMyKey");
       if (!check) {
       next();
     }
     req.user = await User.findById(check);
     res.locals.User = req.user
      }
    next();
  } catch (e) {
    res.status(404).send({ e });
  }
};
