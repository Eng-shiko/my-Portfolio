const express =require('express')
const authController =require('../controllers/authController')
const auth=require('../middleware/authMiddleware')
const router=express.Router()
//public routes register ,login 
router.post('/register',authController.registerAdmin)
router.post('/login',authController.Login)
//protected routes logout ,getinformation
router.get('/me',auth,authController.getAdminProfile)
router.delete('/logout',auth,authController.logoutAdmin)
module.exports=router