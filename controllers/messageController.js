const Message = require('../models/messageModel');
const User = require("../models/signupModel");

const database = require('../util/database');

exports.postMessages = async(req,res,next) =>{
    const t = await database.transaction();
    let usermessage = req.body.message;

    console.log(req.user.userId)

    await User.findOne({where:{id:1}})
    .then(async(user) => {
        await Message.create({
            message: usermessage,
            UserId: req.user.userId
        },{transaction:t})
        .then(async (result) =>{
            await t.commit();
            return res.status(200).json({message:"message succesfully sent"})
        
        })
        .catch(async(err) => {
            await t.rollback();
            return res.status(500).json({error:"Unable to send your message"});
        })
    })
    .catch(async(err) => {
        console.log("hello")
        await t.rollback();
        return res.status(500).json({error:"User doesn't exits"});
    })
};