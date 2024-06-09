import React, { useState } from 'react'
import { Outlet } from 'react-router-dom';
import SideBar from '../DashShared/SideBar/SideBar';
import DashNav from '../DashShared/DashNav/DashNav';

export const DashBoardLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const toggleSidebar = () => {
      setIsSidebarOpen(!isSidebarOpen);
      // console.log(isSidebarOpen);
    };
  return (
    <>
    <div className="flex">
      {/* Sidebar of dashboard starts here */}
      <div
        className={`side_bar min-h-screen fixed w-64 xl:min-w-[300px] z-[99999] text-white transition-all duration-300 ${isSidebarOpen ? "-ml-64 lg:ml-0" : "lg:-ml-64 xl:-ml-[300px]"
          }`}
      >
        <SideBar></SideBar>
      </div>
      {/* Main content of Dashboard starts here */}
      <div className={`main_content w-svw transition-all duration-300 ${isSidebarOpen ? "lg:ml-64 xl:ml-[300px]" : ""}`}>
        <DashNav toggleSidebar={toggleSidebar} ></DashNav>
        <div className="flex-1 px-6 mt-6">
          <Outlet></Outlet>
         
        </div>
      </div>
    </div>
  </>
  )
}
