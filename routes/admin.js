const express=require('express');
const router=express.Router();

const admin=require('../controllers/admin');


router.get('/login/:email/:password',admin.login);


router.post('/signup',admin.signup);

router.get('/forgotPassword/:email',admin.forgotPassword);


module.exports=router;