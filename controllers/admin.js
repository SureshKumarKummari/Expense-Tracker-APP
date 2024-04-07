const users=require('../models/users');
const bcrypt=require('../util/bcryptpassword');
const userauth=require('../middleware/userauthentication');

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