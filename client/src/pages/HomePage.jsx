import React from 'react'
import Sidebar from '../components/Sidebar'
import ChatContainer from '../components/ChatContainer'
import RightSideBar from '../components/RightSideBar'
import { motion } from 'framer-motion'
import { useChatContext } from '../../context/ChatContext'
import { Particles } from '../components/Particles'
import Footer from '../components/Footer'

const HomePage = () => {
  const { selectedUser, setSelectedUser } = useChatContext()

  const dropInVariants = {
    hidden: { y: -200, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 60,
        damping: 5,
      },
    },
  }

  return (
    <div className="w-full h-screen sm:px-[15%] sm:py-[5%] relative">
<Particles size={2} />      
<motion.div
        initial="hidden"
        animate="visible"
        variants={dropInVariants}
        className={`backdrop-blur-xl border-2 border-gray-600 rounded-2xl overflow-hidden -mt-[1rem]
          grid w-full h-full
          ${selectedUser
            ? 'md:grid-cols-[1fr_1.5fr_1fr] xl:grid-cols-[1fr_2fr_1fr]'
            : 'md:grid-cols-2'}
          grid-cols-1`}
      >
        {/* Each section must fill height */}
        <div className="h-full min-h-0">
          <Sidebar />
        </div>
        <div className="h-full min-h-0">
          <ChatContainer  />
        </div>
        <div className="h-full min-h-0">
          <RightSideBar />
        </div>
      </motion.div>
      <Footer position={"0"}/>
    </div>
  )
}

export default HomePage
