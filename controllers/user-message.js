const Message = require('../models/user-message');
const User = require("../models/user-sign-up");

const database = require('../util/database');

exports.postMessages = async(req,res,next) =>{
    const t = await database.transaction();
    let usermessage = req.body.message;

    await User.findOne({where:{id:req.user.userId}})
    .then(async(user) => {
        await Message.create({
            text: usermessage,
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


const S3services = require('../services/s3-services');
exports.filesUpload = async (req, res, next) => {
    try {
        const filePath = req.file.path;
        const t = await database.transaction();
        const fileBuffer = require('fs').readFileSync(filePath);
        
        const filename = req.file.originalname;
        const mimetype = req.file.mimetype;
        
        const fileUrl = await S3services.uploadToS3(fileBuffer, filename, mimetype);

        if(fileUrl){
            await User.findOne({where:{id:req.user.userId}})
            .then(async(user) => {
                await Message.create({
                    fileUrl:fileUrl,
                    UserId:req.user.userId
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
        }
        // res.json({ fileUrl:fileUrl });
        
  
    } catch (error) {
      console.error('Error in file upload:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };