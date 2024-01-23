// import {io} from 'socket.io-client'

let chats = document.getElementById('chats');
let chatButton = document.getElementById("ChatButton");
let chatDisplay = document.getElementById("chatText");
let textField = document.getElementById('textField');

let loadAllMessage = document.getElementById("oldmessage");
let loadNewMessage = document.getElementById("newmessage");

let groupForm = document.getElementById('groupForm');
let groupButton = document.getElementById("createGroup");
const overlay = document.getElementById("overlay");
const overlayInvite = document.getElementById("overlayInvite");
const groupFormDiv = document.getElementById("groupFormDiv");
const addGroupMembers = document.getElementById('addGroupMembers');
const sendgrpInfo = document.getElementById('sendgrpInfo');
let GroupChats = document.getElementById('groups');
let closeFormInv = document.getElementById('closeFormInv')

let groupUserIds;

const closeForm = document.getElementById("closeForm");

let NewMessage;
let NewGroupMessage;
let AllMessage;
let NewAllGroupMessage;
let userName;
let userMessage;
let groups = [];
let invite = [];
let chatgroupusers;
let normalchats = true;
let groupAdmin;
let usergroup;

const fileInput = document.getElementById("file");

fileInput.addEventListener('change', async (event) => {

    });



let inviteUserButton = document.getElementById('invite');

const socket = io('http://localhost:3000')
socket.on("connect", (socket)=>{
    const message = document.createElement("p");
    message.textContent = `Connection successfully established`;
    message.style.textAlign="center";
    message.style.backgroundColor="burlywood"
    chats.appendChild(message);
})

inviteUserButton.addEventListener('click',inviteNewUsers)

async function inviteNewUsers(e){
        e.preventDefault();
        overlayInvite.style.display = "block";

        let response = await fetchNewUsersForGroup();
        let groupMembers = response.data.users;
    
        let ul = document.createElement('ul');     
    
    groupMembers.forEach((user) => {
        let li2 = document.createElement('li'); 
        let userName = document.createTextNode(user.name);
        let addButton = document.createElement('button');
        addButton.textContent = 'Invite';
    
        
        let isBackgroundGreen = false;
    
        addButton.addEventListener('click', function(e) {
            e.preventDefault();
            let groupuserId = user.id;
            
            if (isBackgroundGreen) {
                li2.style.backgroundColor = ''; 
                addButton.textContent = 'Invite';
                invite.pop(groupuserId)
    
            } else {
                li2.style.backgroundColor = 'green'; 
                addButton.textContent = 'Remove';
                invite.push(groupuserId);
            }
            isBackgroundGreen = !isBackgroundGreen;
        });
        
        li2.style.display = "flex";
        li2.style.justifyContent = "space-between";
        li2.style.width = "100%";
        li2.style.marginBottom = "10px";
    
        addButton.style.backgroundColor = "rgb(176, 110, 24)";
        addButton.style.border = "black";
        addButton.style.fontSize = "x-small";
        addButton.style.color = 'white';
        addButton.style.borderRadius = "5px";
        addButton.style.height = "15px";
    
        li2.appendChild(userName);
        li2.appendChild(addButton);
        ul.appendChild(li2);
    });
        let invitemembersContainer = document.getElementById('invitemembers');
        invitemembersContainer.innerHTML = '';
        invitemembersContainer.appendChild(ul);
}

async function fetchNewUsersForGroup() {
        let token = localStorage.getItem('token');
        let groupId = chatgroupusers[0].usergroups.groupId;
        
        let response = await axios.get(`http://localhost:3000/groups/fetchNewUsers?groupId=${groupId}`)
        return response
}


if (normalchats === true) {
        inviteUserButton.style.display = 'none';
} 

groupButton.addEventListener('click', createGroups);

async function createGroups(event) {
    event.preventDefault();
    overlay.style.display = "block";

    let response = await fetchUsers();
    let groupMembers = response.data.users;


    let ul = document.createElement('ul');     

groupMembers.forEach((user) => {
        if(user.id!=response.data.currentuser){
                let li = document.createElement('li'); 
                let userName = document.createTextNode(user.name);
                let addButton = document.createElement('button');
                addButton.textContent = 'Add';
            
                
                let isBackgroundGreen = false;
            
                addButton.addEventListener('click', function(e) {
                    e.preventDefault();
                    let groupuserId = user.id;
                    
                    if (isBackgroundGreen) {
                        li.style.backgroundColor = ''; 
                        addButton.textContent = 'Add';
                        groups.pop(groupuserId)
            
                    } else {
                        li.style.backgroundColor = 'green'; 
                        addButton.textContent = 'Remove';
                        groups.push(groupuserId);
                    }
                    isBackgroundGreen = !isBackgroundGreen;
                });
                
                li.style.display = "flex";
                li.style.justifyContent = "space-between";
                li.style.width = "100%";
                li.style.marginBottom = "10px";
            
                addButton.style.backgroundColor = "rgb(175, 110, 24)";
                addButton.style.border = "none";
                addButton.style.fontSize = "x-small";
                addButton.style.color = 'white';
                addButton.style.borderRadius = "5px";
                addButton.style.height = "15px";
            
                li.appendChild(userName);
                li.appendChild(addButton);
                ul.appendChild(li);
        }else{
                groups.push(response.data.currentuser)
        }
   
});
    let membersContainer = document.getElementById('members');
    membersContainer.innerHTML = '';
    membersContainer.appendChild(ul);
}

sendgrpInfo.addEventListener('click',userGroups)
async function userGroups(){
        
    let token = localStorage.getItem("token");
    let groupName = document.getElementById('grpName').value;

    socket.emit("creatinggroup",groupName)

    if(groupName===""){
        alert("Please Enter Group Name")
    } else {
        let response = await axios.post(`http://localhost:3000/groups/createGroups`,{
                groupName:groupName,
                groupUsers:groups
            },{
                headers:{
                    'Authorization':token
                }
            })
        
        
            if(response.status===200){
                alert(response.data.message)
            }
    }
}

let sendgrpInfoInv = document.getElementById('sendgrpInfoInv');
sendgrpInfoInv.addEventListener('click',inviteUsers)

async function inviteUsers(){
        let token = localStorage.getItem("token");
        let groupName = document.getElementById('grpName').value;
    
        let groupId = chatgroupusers[0].usergroups.groupId;
        let response = await axios.post(`http://localhost:3000/groups/addUserToGroup`,{
                groupId:groupId,
                groupUsers:invite
        },{
                headers:{
                    'Authorization':token
                }
        })
    
    
        if(response){
                alert(response.data.message)
        }

        await displayGroupUsers(groupName,groupId)
        
    }



async function fetchUserGroup() {

    let token = localStorage.getItem("token");
    let response = await axios.get(`http://localhost:3000/groups/fetchgroups`, {
        headers: {
            'Authorization': token
        }
    });

    GroupChats.innerHTML="";

    response.data.groups.forEach(group => {
        const groupDiv = document.createElement('div');
        groupDiv.textContent = `${group.groupname}`;
        localStorage.setItem(groupDiv.textContent, group.id);
        groupDiv.classList.add('group-name');
        GroupChats.appendChild(groupDiv);

        groupDiv.addEventListener('click', async function() {
            const groupName = this.textContent;
            let groupId = localStorage.getItem(groupName);
            await displayGroupUsers(groupName, groupId);
        });
    });

    groupUserIds = response.data.groups;
}



async function displayGroupUsers(groupName, groupId){
        chats.innerHTML=""    
        normalchats = false;

        if (normalchats === false) {
                inviteUserButton.style.display = 'block';
        } 
    
        let token = localStorage.getItem("token");
    
        let response = await axios.get(`http://localhost:3000/groups/fetchgroupUsers?groupId=${groupId}`, {
            headers: {
                'Authorization': token
            }
        });
        chatgroupusers = response.data.groupmembers;
        groupAdmin = response.data.groupadminId
    
        displayUsers();
}



chatButton.addEventListener("click",sendMesssage);

async function sendMesssage(){
        if(normalchats===true){
                await storeMessagestoBackend();
        } else {
                await storeGroupMessages();
        }
}

async function storeGroupMessages(){
        let text = document.getElementById('text').value;
        let token = localStorage.getItem("token");
        let groupId = chatgroupusers[0].usergroups.groupId;

        socket.emit("sendGroupMessages",text)
        document.getElementById('text').value = "";

        let response = await axios.post(`http://localhost:3000/groupmessageRoute/fetchgroupUsers`, {
                message: text,
                groupId:groupId
        },{
                headers: {
                        'Authorization': token
                }
        })
  
}



async function storeMessagestoBackend() {
        const fileInput = document.getElementById('file');
        const selectedFile = fileInput.files[0];

        if (selectedFile) {
            let text = document.getElementById('text').value;
            socket.emit("sendfile",selectedFile)

            let token = localStorage.getItem('token');
            const formData = new FormData();

            formData.append('file', fileInput.files[0]);
            console.log("fileInput",fileInput.files[0])
        
            try {
                const response = await axios.post('http://localhost:3000/message/filesUpload', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',  
                        'Authorization': token,
                    },
                });

                console.log(response.data.fileUrl);
                
            } catch (error) {
                console.error('Error during file upload:', error);
            }
        } else {
                let text = document.getElementById('text').value;
                let token = localStorage.getItem("token");
                let count = localStorage.getItem("userCount");
        
                socket.emit("send",text)
        
                if (count === "1") {
                        alert("No users to send messages")
                } else {
        
                let response = await axios.post(`http://localhost:3000/message/storechat`, {
                        message: text
                }, {
                        headers: {
                                'Authorization': token
                        }
                })
        
                        document.getElementById('text').value = "";
                }
        }
}



loadNewMessage.addEventListener("click", fetchNewMessages);



async function fetchNewMessages() {
    loadNewMessage.disabled = true;
    loadAllMessage.disabled = false;

        if(normalchats===true){
                appendNewMessage();

                socket.on("newmessagestored", async (message) => {
                        setTimeout(async () => {
                            await appendNewMessage();
                        }, 500);
                });

                socket.on("fileSent", async (message) => {
                        setTimeout(async () => {
                            await appendNewMessage();
                        }, 5000);
                    });

            } else{

                appendGroupMessage();
                socket.on("newgroupmessagesstored", async (message) => {
                        await appendGroupMessage();
                    },500);
            }
}

loadAllMessage.addEventListener("click", fetchAllMessages);

async function fetchAllMessages() {
    loadNewMessage.disabled = false; 
    loadAllMessage.disabled = true; 
       
        if(normalchats===true){

                getMessagesfromBackend();

                socket.on("newmessagestored", async (message) => {
                        setTimeout(async () => {
                            await getMessagesfromBackend();
                        }, 500);
                });
                socket.on("fileSent", async (message) => {
                        setTimeout(async () => {
                            await getMessagesfromBackend();
                        }, 5000);
                });
        } else {
                getAllGroupMessagesfromBackend();

                socket.on("newgroupmessagesstored", async (message) => {
                        setTimeout(async () => {
                            await getAllGroupMessagesfromBackend();
                        }, 500);
                    });
        }
}

closeFormInv.addEventListener('click', function() {
        overlayInvite.style.display = "none";
        invite=[];
});


closeForm.addEventListener('click', function() {
        overlay.style.display = "none";
        groups=[];
});

textField.addEventListener('click', function() {
    chatDisplay.style.display = 'block';
    chats.innerHTML="";
    normalchats = true;
    if(normalchats===true) {
        inviteUserButton.style.display = 'none';
     }
    displayUsers();
});

async function fetchUsers() {
    let token = localStorage.getItem('token');
    let response = await axios.get("http://localhost:3000/users/fetchusers",{
        headers: {
                        'Authorization': token
        }
    })
    localStorage.setItem("userCount", response.data.userCount)
    return response
}

async function displayUsers() {
        let response1 = await fetchUsers();
        let response2 = chatgroupusers;
        let newUsers;
        
        if(normalchats===true){
            newUsers = response1.data.users;
        } else {
            newUsers = response2
        }
        
        let groupUsers = response2;
        let ul = document.createElement('ul');

        newUsers.forEach(async (user, index) => {
                let currentUserEmail = localStorage.getItem("Email");
                let currentUser;


                let li = document.createElement('li');

                if (user.email === currentUserEmail) {
                        currentUser = "You"
                } else {
                        currentUser = user.name;
                }

                if(normalchats===true){
                        li.textContent = currentUser + " " + "joined";
                } else{
                        if (user.id===groupAdmin){
                                li.textContent = `${currentUser} admin`;
                                
                        } else {
                                let token = localStorage.getItem('token');
                                let groupId = chatgroupusers[0].usergroups.groupId;
                                li.textContent = `${currentUser} joined`;
                                let removeButton = document.createElement('button');
                                removeButton.textContent = 'Remove';
                                removeButton.addEventListener('click', async () => {
                                        let response = await axios.post(`http://localhost:3000/groups/removegroupuser`, {
                                                userId:user.id,
                                                groupadminId:groupAdmin,
                                                groupId:groupId
                                        }, {
                                                headers: {
                                                        'Authorization': token
                                                }
                                        })

                                    if(response.status===200){
                                        alert("User succesfully Removed")
                                        let groupName = document.getElementById('grpName').value;
                                        await displayGroupUsers(groupName,groupId)
                                    }  else {
                                            alert("Not an admin")
                                    }
                                });
                        
                                li.appendChild(removeButton);
                        }
                }


                if (index % 2 == 0) {
                        li.style.backgroundColor = "#CCCCCC";
                        li.style.width = "88%"
                        li.style.borderRadius = "4px"
                } else {
                        li.style.backgroundColor = "#FFFFFF";
                        li.style.width = "88%"
                        li.style.borderRadius = "4px"
                }

                li.style.marginBottom = "1%"
                li.style.listStyleType = "none"

                ul.appendChild(li);
                chats.appendChild(ul)
        });
        
    if(normalchats===true){
        appendNewMessage()

        socket.on("newmessagestored", async (message) => {
                setTimeout(async () => {
                    await appendNewMessage();
                }, 500);
        });
        socket.on("fileSent", async (message) => {
                console.log("file====>",message)
                setTimeout(async () => {
                    await appendNewMessage();
                }, 5000);
        });
    } else{
        appendGroupMessage()
        socket.on("newgroupmessagesstored", async (message) => {
                setTimeout(async () => {
                    await appendGroupMessage();
                }, 500);
            });

    }
        
}



async function getAllGroupMessagesfromBackend() {
        try {
                let token = localStorage.getItem("token");
                let groupId = chatgroupusers[0].usergroups.groupId;

                let response = await axios.get(`http://localhost:3000/groupmessageRoute/fetchallgroupmessages?groupId=${groupId}`, {
                        headers: {
                                'Authorization': token
                        }
                });
                
                localStorage.setItem("recent", JSON.stringify(response.data.newMessage));

                displayLastTenMessages(response);

        } catch (error) {
                console.error("Error fetching all group messages:", error);
        }
}


async function appendGroupMessage() {
        let token = localStorage.getItem("token");
        let groupId = chatgroupusers[0].usergroups.groupId;

        let response = await axios.get(`http://localhost:3000/groupmessageRoute/fetchgroupmessages?groupId=${groupId}`, {
                headers: {
                        'Authorization': token
                }
        });


        localStorage.setItem("recent", JSON.stringify(response.data.newMessage));
        displayLastTenMessages(response);

}

async function getMessagesfromBackend() {
        try {
                let token = localStorage.getItem("token");
                let response = await axios.get(`http://localhost:3000/message/getmessages`, {
                        headers: {
                                'Authorization': token
                        }
                });

                let messages = response.data.message.reverse();
                localStorage.setItem("recent", JSON.stringify(messages));

                displayLastTenMessages(response);

        } catch (error) {
                console.error("Error fetching messages:", error);
        }
}

async function appendNewMessage() {
        let token = localStorage.getItem("token");
        let response = await axios.get(`http://localhost:3000/message/getNewMessage`, {
                headers: {
                        'Authorization': token
                }
        });
        console.log(response)
        localStorage.setItem("recent", JSON.stringify(response.data.newMessage));
        displayLastTenMessages(response);
}

function getFileExtensionFromUrl(url) {
        const match = url.match(/\.([a-z0-9]+)(?:[\?#]|$)/i);
        return match ? match[1].toLowerCase() : '';
    }

function displayLastTenMessages(response) {
        let ul = document.createElement('ul');

        chatDisplay.innerHTML = "";
        ul.innerHTML = "";

        let newMessageString = localStorage.getItem("recent");
        let newMessage = JSON.parse(newMessageString);
        newMessage = newMessage.reverse();

        if(normalchats===true){
                newMessage.forEach((message) => {
                        let li = document.createElement('li');
                        let userName;
                        let userMessage;
                    
                        if (message.UserId === response.data.currentUserId) {
                            userName = "You";
                            userMessage = message.message;
                        } else {
                            if (response.data.user && Array.isArray(response.data.user)) {
                                let user = response.data.user.find(user => user.id === message.UserId);
                                userName = user ? user.name : "Unknown";
                            } else {
                                userName = "Unknown";
                            }
                            userMessage = message.message;
                            console.log(message.fileUrl);
                        }
                    console.log(userMessage)
                    if(userMessage!=null){
                        li.textContent = `${userName}: ${userMessage}`;
                    } else {
                        li.textContent = `${userName}`;
                    }
                    
                        // Display fileUrl only if it's not empty
                        if (message.fileUrl && message.fileUrl.trim() !== "") {
                            const fileExtension = getFileExtensionFromUrl(message.fileUrl);
                            console.log(fileExtension)
                            let fileLink = document.createElement('a');
                            fileLink.href = message.fileUrl;
                            if(fileExtension!=='pdf' ){
                                let imageElement = document.createElement('img');
                                imageElement.style.maxWidth = '50%';
                                imageElement.src = message.fileUrl
                                li.appendChild(imageElement)
                            } else{
                                fileLink.textContent = 'Click to preview file';
                                li.appendChild(fileLink);    
                            }
                        }
                        li.style.backgroundColor = ul.children.length % 2 === 0 ? "#CCCCCC" : "#FFFFFF";
                        li.style.width = "88%";
                        li.style.borderRadius = "4px";
                        li.style.marginBottom = "1%";
                        li.style.listStyleType = "none";
                    
                        ul.appendChild(li);
                    });
                    
        
        } else {
                newMessage.forEach((message) => {
                        let li = document.createElement('li');

                        if (message.UserId === response.data.currentUserId) {
                                userName = "You";
                                userMessage = message.message;
                        } else {
                                if (message.UserId === message.User.id) {
                                        userName = message.User.name;
                                } else {
                                        userName = "Unknown";
                                }
                                userMessage = message.message;
                        }
        
                        li.textContent = `${userName}: ${userMessage}`;
                        li.style.backgroundColor = ul.children.length % 2 === 0 ? "#CCCCCC" : "#FFFFFF";
                        li.style.width = "88%";
                        li.style.borderRadius = "4px";
                        li.style.marginBottom = "1%";
                        li.style.listStyleType = "none";
        
                        ul.appendChild(li);
                })
        }
 
        chatDisplay.appendChild(ul);
        chats.appendChild(chatDisplay);
}

displayUsers();

fetchUserGroup();
socket.on('groupcreated',async(groupName)=>{
        setTimeout(async () => {
                await fetchUserGroup();
            }, 1000);
        
})
