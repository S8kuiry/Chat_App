import { Children, createContext, useContext, useEffect, useState } from "react";
import { useAppContext } from "./AuthContext";
import toast from "react-hot-toast";


export const ChatContext = createContext()


export const ChatProvider = ({ children }) => {
    const [messages, setMessages] = useState()
    const [users, setUsers] = useState([])
    const [selectedUser, setSelectedUser] = useState(null)
    const [unseenMessages, setUnseenMessages] = useState(null)
    const { socket, axios } = useAppContext()

    // --------------- function to get all users for side bar -------------

    const getUsers = async () => {
        try {
            const { data } = await axios.get('/api/messages/users');
            if (data.success) {
                setUsers(data.users)
                setUnseenMessages(data.unseenMessages)
            }
        } catch (error) {
            toast.error(error.message)
            console.log(error.message)

        }
    }

    // function  to get messages for selected user ---------------------

    const getMessages = async (userId) => {
        try {
            const { data } = await axios.get(`/api/messages/${userId}`)
            if (data.success) {
                setMessages(data.messages)
            }

        } catch (error) {
            toast.error(error.message)

            console.log(error.message)

        }
    }


    // function to send message to selected user =-------------
    const sendMessage = async (messageData) => {
        try {
            const { data } = await axios.post(`/api/messages/send/${selectedUser._id}`, messageData)
            if (data.success) {
                setMessages((prevMessages) => 
                    [...prevMessages, data.newMessage]

                )
            } else {
                toast.error(error.message)


            }

        } catch (error) {
            toast.error(error.message)


        }
    }

    // function to subscribe messages for the new user -------------
    const subscribeToMessages = () => {
  if (!socket) return;

  socket.on("newMessage", (newMessage) => {
    if (selectedUser && newMessage.senderId === selectedUser._id) {
      newMessage.seen = true;
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      axios.put(`/api/messages/mark/${newMessage._id}`);
    } else {
      setUnseenMessages((prevUnseen) => ({
        ...prevUnseen,
        [newMessage.senderId]: prevUnseen?.[newMessage.senderId]
          ? prevUnseen[newMessage.senderId] + 1
          : 1,
      }));
    }
  });
};
// delete messages btw users 
 const deleteMessagesBetweenUsers = async () => {
    if (!selectedUser?._id) return;

    try {
      const { data } = await axios.delete(`/api/messages/delete/${selectedUser._id}`);
      if (data.success) {
        setMessages([]); // Clear messages from UI
        toast.success(`Deleted ${data.deletedCount} messages`);
      } else {
        toast.error("Failed to delete messages");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };


    // function to unsubscribe from messages
     
    const unsubscribeFromMessages = async ()=>{
        if(socket) socket.off("newMessage")
    }
    useEffect(()=>{
        subscribeToMessages()
        return()=>{
            unsubscribeFromMessages()
        }
    },[socket,selectedUser])

    const value = {
        messages,users
        ,getUsers
        ,selectedUser
        ,setMessages,
        sendMessage
        ,setSelectedUser,
        unseenMessages,
        setUnseenMessages,
        getMessages,
        deleteMessagesBetweenUsers

    }
    return (
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    )
}
export const useChatContext = () => useContext(ChatContext)