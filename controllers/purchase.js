const Razorpay = require('razorpay');
const Order = require('../models/orders');
const User=require('../models/users');

exports.purchasePremium = (req, res, next) => {
    const amount = 2500;
    
    const rzp = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET
    });

    rzp.orders.create({ amount, currency: 'INR' }, (err, razorpayOrder) => {
        if (err) {
            return next(new Error(JSON.stringify(err)));
        }

        req.user.createOrder({ orderid: razorpayOrder.id, status: "PENDING" })
            .then(() => {
                res.status(201).json({ order: razorpayOrder, key_id: rzp.key_id });
            })
            .catch(err => next(new Error(err)));
    });
};


exports.transactionupdate=(req,res,next)=>{
    console.log(req.body);
    Order.findOne({where:{orderid:req.body.order_id}})
    .then(order=>{
        order.update({paymentid:req.body.payment_id,status:req.body.status}).then(()=>{
            req.user.update({ispremiumuser:true}).then(()=>{
                return res.status(202).json({success:true,message:"Transaction Successful!"});
            }).catch(err=>{throw new Error(err)})
        }).catch(err=>{throw new Error(err)})
    }).catch(err=>{
        console.log(err);
    });
}