const express=require('express');
const router=express.Router();


const admin=require('../controllers/admin');


router.get('/login/:email/:password',admin.login);


router.post('/signup',admin.signup);

router.get('/forgotPassword/:email',admin.forgotPassword);

router.get('/password/resetpassword/:id',admin.resetPassword);

router.post('/forgotPassword',admin.updatePassword);

module.exports=router;