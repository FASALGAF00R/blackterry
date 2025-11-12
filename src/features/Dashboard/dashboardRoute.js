const express=require('express')
const router=express.Router()
const dashboardController=require('./dashboardController')

router.get('/view',dashboardController.getDashboardstats)


module.exports=router