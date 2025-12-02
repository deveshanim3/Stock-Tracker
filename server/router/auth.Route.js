const express=require('express')
const router=express.Router();
const authController=require('../controller/auth.Controller');
const get=require('../controller/getMe.Controller');
const auth  = require('../middleware/auth');

router.post('/register',authController.register)
router.post('/login',authController.login)
router.post('/refresh',authController.refreshToken)
router.post('/logout',authController.logout)
router.get('/me',auth,get.getMe)

module.exports=router;