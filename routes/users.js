const express = require("express");
const { login, signup } = require("../modules/Controllers/users");
const router = express.Router();

router.route("/login").get(login)
router.route("/signup").get(signup)

module.exports = router