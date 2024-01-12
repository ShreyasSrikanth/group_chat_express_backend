const jwt = require('jsonwebtoken');
const User = require('../models/signupModel');

const authentication = async (req, res, next) => {
    try {
        console.log("jwt1")
        const token = req.header('Authorization');
        const user = jwt.verify(token, 'shreyassrikanth');
        const foundUser = await User.findByPk(user.userId);
        console.log("jwt2")
        if (foundUser) {
            console.log("jwt if")
            req.user = user;
            return next(); // Move to the next middleware/route handler
        } else {
            console.log("jwt else")
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
