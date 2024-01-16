const jwt = require('jsonwebtoken');
const User = require('../models/signupModel');

const authentication = async (req, res, next) => {
    try {
        const token = req.header('Authorization');
        const user = jwt.verify(token, 'shreyassrikanth');
        const foundUser = await User.findByPk(user.userId);
        if (foundUser) {
            req.user = user;
            return next();
        } else {
            return res.status(404).json({ success: false });
        }
    } catch (err) {
        return res.status(500).json({ success: false, error: "Authentication failed" });
    }
}

module.exports = {
    authentication
}
