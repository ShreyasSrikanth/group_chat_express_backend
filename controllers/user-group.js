const userModel = require('../models/user-sign-up');
const groupModel = require('../models/group-creation');
const groupAdminModel = require('../models/group-admin');
const usergroupModel = require('../models/users-groups');

const database = require('../util/database');
const usergroups = require('../models/group-creation');

async function createGroups(req, res, next) {
    const t = await database.transaction();

    try {
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
        let adminId = req.user.userId

        groupAdminModel.findAll({where:{

        }})
    
        const groupModelVar = await groupAdminModel.findAll({
            where: {
                groupadminId: adminId,
                groupId:groupId
            }
        });

        if(groupModelVar){
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
                res.status(404).json({ message: "Not an admin" });
            }
        } else {
            res.status(404).json({ message: "Not an admin" });
        }
    
       
    } catch (err) {
        console.error("Error removing user from group:", err);
        res.status(500).json({ message: "Internal server error" });
    }
}

const { Op } = require('sequelize'); 

async function fetchInviteUsers(req, res, next) {
    try {
        let groupId = req.query.groupId;

        const userGroupRecords = await usergroupModel.findAll({
            where: { groupId },
            attributes: ['UserId'],
        });

        const userIdsInGroup = userGroupRecords.map(record => record.UserId);
        const usersNotInGroup = await userModel.findAll({
            where: {
                id: {
                    [Op.notIn]: userIdsInGroup,
                },
            },
        });

        res.status(201).json({ message: 'User added to the group successfully', users:usersNotInGroup });
    } catch (error) {
        next(error); 
    }
}


async function addUserToGroup(req, res, next) {
    try {
        let groupId = req.body.groupId;
        let groupUsers = req.body.groupUsers; 
        let currentUser = req.user.userId;
        
        let groupInvite = await groupAdminModel.findOne({
            where: {
                groupadminId: currentUser,
                groupId: groupId
            }
        });

        if (groupInvite) {
            const newUserGroupRecords = await Promise.all(
                groupUsers.map(async (userId) => {
                    return await usergroupModel.create({
                        UserId: userId,
                        groupId: groupId,
                    });
                })
            );
    
            res.status(201).json({ message: 'User added to the group successfully', users: newUserGroupRecords });
        } else {
            res.status(404).json({ message: 'You are not an admin or there is no invitation' });
        }
        
    } catch (error) {
        next(error); 
    }
}





module.exports={
    createGroups,
    fetchGroups,
    fetchGroupUsers,
    removeGroupUser,
    fetchInviteUsers,
    addUserToGroup
}