const express = require('express')
const authController = require('../controller/auth')
router = express.Router()

router.get('/login',authController.loginPage);
router.get('/register',authController.registerPage);
router.post('/register',authController.register);
router.post('/login',authController.login);

module.exports = router;