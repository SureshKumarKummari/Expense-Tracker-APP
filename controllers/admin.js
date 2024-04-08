//utilities and middleware
const bcrypt=require('../util/bcryptpassword');
const userauth=require('../middleware/userauthentication');
const sendEmail=require('../util/mailservice');

//uuid for generating uuid
const {v4: uuidv4}=require('uuid');

//database models
const users=require('../models/users');
const forgot=require('../models/forgotpasswordrequests');

exports.signup=async(req,res,next)=>{
    users.findOne({where:{email:req.body.email}})
    .then(user=>{
        if(!user){
           bcrypt.decrypt(req.body.password).then(pass=>{
            return users.create({
                    username:req.body.username,
                    email:req.body.email,
                    password: pass});
            }).catch(err=>{
                throw err;
            });
        }else{
            res.status(404).json({error:'User already exists!'})
            //res.status(409).send({error:'User already exists!'});  14 & 15 both are same Just 14 will sends JSON only while 15 will all types of responses like html JSON plain text

        }
    }).then(user=>{
        res.send(user);
    }).catch(err=>console.log(err));
}


function generateToken(id){
    return userauth.token(id);
}

exports.login = (req, res, next) => {
    users.findOne({ where: { email: req.params.email } })
        .then(user => {
            if (user) {
                bcrypt.checkpass(req.params.password, user.password)
                    .then(passwordMatch => {
                        if (passwordMatch) {
                            //console.log(user);

                            res.status(200).json({token:generateToken(user.id),ispremium:user.ispremiumuser}); // Send user data if passwords match
                        } else {
                            res.status(401).json({ error: 'Invalid Password!' }); // Unauthorized if passwords don't match
                        }
                    })
                    .catch(err => {
                        throw err;
                    });
            } else {
                res.status(404).json({ error: 'User not found!' }); // User not found if no user with the given email
            }
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: 'Internal Server Error' }); // Internal server error if something goes wrong
        });
};




exports.forgotPassword = async (req, res, next) => {
    try {
        let email = req.params.email;
        // Find the user by email
        let user = await users.findOne({ where: { email: email } });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        // Generate a unique ID for the password reset request
        let id = uuidv4();
        console.log("calling id!",id);
        // Create a new row in the 'forgot' table
        let forgotRow = await forgot.create({
            id: id,
            userId: user.id,
            isactive: true
        });
        let link = `http://localhost:3000/password/resetpassword/${id}`;

        await sendEmail.sendEmail(email, link);

        res.status(200).json({ message: "Mail sent successfully!" });
    } catch (error) {
        console.error("Error in forgotPassword:", error);
        res.status(500).json({ error: "Internal Server error!" });
    }
};



exports.resetPassword=(req,res,next)=>{
    let id=req.params.id;
    res.render('resetpassword',{id:id});
}

//Need to check isactive  -- pending
exports.updatePassword = async (req, res, next) => {
    const { id, password } = req.body;
    try {
        const found = await forgot.findByPk(id);
        const user = await users.findByPk(found.userId);
        console.log()
        await bcrypt.decrypt(password).then(pass=>{
                console.log(pass);
                user.password = pass;
                user.save();
        })
        found.isactive = false;
        await found.save();
        res.status(200).json({ success: true, message: "Password updated Successfully!" });
    } catch (err) {
        console.error('Error updating password:', err);
        res.status(500).json({ message: "Something went Wrong!" });
    }
}