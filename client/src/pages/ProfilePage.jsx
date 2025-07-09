import React, { useState } from 'react'
import assets from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAppContext } from '../../context/AuthContext'
import toast from 'react-hot-toast'
import { Particles } from '../components/Particles'
import Footer from '../components/Footer'

const ProfilePage = () => {
  const navigate = useNavigate()
  const { authUser, updateProfile } = useAppContext()

  const [fullName, setFullName] = useState(authUser.fullName)
  const [bio, setBio] = useState(authUser.bio)
  const [image, setImage] = useState(`${authUser.profilePic}`)

  const onSubmitHandler = async (e) => {
    e.preventDefault()
    
    if (!image) {
      await updateProfile({ fullName, bio })
      toast.success("Profile Updated Succesfully")

      navigate('/');
      return;

    }
    const reader = new FileReader();
    reader.readAsDataURL(image)
    reader.onload = async () => {
  const base64Image = reader.result;

  console.log("Base64 Image Preview:", base64Image.slice(0, 100)); // Should start with "data:image/jpeg;base64,..."
  
  await updateProfile({ profilePic: base64Image, fullName, bio });
  toast.success("Profile Updated Succesfully")
  navigate('/')
};
  }
  return (
    <div className='relative w-full h-screen flex items-center justify-center overflow-y-scroll sm:px-[15%] sm:py-[5%]'>
      <Particles size={1}/>
            <Particles size={1}/>

      
      <motion.div
        initial={{ opacity: 0, y: -150 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 50, damping: 5 }}
        className="w-[43rem] backdrop-blur-md border-2 border-gray-600 rounded-md py-4 flex items-center justify-center"
      >
        <div className="w-[55%] flex flex-col items-start p-6 gap-4 pl-6">
          <motion.button
          whileHover={{scale:1.03,y:-3}}
          whileTap={{scale:0.96}}
       
        onClick={() => navigate('/')} className='absolute text-xs border-1 border-neutral-400  px-4 py-2 shadow shadow-lg  top-5 right-5 rounded-md  text-violet-300 font-bold'>Go to chat →</motion.button>
          <p className='text-neutral-100  shadow-md'>Profile Details</p>

          <label className='flex items-center gap-4 cursor-pointer'>
            <img
              src={authUser.profilePic|| assets.avatar_icon}
              alt="avatar"
              className='w-[3.5rem] h-[3.5rem] rounded-full'
            />
            <input
              type='file'
              hidden
              accept='.png,.jpg,.jpeg'
              onChange={e => setImage(e.target.files[0])}
            />
            <span className='text-neutral-300'>
              {image ? "Change Selected Pic" : "Upload Profile Pic"}
            </span>
          </label>

          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder='Your Name'
            className='w-full h-[3rem] p-2 bg-transparent border-1 border-gray-500 rounded-md text-white placeholder-gray-600 focus:border-purple-400 focus:outline-none'
          />

          <textarea
            value={bio}
            onChange={(e)=> setBio(e.target.value)}
            placeholder='Write your bio...'
            className='w-full h-[8rem] p-2 bg-transparent border-1 border-gray-500 rounded-md text-white placeholder-gray-600 focus:border-purple-400 focus:outline-none'
          />

          <button
            onClick={onSubmitHandler}
            className="w-full h-[3rem] rounded-full flex items-center justify-center text-white font-semibold"
            style={{
              background:
                "linear-gradient(to right, rgba(223, 161, 254, 0.96), rgba(150, 16, 218, 0.96))",
            }}
          >
            Save Changes
          </button>
        </div>

        <div className="w-[45%] flex items-center justify-center">
          <motion.img
            src={authUser.profilePic || assets.logo_icon}
            alt="logo"
            whileTap={{ scale: 0.96 }}
            className={`${authUser.profilePic?"rounded-[50%] w-[13rem] h-[13rem]":"w-[10rem]"}`}
          />
        </div>
      </motion.div>
      <Footer position={"0"}/>
    </div>
  )
}

export default ProfilePage
