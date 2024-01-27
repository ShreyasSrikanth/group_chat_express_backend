const messageModel = require('../models/user-message');
const archivedChatModel = require('../models/archived-chat');

const { Op } = require('sequelize');

async function moveAndDeleteMessages() {
    try {
        const oneDayAgo = new Date();
        oneDayAgo.setDate(oneDayAgo.getDate() - 1);

        const messagesToMove = await messageModel.findAll({
            where: {
                createdAt: {
                    [Op.lt]: oneDayAgo
                }
            }
        });

        await archivedChatModel.bulkCreate(messagesToMove.map(message => ({
            text: message.text,
            createdAt: message.createdAt,
        })));

        await messageModel.destroy({
            where: {
                createdAt: {
                    [Op.lt]: oneDayAgo
                }
            }
        });

        console.log(`${messagesToMove.length} messages moved to archivedChatModel.`);
    } catch (error) {
        console.error('Error moving and deleting messages:', error);
    }
}

module.exports = {
    moveAndDeleteMessages
};