const express = require('express')
const userController = require('../controller/user/userController');
const {setUserRole,authenticateToken} = require('../middleware/authMiddleware');
router = express.Router()

router.use(setUserRole);

router.get('/home-page',userController.homePage);
router.get('/shop-page',userController.listShop);
router.get('/announcement-page',userController.announcementPage);
router.get('/announcement-detail-page/:id',userController.announcementDetailPage);
router.post('/announcement-detail-page/:id',authenticateToken,userController.createComment);
router.get('/shop-detail-page/:id',userController.shopDetail);
router.post('/home-page',userController.search);
router.get('/all-shops', userController.getAllShops);
module.exports = router;    