import React from 'react'
import {Navigate, Route, Routes} from 'react-router-dom'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import ProfilePage from './pages/ProfilePage'
import {Toaster} from 'react-hot-toast'
import { useAppContext } from '../context/AuthContext'


const App = () => {
  const {authUser,loading} = useAppContext()
  if (loading) return <div className="text-white text-center p-8">Loading...</div>; // ⏳ wait until checkAuth finishes
  return (
    <div className="bg-[url('/bgImage.svg')] bg-contain">
      <Toaster position='top-right'/>
      <Routes>
        <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" />} />
  <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
  <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
      </Routes>
    </div>
  )
}

export default App