import React, { useState } from 'react'
import assets from '../assets/assets'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../../context/AuthContext'
import toast from 'react-hot-toast'
import { Particles } from '../components/Particles'
import Footer from '../components/Footer'

const LoginPage = () => {
  const [state, setLoginState] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const {login} = useAppContext()

  const navigate = useNavigate()

  const signup = async () => {
    try {
      if (!email || !password || !fullName) {
        return toast.error("Fill all the required fields");
      }

      const credentials = { email, fullName, password };
      const data = await login("signup", credentials);

      if (data.success) {
        setEmail(""); setPassword(""); setFullName("");
        
        toast.success("Now log in to continue");
        setLoginState(true); // switch to login mode
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const loginHandler = async () => {
    try {
      if (!email || !password) return toast.error("Fill all the required fields");
      const credentials = { email, password };
      const data = await login("login", credentials);
      if (data.success) {
        setEmail(""); setPassword("");
        navigate('/profile'); // ✅ navigate to profile
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <div

      className='relative w-full h-screen border sm:px-[15%] sm:py-[5%] backdrop-blur-md flex items-center justify-center'>
              <Particles size={1}/>
              <Particles size={1}/>
        
      <motion.div
        initial={{ opacity: 0, y: -150 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', damping: 4, stiffness: 50 }}
        className="w-[70vw] flex  items-center justify-between">
        {/*--------- logo ----------- */}
        <div className="flex flex-col items-center justify-center">
          <motion.img
            whileTap={{ scale: 0.96 }} src={assets.logo_big} className='w-[15rem] my-6'></motion.img>

        </div>

        {/*----------- login form ----------- */}
        <div className="z-20 flex flex-col items-center justify-start rounded-lg py-4 px-6 h-[28rem] w-[22rem]
  backdrop-blur-md bg-white/10 border-2 border-gray-700/90">
          <p className='text-white font-bold  text-2xl w-full text-left mb-6 mt-2'>{state ? "Login" : 'Sign Up'}</p>

          {/*----- input sections --------- */}
          {!state &&
            <input value={fullName} onChange={(e) => setFullName(e.target.value)} required placeholder='Full Name' className='placeholder:text-neutral-400 w-[100%] h-[3.3rem] px-3 text-white bg-transparent border-2 border-gray-600 rounded-md '></input>

          }

          <input value={email} onChange={(e) => setEmail(e.target.value)} required placeholder='Email Address' className='placeholder:text-neutral-400 w-[100%] h-[3.3rem] px-3 text-white bg-transparent border-2 border-gray-600 rounded-md my-6 '></input>


          <input value={password} onChange={(e) => setPassword(e.target.value)} required placeholder='Password' className='placeholder:text-neutral-400 w-[100%] h-[3.3rem] px-3 text-white bg-transparent border-2 border-gray-600 rounded-md '></input>


          {/*------ create acc button ---------- */}
          <button
            onClick={state?loginHandler:signup}
            style={{
              background: 'linear-gradient(to right, rgba(221, 194, 235, 0.96), rgba(149, 23, 212, 0.96))'
            }}
            className='cursor-pointer text-white font-semibold w-full h-[3.6rem] flex items-center justify-center my-4 rounded-sm'
          >
            {state ? "Sign In" : "Create Account"}
          </button>
          {
            state ? (
              <div onClick={() => setLoginState(false)} className='text-xs text-white mt-6 cursor-pointer'>Dont have an Account?<span style={{ color: 'rgba(160, 100, 213, 0.99)' }} className='text-[rgba(160, 100, 213, 0.99)] font-semibold' > Sign Up </span></div>


            ) : (
              <div onClick={() => setLoginState(true)} className='text-xs text-white mt-6 cursor-pointer'>Already Have an Account?<span style={{ color: 'rgba(160, 100, 213, 0.99)' }} className='text-[rgba(160, 100, 213, 0.99)] font-semibold' > Login here</span></div>


            )
          }


        </div>
       
        
      </motion.div>
       <Footer position={10} />
    </div>
  )
}

export default LoginPage