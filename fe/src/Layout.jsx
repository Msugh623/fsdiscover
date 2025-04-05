import React from 'react'
import TaskBar from './components/TaskBar'
import Opened from './components/Opened'
import { Outlet, Route, Routes } from 'react-router-dom'
import Background from './components/Background'
import { useStateContext } from './state/StateContext'
import About from './pages/About'
import Contact from './pages/Contact'
import { ToastContainer } from 'react-toastify'
import Admin from './pages/Admin'
import AddApp from './pages/AddApp'
import AdminIndex from './pages/AdminIndex'
import Login from './pages/authPages/Login'
import FileManager from './apps/fsmanager/FileManager'
import FsContext from './state/FsContext'
import MainSection from './apps/fsmanager/MainSection'

const Layout = () => {
    const {  pop } = useStateContext()


    return (
        <>
            <main >
                <ToastContainer progressStyle={{ opacity: '0' }} />
                <Routes>
                    <Route path='/login' element={<Login />} />

                    <Route path='/about' element={<About />} />
                    <Route path='/contact' element={<Contact />} />

                    {/* File Explorer */}
                    <Route path='fsexplorer' element={<FsContext ><FileManager /></FsContext>} >
                        <Route index element={<MainSection/>} />                    
                        <Route path='*' element={<MainSection/>} />
                    </Route>

                    {/* Home */}
                    <Route path='/' element={
                        <Admin />
                    } >
                        <Route index element={<AdminIndex />} />
                        <Route path='app/add' element={<AddApp />} />
                    </Route>
                    
                    {/* Admin */}
                    <Route path='/os' element={
                        <>
                            <Background />
                            <Opened />
                            <Outlet />
                        </>
                    } >
                        <Route index element={<TaskBar />} />
                        <Route path='/os:page' element={<TaskBar />} />
                    </Route>

                </Routes>
            </main>
            {pop && <div className='d-flex w-100' style={{
                position: 'fixed',
                top: '0px',
                bottom: '0px',
                right: '0px',
                leftt: '0px',
                backgroundColor: '#afefff10',
                zIndex: '10000'
            }}>
                {pop}
            </div>}
        </>
    )
}

export default Layout
