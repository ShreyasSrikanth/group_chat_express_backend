const userModel = require('../models/signupModel');
const groupMessageModel = require('../models/groupMessageModel');

const database = require('../util/database');

exports.postGroupMessages = async(req,res,next) =>{
    const t = await database.transaction();
    let usermessage = req.body.message;
    let groupId = req.body.groupId;
    let userId = req.user.userId;
    
    let response = await groupMessageModel.create({
        message:usermessage,
        UserId:userId,
        groupId:groupId
    });

};


exports.getAllMessages = async (req,res,next) => {
    try {
        const groupId = parseInt(req.query.groupId);

        const AllGroupMessages = await groupMessageModel.findAll({
            where: { groupId: groupId },
            include: [
                {
                    model: userModel,
                    attributes: ['id','name'],
                    where: {},
                    required: true
                }
            ],
            order: [['createdAt', 'DESC']]
        });

        if (AllGroupMessages) {
            res.status(200).json({ newMessage:AllGroupMessages,currentUserId: req.user.userId });
        } else {
            res.status(404).json({ message: 'No messages found.' });
        }
    } catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}



exports.getNewGroupMessages = async (req, res, next) => {
    try {
        const groupId = parseInt(req.query.groupId);

        const lastTenMessages = await groupMessageModel.findAll({
            where: { groupId: groupId },
            include: [
                {
                    model: userModel,
                    attributes: ['id','name'],
                    where: {},
                    required: true
                }
            ],
            order: [['createdAt', 'DESC']],
            limit:10
        });
        
        if (lastTenMessages && lastTenMessages.length > 0) {
            res.status(200).json({ newMessage:lastTenMessages,currentUserId: req.user.userId });
        } else {
            res.status(404).json({ message: 'No messages found.' });
        }
    } catch (error) {
        console.error("Error fetching last 10 messages:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};