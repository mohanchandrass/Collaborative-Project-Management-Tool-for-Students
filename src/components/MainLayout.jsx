import React from 'react'
import Sidebar from './Sidebar'
import UserProfile from './UserProfile'
import MainContent from './MainContent'
import '../App.css'

const MainLayout = () => {
  return (
    <div className="main-layout">
      <div className="sidebar-container">
        <Sidebar />
        <UserProfile />
      </div>
      <MainContent />
    </div>
  )
}

export default MainLayout