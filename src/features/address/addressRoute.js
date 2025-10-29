const express = require('express');
const router = express.Router();
const jwttokenverify =require('../../middleware/jwtMiddleware');

const addressController = require('./addresscontroller');

router.post('/add',jwttokenverify, addressController.addaddress);
router.get('/:id',jwttokenverify, addressController.getspecificaddress);
router.put('/update/:id',jwttokenverify, addressController.updateaddress);
router.delete('/delete/:id',jwttokenverify,addressController.deleteaddress)
module.exports = router;
