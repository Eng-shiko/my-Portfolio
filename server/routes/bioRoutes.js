const express=require('express')
const bio=require('../controllers/bioController')
const auth=require('../middleware/authMiddleware')
const router = express.Router()
// public 
router.get('/',bio.getBio)
//private 
router.put('/update',auth,bio.updateBio)

module.exports=router