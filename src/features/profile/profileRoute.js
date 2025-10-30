const express = require('express');
const router = express.Router();
const profileController = require('./profileController');

router.get('/getuser/:id',profileController.getuserprofile)
router.put('/updateuser/:id',profileController.updateuserprofile)

module.exports = router;
