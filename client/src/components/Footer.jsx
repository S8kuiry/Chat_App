import React from 'react'
import { mySocials } from '../assets/assets'
import { motion } from 'framer-motion'

const Footer = ({position}) => {
  return (
    <div>
      <div className={`absolute py-8 inset-x-0 -bottom-0 flex flex-wrap items-center justify-center gap-4 bg-transparent `}>
        
        <div className="h-full flex items-center justify-center gap-2 sm:gap-4 text-sm text-gray-300">
          <p className="hover:underline cursor-pointer">Contact</p>
          <p className="hover:underline cursor-pointer">Let's Collaborate for more fun projects</p>
        </div>

        <div className="flex flex-wrap items-center justify-center h-full gap-3 mx-6">
          {mySocials.map((itm, index) => (
            <motion.a 
              whileHover={{ y: -3 }}
              transition={{ duration: 0.4 }}
              key={index} 
              href={itm.href} 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <img 
                src={itm.icon} 
                className={`${itm.name === "Github" ? "w-9" : "w-5"} shadow-md`} 
                alt={`${itm.name}-icon`} 
              />
            </motion.a>
          ))}
        </div>

        <div className="h-full flex items-center justify-center gap-2 sm:gap-4 text-sm text-gray-400">
          <p>Let’s build something amazing together.</p>
          <p>© {new Date().getFullYear()} Subharthy Kuiry</p>
        </div>
        
      </div>
    </div>
  )
}

export default Footer
