import React, { useEffect, useState } from 'react'
import assets from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAppContext } from '../../context/AuthContext'
import { useChatContext } from '../../context/ChatContext'

const RightSideBar = () => {
  const navigate = useNavigate()
  const { authUser, onlineUsers, logout } = useAppContext()
  const { selectedUser, messages } = useChatContext()
  const [msgImages, setMsgImages] = useState([])

  // Extract only image URLs from messages
  useEffect(() => {
    if (messages && Array.isArray(messages)) {
      const images = messages.filter(msg => msg.image).map(msg => msg.image)
      setMsgImages(images)
    } else {
      setMsgImages([])
    }
  }, [messages])

  if (!selectedUser) return null

  return (
    <div className="h-full bg-[#8185B2]/10 py-0 max-md:hidden">
      {/* Header */}
      <div className="w-full h-[15rem] mb-2 border-b border-b-gray-500 flex flex-col items-center justify-center">
        <img
          src={selectedUser?.profilePic || assets.avatar_icon}
          className="rounded-full w-[6rem] h-[6rem]"
          alt="Profile"
        />
        <div className="w-full flex items-center justify-center gap-3">
          {onlineUsers?.includes(selectedUser._id) ? (
            <span className="w-2 h-2 rounded-full bg-green-500" />
          ) : (
            <div className="w-2 h-2 rounded-full bg-gray-500" />
          )}
          <p className="font-medium text-white text-xl my-3 break-all">
            {selectedUser.fullName}
          </p>
        </div>
        <p className="w-full text-xs text-white text-center">{selectedUser.bio}</p>
      </div>

      {/* Media Section */}
      <div className="w-full flex flex-wrap relative pt-6 overflow-y-scroll h-[17rem]">
        <p className="absolute top-0 left-2 text-white">Media :</p>
        {msgImages.length === 0 ? (
          <div className="text-white font-medium text-xs w-full flex items-center justify-center mt-4">
            No Media Present
          </div>
        ) : (
          msgImages.map((url, index) => (
            <motion.img
              whileHover={{ scale: 1.01, y: -4 }}
              whileTap={{ scale: 0.96 }}
              transition={{ duration: 0.4 }}
              onClick={() => window.open(url)}
              key={index}
              src={url}
              className="rounded-md h-15 m-2 cursor-pointer"
              alt={`media-${index}`}
            />
          ))
        )}
      </div>

      {/* Logout Button */}
      <div className="w-full flex items-center justify-center mt-6">
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.96 }}
          transition={{ duration: 0.1 }}
          onClick={logout}
          style={{
            background: 'linear-gradient(to right,rgb(217, 177, 249),rgb(116, 8, 199))'
          }}
          className="w-[88%] cursor-pointer rounded-full text-white py-2 px-2 shadow-md hover:shadow-lg transition-all duration-300"
        >
          Log Out
        </motion.button>
      </div>
    </div>
  )
}

export default RightSideBar
