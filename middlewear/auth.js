const jwt = require('jsonwebtoken');
const User = require('../models/signupModel');

const authentication = async (req, res, next) => {
    try {
        console.log("jwt 1");
        const token = req.header('Authorization');
        const user = jwt.verify(token, 'shreyassrikanth');
        const foundUser = await User.findByPk(user.userId);

        console.log("=====>",user)

        if (foundUser) {
            req.user = user;
            console.log("jwt 2");
            return next(); // Move to the next middleware/route handler
        } else {
            console.log("User not found");
            return res.status(404).json({ success: false });
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({ success: false, error: "Authentication failed" });
    }
}

module.exports = {
    authentication
}
