const userModel = require('../models/signupModel');
const groupModel = require('../models/groupModel');

const database = require('../util/database');

async function createGroups(req, res, next) {
    try {
        console.log(req.body.groupName);
        console.log(req.user.userId);

        const t = await database.transaction();
        const newGroup = await groupModel.create({
            groupname: req.body.groupName,
            groupadminId: req.user.userId
        });

        const users = await userModel.findAll({ where: { id: req.body.groupUsers } });
        await newGroup.addUsers(users);

        res.status(200).json({ message: 'Group created successfully', newGroup });
    } catch (error) {
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

    const group = await groupModel.findByPk(groupId); 
        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }

        const users = await group.getUsers({
            attributes: ['id', 'name'] 
        });

        if(users){
            res.status(200).json({groupmembers:users})
        } else {
            res.status(404).json({message:"users or group not found"})
        }
}


module.exports={
    createGroups,
    fetchGroups,
    fetchGroupUsers
}