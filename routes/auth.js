const express = require('express')
const authController = require('../controller/auth')
const {tokenControl,setUserRole} = require('../middleware/authMiddleware');

router = express.Router()

router.use(tokenControl,setUserRole)
router.get('/login',authController.loginPage);
router.get('/register',authController.registerPage);
router.post('/register',authController.register);
router.post('/login',authController.login);
router.get('/logout',authController.logout);
module.exports = router;