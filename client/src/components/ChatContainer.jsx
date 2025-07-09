    import React, { useEffect, useRef, useState } from 'react'
import assets, { messagesDummyData } from '../assets/assets'
import { formatMessageTime } from '../lib/utils'
import { useChatContext } from '../../context/ChatContext'
import { useAppContext } from '../../context/AuthContext'
import toast from 'react-hot-toast'
import { Particles } from '../components/Particles'
import {motion} from 'framer-motion'

const ChatContainer = () => {
  const scrollEndRef = useRef(null)
    const { selectedUser, setSelectedUser, messages, sendMessage, getMessages ,deleteMessagesBetweenUsers,setMessages} = useChatContext()






  const safeMessages = messages || []
  const { authUser, onlineUsers } = useAppContext()
  const [input, setInput] = useState("")


 // Inside your ChatContainer component:

const handleDelete = async () => {
  if (!selectedUser) return

  if (
    !window.confirm(
      `Are you sure you want to delete your entire chat history with ${selectedUser.fullName}?`
    )
  ) return

  try {
    const data = await deleteMessagesBetweenUsers(selectedUser._id)
    if (data.success) {
      setMessages([])
      toast.success(`Deleted ${data.deletedCount} messages with ${selectedUser.fullName}.`)
    } else {
      toast.error(data.message || "Could not delete messages.")
    }
  } catch (err) {
    console.error("Delete chat error:", err)
  }
}



  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (input.trim() === "") return
    await sendMessage({ text: input.trim() })
    setInput("")
  }

  const handleSentImage = async (e) => {
    const file = e.target.files[0]
    if (!file || !file.type.startsWith('image/')) {
      toast.error("Select an Image File")
      return
    }
    const reader = new FileReader()
    reader.onloadend = async () => {
      await sendMessage({ image: reader.result })
      e.target.value = ""
    }
    reader.readAsDataURL(file)
  }

  useEffect(() => {
    if (selectedUser) {
      getMessages(selectedUser._id)
    }
  }, [selectedUser])

  useEffect(() => {
    const timeout = setTimeout(() => {
      scrollEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, 50)
    return () => clearTimeout(timeout)
  }, [safeMessages])

  return selectedUser ? (
    <div className="flex flex-col h-full min-h-0 relative z-10">
      <div className="absolute inset-0 -z-10">
        <Particles size={0} />
      </div>

      {/* Header */}
      <div className="flex items-center justify-between gap-3 py-3 mx-4 border-b border-stone-500 ">
        <div className="flex gap-2">
          <img src={selectedUser.profilePic || assets.avatar_icon} className="w-8 rounded-full" alt="" />
          <p className="text-white text-lg flex items-center gap-2">
            {selectedUser.fullName}
            {onlineUsers.includes(selectedUser._id) ? (
              <span className="w-2 h-2 rounded-full bg-green-500" />
            ) : (
              <span className="w-2 h-2 rounded-full bg-gray-500" />
            )}
          </p>
        </div>
        <img
          onClick={() => setSelectedUser(null)}
          src={assets.arrow_icon}
          className="md:hidden max-w-7 cursor-pointer"
          alt="Back"
        />
        <img
        onClick={handleDelete}
          src={assets.deleteIcon}
          
          className="max-md:hidden  cursor-pointer shadow-md shadow-neutral-400 bg-transparent rounded-full w-8 p-1 "
          alt="Help"
        />
      </div>

      {/* Chat Messages */}
      <div className="min-h-0 overflow-y-auto flex flex-col p-3 pb-6 gap-2 h-[calc(100%-120px)] pt-6">
        {safeMessages.map((msg, i) => (
          <div
            key={msg._id || i}
            className={`relative flex items-end gap-2 ${msg.senderId !== authUser._id ? '' : 'flex-row-reverse'}`}
          >
            {msg.image ? (
              <>
                <img
                  src={msg.image}
                  alt="chat-img"
                  className="max-w-[230px] border border-gray-700 rounded-lg overflow-hidden mb-4"
                />
                <span
                  className={`absolute -bottom-2 text-xs text-gray-300/80 
                    ${msg.senderId === authUser._id ? 'right-1' : 'left-1'}`}
                >
                  {formatMessageTime(msg.createdAt)}
                </span>
              </>
            ) : (
              <div
                className={`relative p-4 max-w-[220px] md:text-sm font-light rounded-lg mb-4 break-all
                  bg-violet-500/30 text-white border border-gray-700
                  ${msg.senderId === authUser._id ? 'rounded-bl-none' : 'rounded-br-none'}`}
              >
                <p className="mb-4">{msg.text}</p>
                <span
                  className={`absolute bottom-1 text-xs text-gray-300/80 
                    ${msg.senderId === authUser._id ? 'right-1' : 'left-1'}`}
                >
                  {formatMessageTime(msg.createdAt)}
                </span>
              </div>
            )}
          </div>
        ))}
        <div ref={scrollEndRef}></div>
      </div>

      {/* Input Section */}
      <div className="w-full flex items-center justify-center py-2 gap-2">
        <div className='w-[87%] bg-[#8185B2]/25 rounded-full flex items-center justify-between h-[2.8rem]'>
          <input
            onChange={(e) => setInput(e.target.value)}
            value={input}
            onKeyDown={(e) => e.key === "Enter" ? handleSendMessage(e) : null}
            placeholder='Send a Message'
            className='w-[80%] outline-none h-full px-6 text-white bg-transparent'
          />
          <label htmlFor="image-upload" className="cursor-pointer mr-4">
            <img src={assets.gallery_icon} className="w-5" alt="Upload" />
          </label>
          <input
            type="file"
            id="image-upload"
            accept="image/*"
            hidden
            onChange={handleSentImage}
          />
        </div>
        <div className="rounded-[50%] w-9 h-9 bg-purple-900 flex items-center justify-center cursor-pointer">
          <img onClick={handleSendMessage} src={assets.send_button} alt="Send" />
        </div>
      </div>
    </div>
  ) : (
    <div className="flex gap-3 h-full relative">
      <div className="absolute top-[50%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center flex-col">
        <motion.img whileTap={{scale:0.96}} src={assets.logo_icon} className="w-25 mb-4" alt="Logo" />
        <p className="text-white font-bold">Chat anytime, anywhere</p>
      </div>
    </div>
  )
}

export default ChatContainer
