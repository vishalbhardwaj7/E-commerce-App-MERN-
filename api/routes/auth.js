const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

//REGISTER
router.post("/register", async (req, res) => {
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASS_SEC
    ).toString(),
  }); //we need to send this to DB
  try {
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json(err);
  }
  //it is a promise it takes time and asynchronous
  //thats why we need to use async fucntion
});

//login

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    !user && res.status(401).json("You Don't Exist");
    const hashedPassword = CryptoJS.AES.decrypt(
      user.password,
      process.env.PASS_SEC
    );
    const password = hashedPassword.toString(CryptoJS.enc.Utf8);
    password !== req.body.password &&
      res.status(401).json("Password Incorrect");

    //giving webtoken
    const accessToken = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SEC,
      { expiresIn: "3d" }
    ); //2nd param is sec key

    const { password: pwd, ...others } = user._doc;
    res.status(200).json({ ...others, accessToken }); //mongo Db stores our folders inside _doc folder
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
