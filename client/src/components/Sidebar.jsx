import React, { useEffect,useState } from 'react'
import assets, { userDummyData } from '../assets/assets.js'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAppContext } from '../../context/AuthContext.jsx'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useChatContext } from '../../context/ChatContext.jsx'

const Sidebar = () => {
  const navigate = useNavigate()
  const [input,setInput] = useState(false)
  const { logout, authUser,onlineUsers} = useAppContext()
  const {unseenMessages,users,getUsers,selectedUser,setSelectedUser,setUnseenMessages
} = useChatContext()
  const [loggedInUsers,setLoggedInUsers] = useState()
const filteredUsers = input? users.filter((user)=>user.fullName.toLowerCase().includes(input.toLowerCase())):users
  
  useEffect(()=>{
    getUsers()
  },[onlineUsers])

  return (
    <div
      className={`
        bg-[#8185B2]/10 h-[100vh] p-5 rounded-r-xl text-white w-[100%] 
       flex flex-col ${selectedUser?' h-full min-h-0':''} 
      `}
    >
      <div className="pb-5">
        {/*------------ header section ----------------- */}
        <div className="flex justify-between items-center">
          {authUser ? (
            <div className="h-[100%] w-[50%] flex items-center justify-start gap-3">
              <img src={authUser.profilePic || assets.avatar_icon} className='rounded-full w-[3rem] h-[3rem]'></img>
              <p>{authUser.fullName}</p>
            </div>

          ) : (
            <img src={assets.logo} className="max-w-40" />

          )}
          <div className="relative py-2 group">

            <img src={assets.menu_icon} className="max-w-40 max-h-5 cursor-pointer" />

            {/*------------ hover section ----------------*/}
            <div
              className="
                absolute top-full right-0 z-20 w-32 p-5 rounded-md bg-[#282142]
                border border-gray-600 text-gray-100 hidden group-hover:block
              "
            >
              <p
                onClick={() => navigate('/profile')}
                className="cursor-pointer text-sm text-white"
              >
                Edit Profile
              </p>
              <hr className="my-2 border-t border-gray-500" />
              <p onClick={logout} className="cursor-pointer text-sm text-white">Logout</p>
            </div>
          </div>
        </div>

        {/*--------- search section -------------- */}
        <div className="bg-[#282142] rounded-full flex items-center gap-2 py-3 px-4 mt-5">
          <img src={assets.search_icon} className="w-3" />
          <input
          onChange={(e)=>setInput(e.target.value)}
            type="text"
            className="
              bg-transparent border-none outline-none text-white text-xs
              placeholder-[#c8c8c8] flex-1
            "
            placeholder="Search User..."
          />
        </div>
      </div>

      {/* -------------- user display section ---------------- */}
      <div className="mt-4 pb-4 flex-1 overflow-y-auto min-h-0">
        {filteredUsers.map((user, index) => (
          <motion.div
            whileHover={{ scale: 1.03 }}
            key={user._id}
onClick={() => {
  setSelectedUser(user);
  setUnseenMessages(prev => ({ ...prev, [user._id]: 0 }));
}}
            className="flex items-center justify-start gap-3 my-2 relative w-full"
          >
            <div
              className={`
                relative w-full flex items-center gap-2 p-2 pl-4 rounded cursor-pointer max-sm:text-sm
                ${selectedUser?._id === user._id ? 'bg-[#282142]/50' : ''}
              `}
            >
              <img
                src={user.profilePic || assets.avatar_icon}
                className="w-[35px] aspect-[1/1] rounded-full"
              />
              <div className="flex flex-col leading-5">
                <p>{user.fullName}</p>
                {onlineUsers.includes(user._id) ? (
                  <span className="text-green-400 text-xs">Online</span>
                ) : (
                  <span className="text-neutral-400 text-xs">Offline</span>
                )}
              </div>
              {unseenMessages[user._id] > 0&& (
                <p className="absolute top-4 right-0 text-xs w-5 h-5 flex items-center justify-center rounded-full bg-violet-500/50">
                  {unseenMessages[user._id]}
                </p>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default Sidebar
