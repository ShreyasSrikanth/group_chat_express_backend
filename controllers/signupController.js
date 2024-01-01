const Signup = require('../models/signupModel');
const { post } = require('../routes/signUpRoute');
const { where } = require('sequelize');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

exports.postItem = (req, res, next) => {
    const name = req.body.name;
    const email = req.body.email;
    const phone = req.body.phone;
    const pass = req.body.pass;
    
    const saltround = 10;

    bcrypt.hash(pass, saltround, async (err, hash) => {
        Signup.create({
            name: name,
            email: email,
            phone:phone,
            pass: hash
        })
        .then(result => {
            res.status(200).json({ message: 'Information is successfully stored' });
        })
        .catch(err => {
            res.status(500).json({ error: 'Failed to store information' });
        });
    })
};