const express = require('express');
const router = express.Router();
const jwttokenverify =require('../../middleware/jwtMiddleware');

const addressController = require('./addresscontroller');

router.post('/add', addressController.addaddress);
router.get('/:id', addressController.getspecificaddress);
router.patch('/update/:id', addressController.updateaddress);
router.delete('/delete/:id',addressController.deleteaddress)

module.exports = router;
