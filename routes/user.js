const express = require('express')
const userController = require('../controller/user/userController');
const {tokenControl,setUserRole,authenticateToken} = require('../middleware/authMiddleware');
router = express.Router()

router.use(tokenControl,setUserRole);

router.get('/home-page',userController.homePage);
router.get('/shop-page',userController.listShop);
router.get('/announcement-page',userController.announcementPage);
router.get('/announcement-detail-page/:slug',userController.announcementDetailPage);
router.post('/announcement-detail-page/:slug',authenticateToken,userController.createComment);
router.post('/shop-detail-page/:slug',authenticateToken,userController.createShopComment);
router.get('/shop-detail-page/:slug',userController.shopDetail);
router.post('/home-page',userController.search);
router.get('/all-shops', userController.getAllShops);
router.get('/search-announcement', userController.searchAnnouncement);
module.exports = router;    