const express = require('express')
const adminShopController = require('../controller/admin/industrialShop')
const adminAnnouncementController = require('../controller/admin/announcement');
const authenticateToken = require('../middleware/authMiddleware');
router = express.Router()

router.get('/',authenticateToken,adminShopController.homePage);
router.get('/add-industrial-shop',authenticateToken,adminShopController.addIndustrialShop);
router.post('/add-industrial-shop',authenticateToken,adminShopController.processIndustrialShop);
router.get('/list-industrial-shop',authenticateToken,adminShopController.listIndustrialShop);
router.post('/list-industrial-shop/:id',authenticateToken,adminShopController.deleteIndustrialShop);
router.get('/edit-industrial-shop/:id',authenticateToken,adminShopController.editIndustrialShop);
router.post('/edit-industrial-shop/:id',authenticateToken,adminShopController.updateIndustrialShop);


router.get('/add-announcement',authenticateToken,adminAnnouncementController.addAnnouncement);
router.post('/add-announcement',authenticateToken,adminAnnouncementController.processAnnouncement);
router.get('/list-announcement',authenticateToken,adminAnnouncementController.listAnnouncement);
router.post('/list-announcement/:id',authenticateToken,adminAnnouncementController.deleteAnnouncement);
router.get('/display-announcement/:id',authenticateToken,adminAnnouncementController.displayAnnouncement);
router.post('/display-announcement/:id',authenticateToken,adminAnnouncementController.updateAnnouncement);


module.exports = router;