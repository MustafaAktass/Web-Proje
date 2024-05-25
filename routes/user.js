const express = require('express')
const userController = require('../controller/user/userController');
router = express.Router()


router.get('/home-page',userController.homePage);
router.get('/shop-page',userController.listShop);
router.get('/announcement-page',userController.announcementPage);
router.get('/shop-detail-page/:id',userController.shopDetail);
router.post('/home-page',userController.search);
router.get('/all-shops', userController.getAllShops);
module.exports = router;