const jwt = require('jsonwebtoken');
const User = require('../models/signupModel');

const authentication = (req,res,next) => {
    try {
        const token = req.header('Authorization');
        const user = jwt.verify(token,'shreyassrikanth');
        User.findByPk(user.userId).then(res =>{
            req.user = user;
            next();
        })
    } catch(err) {
        console.log(err);
        return res.status(404).json({success:false})
    }
}

module.exports = {
    authentication
}