
import React from "react"

import { Outlet } from 'react-router-dom';
import MenuBar from './menu-bar/menu-bar.js'

function Layout() {
  return (
    <div>
      <MenuBar/>
      <Outlet/>
    </div>
  )
}

export default Layout;
