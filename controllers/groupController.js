const userModel = require('../models/signupModel');
const groupModel = require('../models/groupModel');
const groupAdminModel = require('../models/groupAdminModel')

const database = require('../util/database');
const usergroups = require('../models/groupModel');

async function createGroups(req, res, next) {
    const t = await database.transaction();

    try {
        console.log(req.body.groupName);
        console.log(req.user.userId);

        const newGroup = await groupModel.create({
            groupname: req.body.groupName,
            groupadminId: req.user.userId
        }, { transaction: t });

        const groupId = newGroup.get('id');

        const groupAdmin = await groupAdminModel.create({
            groupadminId: req.user.userId,
            groupId: groupId
        }, { transaction: t });


        const users = await userModel.findAll({ where: { id: req.body.groupUsers } });
        await newGroup.addUsers(users, { transaction: t });

        await t.commit();

        res.status(200).json({ message: 'Group created successfully', groupId:groupId });
    } catch (error) {
        await t.rollback();
        console.error("Error creating group:", error);
        res.status(500).json({ message: 'Failed to create group', error: error.message });
        next(error);
    }
}

async function fetchGroups(req,res,next){
    try {
        const user = await userModel.findByPk(req.user.userId);
        if (!user) {
            throw new Error('User not found');
        }
        const userGroups = await user.getGroups();

        res.status(200).json({ groups: userGroups });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch groups', error: error.message });
        next(error);
    }
}

async function fetchGroupUsers(req,res,next){
    const groupId = parseInt(req.query.groupId);

    let groupAdmin = await groupAdminModel.findOne({
        where:{groupId:groupId}
    });

    let groupadminId = groupAdmin.get('groupadminId');

    const group = await groupModel.findByPk(groupId); 
        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }

        const users = await group.getUsers({
            attributes: ['id', 'name'] 
        });

        if(users){
            res.status(200).json({groupmembers:users,groupadminId:groupadminId})
        } else {
            res.status(404).json({message:"users or group not found"})
        }
}

async function removeGroupUser(req,res,next){
    try {
        let userId = req.body.userId;
        let groupadminId = req.body.groupadminId;
        let groupId = req.body.groupId;
    
        const groupModelVar = await groupAdminModel.findAll({
            where: {
                groupadminId: groupadminId,
                groupId: groupId
            }
        });
    
        if (groupModelVar.length > 0) {
            const groupInstance = await groupModel.findByPk(groupId);
            const userInstance = await userModel.findByPk(userId);

        if (groupInstance && userInstance) {
            await groupInstance.removeUsers(userInstance);
            res.status(200).json({ message: "User removed successfully" });
        } else {
            res.status(404).json({ message: "Group or user not found" });
        }

        } else {
            res.status(404).json({ message: "Group not found" });
        }
    } catch (err) {
        console.error("Error removing user from group:", err);
        res.status(500).json({ message: "Internal server error" });
    }
    


}


module.exports={
    createGroups,
    fetchGroups,
    fetchGroupUsers,
    removeGroupUser
}