var express = require("express");
var router = express.Router();
const axios = require("axios");
const MySql = require("../routes/utils/MySql");
const DButils = require("../routes/utils/DButils");
const bcrypt = require("bcrypt");

function validateRegistrationInput(data) {
  const errors = [];

  const usernameRegex = /^[A-Za-z]{3,8}$/;
const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*()_\-+=\[\]{};':"\\|,.<>/?]).{5,10}$/;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!usernameRegex.test(data.username))
    errors.push("Username must be 3–8 letters only");

  if (!passwordRegex.test(data.password))
    errors.push("Password must be 5–10 characters, with at least 1 digit and 1 special character");

  if (data.password !== data.confirmPassword)
    errors.push("Password confirmation does not match");

  if (!emailRegex.test(data.email))
    errors.push("Invalid email format");

  if (!data.country)
    errors.push("Country is required");

  return errors;
}



router.post("/Register", async (req, res, next) => {
  try {
    const validationErrors = validateRegistrationInput(req.body);
    if (validationErrors.length > 0) {
      return res.status(400).send({ success: false, message: validationErrors.join(", ") });
    }

    // const countryList = await axios.get("https://restcountries.com/v3.1/all");
    // const validCountries = countryList.data.map(c => c.name.common);
    // if (!validCountries.includes(req.body.country)) {
    //   return res.status(400).send({ success: false, message: "Invalid country name" });
    // }

    let user_details = {
      username: req.body.username,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      country: req.body.country,
      password: req.body.password,
      email: req.body.email,
      profilePic: req.body.profilePic
    };

    const users = await DButils.execQuery("SELECT username FROM users");
    if (users.find((x) => x.username === user_details.username))
      throw { status: 409, message: "Username taken" };

    let hash_password = bcrypt.hashSync(
      user_details.password,
      parseInt(process.env.bcrypt_saltRounds)
    );

 await DButils.execQuery(
  `INSERT INTO users (username, firstname, lastname, country, hashed_password, email, profilePic) VALUES (?, ?, ?, ?, ?, ?, ?)`,
  [
    user_details.username,
    user_details.firstname,
    user_details.lastname,
    user_details.country,
    hash_password,
    user_details.email,
    user_details.profilePic
  ]
);

    res.status(201).send({ message: "user created", success: true });
  } catch (error) {
    next(error);
  }
});

router.post("/Login", async (req, res, next) => {
  try {
    if (!req.body.username || !req.body.password) {
      return res.status(400).send({ message: "Username and password are required", success: false });
    }

    const user = (
      await DButils.execQuery(
        `SELECT * FROM users WHERE username = ?`, [req.body.username]
      )
    )[0];
    
    if (!user || !bcrypt.compareSync(req.body.password, user.hashed_password)) {
      throw { status: 401, message: "Username or Password incorrect" };
    }

    req.session.user_id = user.user_id;
    console.log("session user_id login: " + req.session.user_id);
    res.status(200).send({ message: "Login succeeded", success: true, username: user.username });
  } catch (error) {
    next(error);
  }
});


router.post("/Logout", function (req, res) {
  if (!req.session.user_id) {
    return res.status(400).send({ success: false, message: "No user is logged in" });
  }

  console.log("session user_id Logout: " + req.session.user_id);
  req.session.reset();
  res.send({ success: true, message: "Logout succeeded" });
});

module.exports = router;