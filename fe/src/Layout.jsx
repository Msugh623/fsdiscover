import React, { useEffect, useState } from 'react'
import TaskBar from './components/TaskBar'
import Opened from './components/Opened'
import { Outlet, Route, Routes } from 'react-router-dom'
import Background from './components/Background'
import { useStateContext } from './state/StateContext'
import About from './pages/About'
import Contact from './pages/Contact'
import { ToastContainer } from 'react-toastify'
import Loader from './components/Loader'
import Admin from './pages/Admin'
import AddApp from './pages/AddApp'
import AdminIndex from './pages/AdminIndex'
import Login from './pages/authPages/Login'
import { Helmet } from 'react-helmet'
import FileManager from './apps/fsmanager/FileManager'
import FsContext from './state/FsContext'

const Layout = () => {
    const { fetchSrc, pop } = useStateContext()
    const [hasLoader, setLoader] = useState(true)

    useEffect(() => {
        fetchSrc()
        setTimeout(() => {
            setLoader(false)
        }, 1500);
    }, [])

    return (
        <>
            <main style={{ opacity: !hasLoader ? 1 : 0 }}>
                <ToastContainer progressStyle={{ opacity: '0' }} />
                <Routes>
                    <Route path='/login' element={<Login />} />

                    <Route path='/about' element={<About />} />
                    <Route path='/contact' element={<Contact />} />

                    {/* File Explorer */}
                    <Route path='/fsexplorer' element={<FsContext ><FileManager /></FsContext>} >
                        <Route index element={<div>File Manager</div>} />
                    </Route>

                    {/* Home */}
                    <Route path='/' element={
                        <>
                            <Background />
                            <Opened />
                            <Outlet />
                        </>
                    } >
                        <Route index element={<TaskBar />} />
                        <Route path='/:page' element={<TaskBar />} />
                    </Route>

                    {/* Admin */}
                    <Route path='/admin' element={
                        <Admin />
                    } >
                        <Route index element={<AdminIndex />} />
                        <Route path='app/add' element={<AddApp />} />
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
            {
                hasLoader &&
                <Loader animate={true} />
            }
        </>
    )
}

export default Layout
