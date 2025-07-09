
import cloudinary from "../configs/cloudinary.js";
import Message from "../models/Message.js";
import User from "../models/User.js";
import {io,userSocketmap} from '../server.js'

// imoport only the logged in users
export const getUsersForSidebar = async (req,res)=>{
    try {
        const userId = req.user._id
        const filteredUsers = await  User.find({_id:{$ne:userId}}).select("-password")
        
        // count number of messages not seen 
        const unseenMessages = {}
        const promises = filteredUsers.map(async(user)=>{
            const messages = await Message.find({senderId:user._id,receiverId:userId,seen:false}) 
            if(messages.length>0){
                unseenMessages[user._id] = messages.length;


            }
        })
        await Promise.all(promises)
        res.json({success:true,users: filteredUsers,unseenMessages})
        

    } catch (error) {
        console.log(error.message)
        res.json({success:false,message:error.message})
        
    }

}

// get all the messages from selecteduser ............
export const getMessages  = async (req,res)=>{
    try {
        const {id:selectedUserId} = req.params;
        const myId = req.user._id

        const messages = await Message.find({$or:[
            {senderId:selectedUserId,receiverId:myId},
            {senderId:myId,receiverId:selectedUserId}
        ]})
        await Message.updateMany({senderId:selectedUserId,receiverId:myId},{seen:true})
        res.json({success:true,messages})

        
    } catch (error) {
        console.log(error.message)
        res.json({success:false,message:error.message})
        
    }
}

// api  to mark messages seen using message id 
export const markMessageAsSeen = async (req,res)=>{
    try {
        const {id} = req.params;
        await Message.findByIdAndUpdate(id,{seen:true})
        res.json({success:true})
    } catch (error) {
        console.log(error.message)
        res.json({success:false,message:error.message})    
    }
}

// send message to selected user .............
export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const receiverId = req.params.id; // ✅ FIXED
    const senderId = req.user._id;     // ✅ FIXED

    let imageUrl;
    if (image) {
      const uploadedImage = await cloudinary.uploader.upload(image); // ✅ Added await
      imageUrl = uploadedImage.secure_url;
    }

    const newMessage = await Message.create({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    const receiverSocketId = userSocketmap[receiverId];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.json({ success: true, newMessage }); // ✅ now contains data.newMessage
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// Delete all messages between logged-in user and selected user
export const deleteMessagesBetweenUsers = async (req, res) => {
  try {
    const myId = req.user._id;
    const { id: selectedUserId } = req.params;

    if (!selectedUserId) {
      return res.status(400).json({ success: false, message: "Selected user ID is required" });
    }

    const result = await Message.deleteMany({
      $or: [
        { senderId: myId, receiverId: selectedUserId },
        { senderId: selectedUserId, receiverId: myId }
      ]
    });

    res.json({ success:true, deletedCount: result.deletedCount });
  } catch (error) {
    console.error("Error deleting messages:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};
