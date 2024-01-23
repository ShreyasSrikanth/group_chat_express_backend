const messageModel = require('../models/messageModel');
const archivedChatModel = require('../models/archivedChatModel');

async function moveAndDeleteMessages() {
    try {
        const oneDayAgo = new Date();
        oneDayAgo.setDate(oneDayAgo.getDate() - 1);

        const messagesToMove = await messageModel.find({ createdAt: { $lt: oneDayAgo } });

        await archivedChatModel.insertMany(messagesToMove);

        await messageModel.deleteMany({ createdAt: { $lt: oneDayAgo } });

        console.log(`${messagesToMove.length} messages moved to archivedChatModel.`);
    } catch (error) {
        console.error('Error moving and deleting messages:', error);
    }
}

module.exports={
    moveAndDeleteMessages
}
