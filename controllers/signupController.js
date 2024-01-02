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

    console.log("name",name);
    console.log("email",email);
    console.log("phone",phone);
    console.log("pass",pass)
    
    const saltround = 10;

    Signup.findOne({ where: { email: email } })
        .then(existingUser => {
            if (existingUser) {
                console.log("User already exists")
                return res.status(404).json({ message: 'User already exists' });
            } else {
                bcrypt.hash(pass, saltround, (err, hash) => {
                    if (err) {
                        return res.status(500).json({ error: 'Hashing error' });
                    }
                    
                    Signup.create({
                        name: name,
                        email: email,
                        phone: phone,
                        pass: hash
                    })
                    .then(result => {
                        console.log("hash",result)
                        return res.status(200).json({ message: 'Information is successfully stored' });
                    })
                    .catch(err => {
                        console.log("err",err)
                        return res.status(500).json({ error: 'Failed to store information' });
                    });
                });
            }
        })
        .catch(err => {
            res.status(500).json({ error: 'Database error' });
        });
};
