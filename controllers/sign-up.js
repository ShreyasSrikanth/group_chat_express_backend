const Signup = require('../models/user-sign-up');

const {
    post
} = require('../routes/sign-up');
const {
    where
} = require('sequelize');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

exports.postItem = (req, res, next) => {
    const name = req.body.name;
    const email = req.body.email;
    const phone = req.body.phone;
    const pass = req.body.pass;

    const saltround = 10;

    Signup.findOne({
            where: {
                email: email
            }
        })
        .then(existingUser => {
            if (existingUser) {
                return res.status(404).json({
                    message: 'User already exists'
                });
            } else {
                bcrypt.hash(pass, saltround, (err, hash) => {
                    if (err) {
                        return res.status(500).json({
                            error: 'Hashing error'
                        });
                    }

                    Signup.create({
                            name: name,
                            email: email,
                            phone: phone,
                            pass: hash
                        })
                        .then(result => {
                            return res.status(200).json({
                                message: 'Information is successfully stored'
                            });
                        })
                        .catch(err => {
                            return res.status(500).json({
                                error: 'Failed to store information'
                            });
                        });
                });
            }
        })
        .catch(err => {
            res.status(500).json({
                error: 'Database error'
            });
        });
};

function generateToken(id, name) {
    return jwt.sign({
        userId: id,
        userName: name
    }, 'shreyassrikanth')
}

exports.loginCredentials = async (req, res, next) => {
    let email = req.body.email;
    let pass = req.body.pass;

    let user = await Signup.findOne({
        where: {
            email: email
        }
    });

    try {
        if (user) {
            const isMatch = await bcrypt.compare(pass, user.pass);

            if (isMatch) {
                res.status(200).json({
                    message: 'Login Succesful',
                    token: generateToken(user.id, user.name)
                });
            } else {
                res.status(404).json({
                    message: "Invalid email or password"
                });
            }
        } else {
            res.status(404).json({
                message: 'Invalid emaill or password'
            });
        }
    } catch (err) {
        res.status(500).json({
            error: 'Failed to login'
        })
    }
}

exports.findnewUsers = async (req, res, next) => {
    let newusers = await Signup.findAll();
    const userCount = await Signup.count();
    try {
        if (newusers) {
            res.status(200).json({
                message: 'New Users fetched',
                users: newusers,
                userCount: userCount,
                currentuser: req.user.userId
            })
        } else {
            res.status(404).json({
                message: "Unable to fetch users"
            })
        }
    } catch (err) {
        res.status(500).json({
            error: "Server failed to fetch data"
        })
    }

}