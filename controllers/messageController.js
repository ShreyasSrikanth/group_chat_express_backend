const Message = require('../models/messageModel');
const User = require("../models/signupModel");

const database = require('../util/database');

exports.postMessages = async(req,res,next) =>{
    const t = await database.transaction();
    let usermessage = req.body.message;

    await User.findOne({where:{id:req.user.userId}})
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
        await t.rollback();
        return res.status(500).json({error:"User doesn't exits"});
    })
};

exports.getMessages = async(req,res,next) =>{
    let users = await User.findAll();

    if(users){
        let messages = await Message.findAll();
        res.status(200).json({message:messages,user:users,currentUserId:req.user.userId})
    }
}

exports.getNewMessages = async (req, res, next) => {
    try {
        let users = await User.findAll();

        const lastTenMessages = await Message.findAll({
            order: [['createdAt', 'DESC']],
            limit: 11
        });

        if (lastTenMessages && lastTenMessages.length > 0) {
            res.status(200).json({ newMessage:lastTenMessages,user:users, currentUserId: req.user.userId });
        } else {
            res.status(404).json({ message: 'No messages found.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
