const express = require('express')
const adminController = require('../controller/admin')
router = express.Router()

router.get('/',adminController.homePage);
router.get('/add-industrial-shop',adminController.addIndustrialShop);
router.post('/add-industrial-shop',adminController.processIndustrialShop);
router.get('/list-industrial-shop',adminController.listIndustrialShop);
router.delete('/list-industrial-shop/:id',adminController.deleteIndustrialShop);

module.exports = router;