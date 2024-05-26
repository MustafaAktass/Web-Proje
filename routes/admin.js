const express = require('express')
const adminShopController = require('../controller/admin/industrialShop')
const adminAnnouncementController = require('../controller/admin/announcement');
const {authenticateToken,authorizeAdmin,setUserRole} = require('../middleware/authMiddleware');
router = express.Router()

router.use(setUserRole,authenticateToken,authorizeAdmin)

router.get('/',adminShopController.homePage);
router.get('/index',adminShopController.homePage);
router.get('/add-industrial-shop',adminShopController.addIndustrialShop);
router.post('/add-industrial-shop',adminShopController.processIndustrialShop);
router.get('/list-industrial-shop',adminShopController.listIndustrialShop);
router.post('/list-industrial-shop/:id',adminShopController.deleteIndustrialShop);
router.get('/edit-industrial-shop/:id',adminShopController.editIndustrialShop);
router.post('/edit-industrial-shop/:id',adminShopController.updateIndustrialShop);


router.get('/add-announcement',adminAnnouncementController.addAnnouncement);
router.post('/add-announcement',adminAnnouncementController.processAnnouncement);
router.get('/list-announcement',adminAnnouncementController.listAnnouncement);
router.post('/list-announcement/:id',adminAnnouncementController.deleteAnnouncement);
router.get('/display-announcement/:id',adminAnnouncementController.displayAnnouncement);
router.post('/display-announcement/:id',adminAnnouncementController.updateAnnouncement);


module.exports = router;